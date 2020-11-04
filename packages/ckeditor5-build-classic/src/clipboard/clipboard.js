import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import normalizeClipboardHtml from '@ckeditor/ckeditor5-clipboard/src/utils/normalizeclipboarddata';

import { anyMetaImgEWs } from '../lib';

export default class GVClipboardPlugin extends Plugin {
    static get pluginName() {
        return 'GVClipboard';
    }

    init() {
        let editor = this.editor;

        editor.editing.view.document.on('clipboardInput', (evt, data) => {
            const dataTransfer = data.dataTransfer;
            const htmlContent = dataTransfer.getData('text/html');

            if (!htmlContent) {
                return;
            }

            if (anyMetaImgEWs(htmlContent)) {
                evt.stop();  // prevent further processing
                alert('To insert an Email Widget use the "Widget" menu. ' +
                      '(Cloning Email Widgets by cutting-and-pasting is not permitted.)');
                return;
            }

            // From default handler: .. ckeditor5-clipboard/src/clipboard.js
            let newContent = normalizeClipboardHtml(htmlContent);

            // Also from default handler, convert to view 
            //    newContent = convertMetaImgsToView(htmlContent);
            // (this calls the GVDataProcessor.toView(), which already
            //  performs convertMetaImgsToView())
            let viewContent = editor.data.processor.toView( newContent )

            // console.log("Clipboard pasting html", htmlContent, viewContent);

            // Fire the regular Clipboard event transformations
            // (E.g., for PasteFromOffice, etc.
            editor.plugins.get( 'Clipboard' ).fire( 'inputTransformation', {
                content : viewContent, 
                dataTransfer : dataTransfer 
            } );

            editor.editing.view.scrollToTheSelection();

            // Prevent further processing
            evt.stop();
        });
    }
}

