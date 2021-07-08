import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import normalizeClipboardHtml from '@ckeditor/ckeditor5-clipboard/src/utils/normalizeclipboarddata';

import { anyMetaImgEWs } from '../lib';

export default class GVClipboardPlugin extends Plugin {
    static get pluginName() {
        return 'GVClipboard';
    }

    init() {
        let editor = this.editor;

        //
        // DB: see @ckeditor/ckeditor5-clipboard/src/clipboardpipeline.js
        //     and https://ckeditor.com/docs/ckeditor5/latest/framework/guides/deep-dive/clipboard.html
        //
        editor.editing.view.document.on('clipboardInput', (evt, data) => {
            const dataTransfer = data.dataTransfer;
            let content = data.content || '';

            if ( !content ) {
                if ( dataTransfer.getData( 'text/html' ) ) {
                    content = normalizeClipboardHtml( dataTransfer.getData( 'text/html' ) );
                } else if ( dataTransfer.getData( 'text/plain' ) ) {
                    content = plainTextToHtml( dataTransfer.getData( 'text/plain' ) );
                }
            }

            if (anyMetaImgEWs(content)) {
                evt.stop();  // prevent further processing
                alert('To insert an Email Widget use the "Widget" menu. ' +
                      '(Cloning Email Widgets by cutting-and-pasting is not permitted.)');
                return;
            }

            // Also from default handler, convert to view 
            //    content = convertMetaImgsToView(htmlContent);
            // (this calls the GVDataProcessor.toView(), which already
            //  performs convertMetaImgsToView())
            let viewContent = editor.data.processor.toView( content )

            // Pass the view fragment to the default clipboard input handler
            // to allow further processing of the content.
            data.content = viewContent;
        });
    }
}

