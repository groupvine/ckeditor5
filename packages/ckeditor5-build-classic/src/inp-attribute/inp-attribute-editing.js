import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import InputAttributeCommand from './inp-attribute-command';

import './theme/inp-attribute.css';

import {
  toWidget,
  viewToModelPositionOutsideModelElement,
} from "@ckeditor/ckeditor5-widget/src/utils";

import Widget from '@ckeditor/ckeditor5-widget/src/widget';

import { rsvdAttributesBaseObjs,
         rsvdAttributesTextingObjs,
         MemberAttribute,
         MultiChoiceAttribute,
         SingleChoiceAttribute,
         NumericIntegerAttribute,
         CheckboxAttribute,
         NumericAttribute,
         FreeTextAttribute } from 'gv-types/attribute';

import { ValueType } from 'gv-types'; 


export default class InputAttributeEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        this._defineSchema();
        this._defineConverters();

        // console.log( 'InputAttributeEditing#init() got called' );
        this.editor.commands.add( 'gv-input-attribute', new InputAttributeCommand( this.editor ) );

        // This viewToModelPosition utility is required to avoid the error
        //    model-nodelist-offset-out-of-bounds  
        // reported to the console.  This occurs since the model
        // element (e.g., <gv-input-attribute type="email"></gv-input-attribute>
        // has no text, but the view element has text, such as the input element and label.
        this.editor.editing.mapper.on("viewToModelPosition",
                                      viewToModelPositionOutsideModelElement(this.editor.model, (viewElement) => {
                                          return viewElement.hasClass("gv-no-model-text");
                                      })
                                     );

        let attTypes = rsvdAttributesBaseObjs.concat(rsvdAttributesTextingObjs);

        attTypes.push(new NumericIntegerAttribute('Grade'));

        // For testing groups & lists
        attTypes.push(new MultiChoiceAttribute('list', {
            isStd   : true,
            choices : [
                { value : '123',  label : 'Runners List' },
                { value : '456',  label : 'Walkers List' },
                { value : '789',  label : 'Crawlers List' }
            ]
        }));

        attTypes.push(new MultiChoiceAttribute('group', {
            isStd   : true,
            choices : [
                { value : '123',  label : 'Staff Group' },
                { value : '456',  label : 'Investors Group' }
            ]
        }));

        this.editor.config.define( 'inputAttribute', {
            types: attTypes
        } );
    }

    _defineSchema() {
        const schema = this.editor.model.schema;

        schema.register( 'gv-input-attribute', {
            // Allow wherever text is allowed
            allowWhere: '$text',

            // The inline widget is self-contained so it cannot be split by the caret and can be selected:
            isObject: true,

            // The inp-attribute can have many types, firstname, lastname, email, id, etc.
            allowAttributes: [ 'type', 'alignment' ]
        } );
    }

    _defineConverters() {
        let editor = this.editor;
        const conversion = editor.conversion;

        let inputAttTypes = null;
        let typesDict = {};

        function setInputTypes() {
            inputAttTypes = editor.config.get('inputAttribute.types');

            for (let i = 0; i < inputAttTypes.length; i++) {
                typesDict[inputAttTypes[i].abbrev] = inputAttTypes[i];
            }
        }

        conversion.for( 'upcast' ).elementToElement( {
            view: {
                name: 'div',
                classes: [ 'gv-input-attribute' ],
                converterPriority: 'highest'  // be sure it converts ahead of, e.g., outside wrapper figures or whatever
            },
            model: ( viewElement, modelWriter ) => {
                if (inputAttTypes == null) { setInputTypes(); }

                // Extract the "type" from data-type attribute
                const attType = viewElement.getAttribute('data-type');

                // console.log("Upcast: " + attType);
                return modelWriter.createElement( 'gv-input-attribute', { type : attType } );
            }
        } );

        conversion.for( 'editingDowncast' ).elementToElement( {
            model: 'gv-input-attribute',
            view: ( modelItem, viewWriter ) => {
                const widgetElement = createInputAttributeView( modelItem, viewWriter, {disabled:true} );

                // Enable widget handling on a gv-input-attribute element inside the editing view.
                return toWidget( widgetElement, viewWriter );
            }
        } );

        conversion.for( 'dataDowncast' ).elementToElement( {
            model: 'gv-input-attribute',
            view: ( modelItem, viewWriter ) => {
                return createInputAttributeView( modelItem, viewWriter, {disabled:false} );
            }
        } );


        // Helper method for both downcast converters.
        function createInputAttributeView( modelItem, viewWriter, options ) {
            if (!options) { options = {}; }
            if (inputAttTypes == null) { setInputTypes(); }

            const attType = modelItem.getAttribute( 'type' );
            const typeObj = typesDict[attType];

            if (typeObj == null) {
                const inputAttributeView = viewWriter.createContainerElement( 'div', {
                    class       : 'gv-input-invalid gv-no-model-text',
                    'data-type' : attType
                }); 

                let invalidText = viewWriter.createText('[Invalid attribute type: ' + attType + ']');
                viewWriter.insert( viewWriter.createPositionAt( inputAttributeView, 0 ), invalidText );

                let errMsg = "GroupVine unable to find outdated(?) attribute type: " + attType;
                console.warn(errMsg);

                return inputAttributeView;
            }

            const inputAttributeView = viewWriter.createContainerElement( 'div', {
                class       : 'gv-input-attribute block gv-no-model-text',
                'data-type' : attType
            }); 

            // console.log("Downcast: " + attType);

            // See here for types of view elements:
            // https://ckeditor.com/docs/ckeditor5/latest/framework/guides/architecture/editing-engine.html#element-types-and-custom-data

            // Insert the input element

            let labelElemText = null;

            let inputElem;
            let textElem;
            let choices;
            let choiceElem;
            let choiceWrapper;

            switch (typeObj.type) {

            case ValueType.NumericFloat:
            case ValueType.NumericInteger:
            case ValueType.NumericQuantity:
                inputElem = viewWriter.createEmptyElement('input', {
                    id          : 'gv-input-' + attType,
                    class       : 'gv-input-wrapper gv-input-numeric',
                    name        : attType,
                    type        : 'number',
                    placeholder : 'Enter ' + typeObj.title,
                    size        : 10,
                    disabled    : options.disabled ? true : null
                    // style       : 'font-size: 14px;color: #444;margin: 3px;padding: 3px;'
                });

                break;
            case ValueType.ChoiceMultiple:
                inputElem = viewWriter.createContainerElement('span', {
                    id          : 'gv-input-wrapper-' + attType,
                    class       : 'gv-input-wrapper gv-input-multichoice gv-no-model-text',
                    style       : 'max-height:120px;overflow:auto;padding:5px;'
                });

                choices = JSON.parse(JSON.stringify(typeObj.choices));
                choices.reverse();

                let nameStr;

                for (let i = 0; i < choices.length; i++) {
                    nameStr = attType + ':' + choices[i].value;
                    choiceElem = viewWriter.createContainerElement('input', {
                        id        : 'gv-input-' + nameStr,
                        class     : 'gv-input-checkbox',
                        name      : nameStr,
                        type      : 'checkbox',
                        disabled  : options.disabled ? true : null,
                        value     : choices[i].value,
                        style     : 'transform: scale(1.5);margin-right: 10px;'
                    });

                    textElem = viewWriter.createText(' ' + choices[i].label);

                    choiceWrapper = viewWriter.createContainerElement('span', {
                        class : 'gv-input-wrapper-checkbox gv-no-model-text',
                        style : 'margin:10px 0;display:block'
                    });

                    viewWriter.insert( viewWriter.createPositionAt( choiceWrapper, 0 ), textElem );
                    viewWriter.insert( viewWriter.createPositionAt( choiceWrapper, 0 ), choiceElem );
                    
                    viewWriter.insert( viewWriter.createPositionAt( inputElem, 0 ), choiceWrapper );
                }

                break;
            case ValueType.ChoiceSingle:

                inputElem = viewWriter.createContainerElement('select', {
                    id          : 'gv-input-' + attType,
                    class       : 'gv-input-wrapper gv-input-singlechoice gv-no-model-text',
                    name        : attType,
                    placeholder : 'Select ' + typeObj.title,
                    disabled    : options.disabled ? true : null
                    // style       : 'font-size: 14px;color: #444;margin: 3px;padding: 3px;'
                });

                choices = JSON.parse(JSON.stringify(typeObj.choices));
                choices.reverse();

                for (let i = 0; i < choices.length; i++) {
                    choiceElem = viewWriter.createContainerElement('option', {
                        class : 'gv-no-model-text',
                        value : choices[i].value
                    });
                    textElem = viewWriter.createText(choices[i].label);
                    viewWriter.insert( viewWriter.createPositionAt( choiceElem, 0 ), textElem );
                    viewWriter.insert( viewWriter.createPositionAt( inputElem, 0 ), choiceElem );
                }

                choiceElem = viewWriter.createContainerElement('option', {
                    value    : '',
                    selected : true,
                    class    : 'gv-option-placholder gv-no-model-text'
                    // disabled : true,
                    // hidden   : true   // comment out to leave as a dropdown option
                });
                textElem = viewWriter.createText('Select ' + typeObj.title);
                viewWriter.insert( viewWriter.createPositionAt( choiceElem, 0 ), textElem );
                viewWriter.insert( viewWriter.createPositionAt( inputElem, 0 ), choiceElem );

                break;
            case ValueType.Checkbox:
                // <input type="checkbox" name="vehicle1" value="Bike"> I have a bike<br>
                inputElem = viewWriter.createEmptyElement('input', {
                    id       : 'gv-input-' + attType,
                    class    : 'gv-input-wrapper gv-input-checkbox',
                    name     : attType,
                    type     : 'checkbox',
                    value    : attType,
                    disabled : options.disabled ? true : null,
                    style     : 'transform: scale(1.5);margin-right: 10px;'
                });

                break;
            default:
                inputElem = viewWriter.createEmptyElement('input', {
                    id          : 'gv-input-' + attType,
                    class       : 'gv-input-wrapper gv-input-text',
                    name        : attType,
                    type        : 'text',
                    placeholder : 'Enter ' + typeObj.title,
                    disabled    : options.disabled ? true : null
                    // style       : 'font-size: 14px;color: #444;margin: 3px;padding: 3px;'
                });
            }

            let title = typeObj.title;

            if (typeObj.abbrev === 'group') {
                title = 'Select sub-groups';
            } else if (typeObj.abbrev === 'list') {
                title = 'Select lists';
            } 

            labelElemText = viewWriter.createText(title + ':');

            let labelElem = viewWriter.createContainerElement( 'span', {
                class       : 'gv-input-label'
            }); 
            viewWriter.insert( viewWriter.createPositionAt( labelElem, 0 ), labelElemText );


            viewWriter.insert( viewWriter.createPositionAt( inputAttributeView, 0 ), inputElem );
            viewWriter.insert( viewWriter.createPositionAt( inputAttributeView, 0 ), labelElem );

            return inputAttributeView;
        }
    }
}
