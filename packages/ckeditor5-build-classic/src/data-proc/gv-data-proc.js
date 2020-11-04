import HtmlDataProcessor from  '@ckeditor/ckeditor5-engine/src/dataprocessor/htmldataprocessor';

import { convertMetaImgsToView } from '../lib';

export default class GVDataProcessor {

    constructor(editor) {
        this._dbgLevel = editor.config.get('debugLevel');
        this._htmlProc = new HtmlDataProcessor(editor.data.viewDocument);
    }

    toData( viewFragment ) {
        if (this._dbgLevel > 5) {
            console.log("DataProcessor.toData:", viewFragment.toString());
        }
        return this._htmlProc.toData(viewFragment);
    }

    toView( data ) {
        // Convert metaimg tags to tags like <span
        // class="gv-metatag">... </span> to avoid CKEditor5 core
        // conversions from changing <img> tags to <figure><img>...

        if (this._dbgLevel > 5) {
            console.log("DataProcessor.toView pre:", data.toString());
        }

        let newData = convertMetaImgsToView(data, {debugLevel : this._dbgLevel});

        //
        // Now use original HTMLDataProcessor's toView() 
        //

        if (this._dbgLevel > 5) {
            if (newData) {
                console.log("DataProcessor.toView post:", newData.toString());
            } else {
                console.log("DataProcessor.toView post: null!?");
            }
        }

        let viewData = this._htmlProc.toView(newData);

        if (this._dbgLevel > 5) {
            if (viewData) {
                console.log("DataProcessor.toView done:", viewData.toString());
            } else {
                console.log("DataProcessor.toView done: null!?");
            }
        }

        return viewData;
    }
}