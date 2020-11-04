import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { addListToDropdown, createDropdown } from '@ckeditor/ckeditor5-ui/src/dropdown/utils';

import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import Model from '@ckeditor/ckeditor5-ui/src/model';

import { isMobile } from '../lib';


export default class UserAttributeUI extends Plugin {

    init() {
        const editor   = this.editor;
        const t = editor.t;   // translator, used in t() calls below
        const userAttTypes = this.editor.config.get('userAttribute.types');

        // The "user-attribute" dropdown must be registered among the UI components of the editor
        // to be displayed in the toolbar.
        editor.ui.componentFactory.add( 'gv-user-attribute', locale => {
            const dropdownView = createDropdown( locale );

            dropdownView.set('class', 'personalizeDropdown');

            // Populate the list in the dropdown with items.
            addListToDropdown( dropdownView, getDropdownItemsDefinitions( userAttTypes ) );
            let isMob = isMobile();

            dropdownView.buttonView.set( {
                // The t() function helps localize the editor. All strings enclosed in t() can be
                // translated and change when the language of the editor changes.
                label: (isMob ? t('P') : t('Personalize')),
                tooltip: "Insert member attribute or other recipient-specific value",
                class: 'personalizeMenu',  // handled in styles.scss (isMob ? 'personalizeMenuMob' : 'personalizeMenu'),
                withText: true
            } );

            // Execute the command when the dropdown item is clicked (executed).
            this.listenTo( dropdownView, 'execute', evt => {
                editor.execute( 'gv-metatag', { value: evt.source.commandParam } );
                editor.editing.view.focus();
            } );

            return dropdownView;
        } );
    }
}

function getDropdownItemsDefinitions( userAttTypes ) {
    const itemDefinitions = new Collection();

    for ( const typeObj of userAttTypes ) {
        const definition = {
            type: 'button',
            model: new Model( {
                commandParam: typeObj.type,
                label: typeObj.label,
                withText: true
            } )
        };

        // Add the item definition to the collection.
        itemDefinitions.add( definition );
    }

    return itemDefinitions;
}
