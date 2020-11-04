import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import { toWidget } from '@ckeditor/ckeditor5-widget/src/utils';
import Widget from '@ckeditor/ckeditor5-widget/src/widget';


export default class EmailWidgetEditing extends Plugin {
    static get requires() {
        return [ Widget ];
    }

    init() {
        // console.log( 'EmailWidgetEditing#init() got called' );

        this.editor.config.define( 'emailWidget', {
            canAddWidget : true,
            types: [
                { label : 'Comments',     type : 'ew/comments' },
                { label : 'Simple RSVP',  type : 'ew/rsvp'  },
                { label : 'How Many?',    type : 'ew/howmany'     }
            ]
        } );
    }
}

