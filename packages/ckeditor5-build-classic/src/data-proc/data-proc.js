import GVDataProcessor from './gv-data-proc';
import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

// A plugin which will replace the default DP with the GVDataProcessor
export default class GVDataProcessorPlugin extends Plugin {
    constructor( editor ) {
        super( editor );

        editor.data.processor = new GVDataProcessor(editor);
    }
}