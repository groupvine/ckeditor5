/**
 * @license Copyright (c) 2003-2021, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module image/imageutils
 */

import { Plugin } from 'ckeditor5/src/core';
import { findOptimalInsertionRange, isWidget, toWidget } from 'ckeditor5/src/widget';
import { determineImageTypeForInsertionAtSelection } from './image/utils';

/**
 * A set of helpers related to images.
 *
 * @extends module:core/plugin~Plugin
 */
export default class ImageUtils extends Plugin {
	/**
	 * @inheritDoc
	 */
	static get pluginName() {
		return 'ImageUtils';
	}

	/**
	 * Checks if the provided model element is an `image` or `imageInline`.
	 *
	 * @param {module:engine/model/element~Element} modelElement
	 * @returns {Boolean}
	 */
	isImage( modelElement ) {
		return this.isInlineImage( modelElement ) || this.isBlockImage( modelElement );
	}

	/**
	 * Checks if the provided view element represents an inline image.
	 *
	 * Also, see {@link module:image/imageutils~ImageUtils#isImageWidget}.
	 *
	 * @param {module:engine/view/element~Element} element
	 * @returns {Boolean}
	 */
	isInlineImageView( element ) {
		return !!element && element.is( 'element', 'img' );
	}

	/**
	 * Checks if the provided view element represents a block image.
	 *
	 * Also, see {@link module:image/imageutils~ImageUtils#isImageWidget}.
	 *
	 * @param {module:engine/view/element~Element} element
	 * @returns {Boolean}
	 */
	isBlockImageView( element ) {
		return !!element && element.is( 'element', 'figure' ) && element.hasClass( 'image' );
	}

	/**
	 * Handles inserting single file. This method unifies image insertion using {@link module:widget/utils~findOptimalInsertionRange}
	 * method.
	 *
	 *		insertImage( model, { src: 'path/to/image.jpg' } );
	 *
	 * @param {Object} [attributes={}] Attributes of the inserted image.
	 * This method filters out the attributes which are disallowed by the {@link module:engine/model/schema~Schema}.
	 * @param {module:engine/model/selection~Selectable} [selectable] Place to insert the image. If not specified,
	 * the {@link module:widget/utils~findOptimalInsertionRange} logic will be applied for the block images
	 * and `model.document.selection` for the inline images.
	 *
	 * **Note**: If `selectable` is passed, this helper will not be able to set selection attributes (such as `linkHref`)
	 * and apply them to the new image. In this case, make sure all selection attributes are passed in `attributes`.
	 * @param {'image'|'imageInline'} [imageType] Image type of inserted image. If not specified,
	 * it will be determined automatically depending of editor config or place of the insertion.
	 */
	insertImage( attributes = {}, selectable = null, imageType = null ) {
		const editor = this.editor;
		const model = editor.model;
		const selection = model.document.selection;

		imageType = determineImageTypeForInsertion( editor, selectable || selection, imageType );

		// Mix declarative attributes with selection attributes because the new image should "inherit"
		// the latter for best UX. For instance, inline images inserted into existing links
		// should not split them. To do that, they need to have "linkHref" inherited from the selection.
		attributes = {
			...Object.fromEntries( selection.getAttributes() ),
			...attributes
		};

		for ( const attributeName in attributes ) {
			if ( !model.schema.checkAttribute( imageType, attributeName ) ) {
				delete attributes[ attributeName ];
			}
		}

		model.change( writer => {
			const imageElement = writer.createElement( imageType, attributes );

			// If we want to insert a block image (for whatever reason) then we don't want to split text blocks.
			// This applies only when we don't have the selectable specified (i.e., we insert multiple block images at once).
			if ( !selectable && imageType != 'imageInline' ) {
				selectable = findOptimalInsertionRange( selection, model );
			}

			model.insertContent( imageElement, selectable );

			// Inserting an image might've failed due to schema regulations.
			if ( imageElement.parent ) {
				writer.setSelection( imageElement, 'on' );
			}
		} );
	}

	/**
	 * Checks if image can be inserted at current model selection.
	 *
	 * @protected
	 * @returns {Boolean}
	 */
	isImageAllowed() {
		const model = this.editor.model;
		const selection = model.document.selection;

		return isImageAllowedInParent( this.editor, selection ) && isNotInsideImage( selection );
	}

	/**
	 * Converts a given {@link module:engine/view/element~Element} to an image widget:
	 * * Adds a {@link module:engine/view/element~Element#_setCustomProperty custom property} allowing to recognize the image widget
	 * element.
	 * * Calls the {@link module:widget/utils~toWidget} function with the proper element's label creator.
	 *
	 * @protected
	 * @param {module:engine/view/element~Element} viewElement
	 * @param {module:engine/view/downcastwriter~DowncastWriter} writer An instance of the view writer.
	 * @param {String} label The element's label. It will be concatenated with the image `alt` attribute if one is present.
	 * @returns {module:engine/view/element~Element}
	 */
	toImageWidget( viewElement, writer, label ) {
		writer.setCustomProperty( 'image', true, viewElement );

		const labelCreator = () => {
			const imgElement = this.getViewImageFromWidget( viewElement );
			const altText = imgElement.getAttribute( 'alt' );

			return altText ? `${ altText } ${ label }` : label;
		};

		return toWidget( viewElement, writer, { label: labelCreator } );
	}

	/**
	 * Checks if a given view element is an image widget.
	 *
	 * @protected
	 * @param {module:engine/view/element~Element} viewElement
	 * @returns {Boolean}
	 */
	isImageWidget( viewElement ) {
		return !!viewElement.getCustomProperty( 'image' ) && isWidget( viewElement );
	}

	/**
	 * Returns an image widget editing view element if one is selected.
	 *
	 * @protected
	 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
	 * @returns {module:engine/view/element~Element|null}
	 */
	getSelectedImageWidget( selection ) {
		const viewElement = selection.getSelectedElement();

		if ( viewElement ) {
			if ( this.isImageWidget( viewElement ) ) {
				return viewElement;
			}

			// If a selected inline image widget is the only child of a link, the selection will encompass
			// that link. But this still counts as a selected image widget. This is what it looks like:
			// [<a href="..."><span class="image-inline ck-widget ck-widget_selected"><img ... /></span></a>]
			if ( viewElement.is( 'element', 'a' ) && viewElement.childCount === 1 ) {
				const firstChild = viewElement.getChild( 0 );

				if ( firstChild.is( 'element' ) && this.isImageWidget( firstChild ) ) {
					return firstChild;
				}
			}
		}

		return null;
	}

	/**
	 * Returns a image widget editing view element if one is among the selection's ancestors.
	 *
	 * @protected
	 * @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
	 * @returns {module:engine/view/element~Element|null}
	 */
	getImageWidgetAncestor( selection ) {
		let parent = selection.getFirstPosition().parent;

		while ( parent ) {
			if ( parent.is( 'element' ) && this.isImageWidget( parent ) ) {
				return parent;
			}

			parent = parent.parent;
		}

		return null;
	}

	/**
	 * Checks if the provided model element is an `image`.
	 *
	 * @protected
	 * @param {module:engine/model/element~Element} modelElement
	 * @returns {Boolean}
	 */
	isBlockImage( modelElement ) {
		return !!modelElement && modelElement.is( 'element', 'image' );
	}

	/**
	 * Checks if the provided model element is an `imageInline`.
	 *
	 * @protected
	 * @param {module:engine/model/element~Element} modelElement
	 * @returns {Boolean}
	 */
	isInlineImage( modelElement ) {
		return !!modelElement && modelElement.is( 'element', 'imageInline' );
	}

	/**
	 * Get view `<img>` element from the view widget (`<figure>`).
	 *
	 * Assuming that image is always a first child of a widget (ie. `figureView.getChild( 0 )`) is unsafe as other features might
	 * inject their own elements to the widget.
	 *
	 * The `<img>` can be wrapped to other elements, e.g. `<a>`. Nested check required.
	 *
	 * @protected
	 * @param {module:engine/view/element~Element} figureView
	 * @returns {module:engine/view/element~Element}
	 */
	getViewImageFromWidget( figureView ) {
		if ( this.isInlineImageView( figureView ) ) {
			return figureView;
		}

		const figureChildren = [];

		for ( const figureChild of figureView.getChildren() ) {
			figureChildren.push( figureChild );

			if ( figureChild.is( 'element' ) ) {
				figureChildren.push( ...figureChild.getChildren() );
			}
		}

		return figureChildren.find( this.isInlineImageView );
	}
}

// Checks if image is allowed by schema in optimal insertion parent.
//
// @private
// @param {module:core/editor/editor~Editor} editor
// @param {module:engine/model/selection~Selection} selection
// @returns {Boolean}
function isImageAllowedInParent( editor, selection ) {
	const imageType = determineImageTypeForInsertion( editor, selection );

	if ( imageType == 'image' ) {
		const parent = getInsertImageParent( selection, editor.model );

		if ( editor.model.schema.checkChild( parent, 'image' ) ) {
			return true;
		}
	} else if ( editor.model.schema.checkChild( selection.focus, 'imageInline' ) ) {
		return true;
	}

	return false;
}

// Checks if selection is not placed inside an image (e.g. its caption).
//
// @private
// @param {module:engine/model/selection~Selectable} selection
// @returns {Boolean}
function isNotInsideImage( selection ) {
	return [ ...selection.focus.getAncestors() ].every( ancestor => !ancestor.is( 'element', 'image' ) );
}

// Returns a node that will be used to insert image with `model.insertContent`.
//
// @private
// @param {module:engine/model/selection~Selectable} selection
// @param {module:engine/model/model~Model} model
// @returns {module:engine/model/element~Element}
function getInsertImageParent( selection, model ) {
	const insertionRange = findOptimalInsertionRange( selection, model );
	const parent = insertionRange.start.parent;

	if ( parent.isEmpty && !parent.is( 'element', '$root' ) ) {
		return parent.parent;
	}

	return parent;
}

// Determine image element type name depending on editor config or place of insertion.
//
// @private
// @param {module:core/editor/editor~Editor} editor
// @param {module:engine/model/selection~Selectable} selectable
// @param {'image'|'imageInline'} [imageType] Image element type name. Used to force return of provided element name,
// but only if there is proper plugin enabled.
// @returns {'image'|'imageInline'} imageType
function determineImageTypeForInsertion( editor, selectable, imageType ) {
	const schema = editor.model.schema;
	const configImageInsertType = editor.config.get( 'image.insert.type' );

	if ( !editor.plugins.has( 'ImageBlockEditing' ) ) {
		return 'imageInline';
	}

	if ( !editor.plugins.has( 'ImageInlineEditing' ) ) {
		return 'image';
	}

	if ( imageType ) {
		return imageType;
	}

	if ( configImageInsertType === 'inline' ) {
		return 'imageInline';
	}

	if ( configImageInsertType === 'block' ) {
		return 'image';
	}

	// Try to replace the selected widget (e.g. another image).
	if ( selectable.is( 'selection' ) ) {
		return determineImageTypeForInsertionAtSelection( editor, selectable );
	}

	return schema.checkChild( selectable, 'imageInline' ) ? 'imageInline' : 'image';
}
