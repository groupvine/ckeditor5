import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import UserAttributeEditing from './user-attribute-editing';
import UserAttributeUI from './user-attribute-ui';

export default class UserAttribute extends Plugin {
    static get requires() {
        return [ UserAttributeEditing, UserAttributeUI ];
    }
}