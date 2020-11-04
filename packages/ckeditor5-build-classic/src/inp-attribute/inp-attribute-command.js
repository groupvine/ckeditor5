import Command from '@ckeditor/ckeditor5-core/src/command';

export default class InputAttributeCommand extends Command {

    execute( { value } ) {
        const editor = this.editor;

        editor.model.change( writer => {
            // Create a <gv-input-attribute> elment with name "type" attribute...
            const inputAtt = writer.createElement( 'gv-input-attribute', { type: value.abbrev } );

            // ... and insert it into the document.
            editor.model.insertContent( inputAtt );

            // Put the selection after the inserted element.
            writer.setSelection( inputAtt, 'after' );
        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild( selection.focus.parent, 'gv-input-attribute' );

        this.isEnabled = isAllowed;
    }
}