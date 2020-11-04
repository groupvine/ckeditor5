import Plugin from '@ckeditor/ckeditor5-core/src/plugin';

import InputAttributeEditing from './inp-attribute-editing';
import InputAttributeUI from './inp-attribute-ui';

export default class InputAttribute extends Plugin {
    static get requires() {
        return [ InputAttributeEditing, InputAttributeUI ];
    }
}