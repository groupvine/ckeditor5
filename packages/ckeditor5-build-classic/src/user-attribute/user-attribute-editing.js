import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import UserAttributeCommand from './user-attribute-command';

import './theme/user-attribute.css';

import { dateVer }             from '../lib';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';


export default class UserAttributeEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        // console.log( 'UserAttributeEditing#init() got called' );
        this._defineSchema();
        this._defineConverters();

        this.editor.commands.add( 'gv-metatag', new UserAttributeCommand( this.editor ) );

        this.editor.config.define( 'userAttribute', {
            types: [
                { label : 'First Name', type : 'attribute/firstname' },
                { label : 'Last Name',  type : 'attribute/lastname'  },
                { label : 'Email',      type : 'attribute/email'     }
            ],
            metaImgBaseUrl: null    // null default, so this is required
        } );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'gv-metatag', {
            // Allow wherever text is allowed plus in tableCells
            // allowIn: 'tableCell',
            allowWhere: '$text',

            // The user-attribute will act as an inline node:
            isInline: true,

            // The inline widget is self-contained so it cannot be split by the caret and can be selected:
            isObject: true,

            // The user-attribute can have many types: firstname, lastname, email, id, etc.
            allowAttributes: [ 'type', 'ewId', 'ver' ]
        } );
    }

    _defineConverters() {
        const conversion = this.editor.conversion;
        const metaImgBaseUrl = this.editor.config.get('userAttribute.metaImgBaseUrl');

        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'span',
                classes: [ 'gv-metatag' ],
                converterPriority: 'highest'  // be sure it converts ahead of regular images
            },
            model: ( viewElement, {writer: modelWriter} ) => {
                // Note that this is called after the custom GV data processor's 
                // toView() has run

                // Extract the "type" from the src URL
                const attType = viewElement.getChild(0).data.trim();

                let data = {
                    type : attType
                };

                // Check for supported data attrbutes
                let ewId = viewElement.getAttribute('data-ewid');
                if (ewId != null) {
                    data['ewId'] = ewId;
                    data['ver']  = dateVer();
                }

                // console.log("Upcast: " + attType);
                return modelWriter.createElement( 'gv-metatag', data );
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'gv-metatag',
            view: ( modelItem, {writer: viewWriter} ) => {
                const widgetElement = createUserAttributeView( modelItem, {writer: viewWriter} );

                // Enable widget handling on a gv-metatag element inside the editing view.
                return toWidget( widgetElement, viewWriter );
            }
        } ).add( dispatcher => dispatcher.on( 'attribute:ver', handleVerChange ) );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'gv-metatag',
            view: createUserAttributeView
        } ).add( dispatcher => dispatcher.on( 'attribute:ver', handleVerChange ) );

        // Helper method for both downcast converters.
        function createUserAttributeView( modelItem, {writer: viewWriter} ) {
            const attType = modelItem.getAttribute( 'type' );
            const attEwId = modelItem.getAttribute( 'ewId' );
            const attVer  = modelItem.getAttribute( 'ver' );

            let src = metaImgBaseUrl + '/' + attType;
            if (attEwId != null) {
                src += "?ewid=" + attEwId;
                src += "&_=" + attVer;   // cache-buster, for late
            }

            const userAttributeView = viewWriter.createContainerElement( 'img', {src : src});
            // console.log("Downcast: " + attType);

            return userAttributeView;
        }

        function handleVerChange ( evt, data, conversionApi ) {
            // see: https://stackoverflow.com/questions/51319311/refreshing-a-ckeditor5-widget-upon-model-changes
            let xx = 1;
            
            // const myModelElement = data.item;

            // Mark element as consumed by conversion.
            // conversionApi.consumable.consume( data.item, evt.name );

            // Get mapped view element to update.
            // const viewElement = conversionApi.mapper.toViewElement( myModelElement );

            // Remove current <div> element contents.
            // conversionApi.writer.remove( ViewRange.createOn( viewElement.getChild( 0 ) ) );

            // Set current content
            // setContent( conversionApi.writer, data.attributeNewValue, viewElement );
        }
    }
}
