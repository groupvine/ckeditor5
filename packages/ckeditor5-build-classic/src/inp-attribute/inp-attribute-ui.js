import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';


export default class InputAttributeUI extends Plugin {

    init() {
        const editor   = this.editor;
        const t = editor.t;   // translator, used in t() calls below
        const inputAttTypes = this.editor.config.get('inputAttribute.types');

        // The "input-attribute" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'gv-input-attribute', locale => {
            const dropdownView = createDropdown( locale );

            // Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( inputAttTypes ) );

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: t( 'Input' ),
                tooltip: "Insert input field",
                withText: true
            } );

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( 'gv-input-attribute', { value: evt.source.commandParam } );
                editor.editing.view.focus();
            } );

            return dropdownView;
        } );
    }
}

function getDropdownItemsDefinitions( inputAttTypes ) {
    const itemDefinitions = new Collection();

    let label;
    for ( const typeObj of inputAttTypes ) {
        label = typeObj.title;

        // Special handling for certain labels.
        // (Don't want to change the titles, since that affects
        // the attribute names wherever used, tho 'groups' and 'lists'
        // are pretty special in any case)

        if (label.toLowerCase() === 'group') {
            label = 'Select sub-groups';
        } else if (label.toLowerCase() === 'list') {
            label = 'Select lists';
        }

        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: typeObj,
                label: label,
                withText: true
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    return itemDefinitions;
}
