import Command from '@ckeditor/ckeditor5-core/src/command';

export default class UserAttributeCommand extends Command {

    // This is shared with email-widgets code, so support ewId arg
    // (using EW2015 parameter destructuring syntax)

    execute( { value, ewId } ) {
        const editor = this.editor;

        editor.model.change( writer => {
            // Create a <gv-metatag> elment with name "type" attribute...
            let atts = {type : value};
            if (ewId !== null) {
                atts['ewId'] = ewId;
            }
            const userAtt = writer.createElement( 'gv-metatag', atts );

            // ... and insert it into the document.
            editor.model.insertContent( userAtt );

            // Put the selection *after* the inserted element.
            writer.setSelection( userAtt, 'after' );  // was: 'on'

            // Add space, to avoid problem where the gv-metatag is deleted for some
            // or unable to type after entering something like:
            //    Hello <attribute>
            // (Some text, a space, then insert attribute, then try to type)
            // Hopefully, this gets fixed with CKEditor upgrade!

            writer.insertText( ' ', userAtt, 'after' );

            // Move selection back to just after the attribute
            // writer.setSelection( userAtt, 'after' );

            /*
            // From: https://stackoverflow.com/questions/54162496/ckeditor5-insert-text-without-breaking-current-element
            const selection = editor.model.document.selection;
            const currentAttributes = selection.getAttributes();
            const insertPosition = selection.focus;

            writer.insertText( ' ', currentAttributes, insertPosition );
            */

        } );
    }

    refresh() {
        const model = this.editor.model;
        const selection = model.document.selection;

        const isAllowed = model.schema.checkChild( selection.focus.parent, 'gv-metatag' );

        this.isEnabled = isAllowed;
    }
}