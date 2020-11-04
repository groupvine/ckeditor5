// see: https://github.com/ckeditor/ckeditor5/issues/2077

import DomEventObserver from '@ckeditor/ckeditor5-engine/src/view/observer/domeventobserver';

export class DoubleClickObserver extends DomEventObserver {
    constructor( view ) {
	super( view );

	this.domEventType = 'dblclick';
    }

    onDomEvent( domEvent ) {
	this.fire( domEvent.type, domEvent );
    }
}
