import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import EmailWidgetEditing from './email-widget-editing';
import EmailWidgetUI from './email-widget-ui';

export default class EmailWidget extends Plugin {
    static get requires() {
        return [ EmailWidgetEditing, EmailWidgetUI ];
    }
}