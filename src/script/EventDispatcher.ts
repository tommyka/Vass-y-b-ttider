/**
 * @author mrdoob / http://mrdoob.com/
 */
interface iEvent {
	type:string;
	target?:any;
	data?:any
}

class EventDispatcher {
	private _listeners:any;
	constructor(){

	}

	addEventListener(type:string, listener:Function){
		if ( this._listeners === undefined ) this._listeners = {};

		var listeners = this._listeners;
		if ( listeners[ type ] === undefined ) {
			listeners[ type ] = [];
		}

		if ( listeners[ type ].indexOf( listener ) === - 1 ) {
			listeners[ type ].push( listener );
		}
	}

	hasEventListener(type:string, listener:Function ) {

		if ( this._listeners === undefined ) return false;

		var listeners = this._listeners;
		if ( listeners[ type ] !== undefined && listeners[ type ].indexOf( listener ) !== - 1 ) {
			return true;
		}

		return false;
	}

	removeEventListener( type:string, listener:Function ) {
		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ type ];

		if ( listenerArray !== undefined ) {
			var index = listenerArray.indexOf( listener );
			if ( index !== - 1 ) {
				listenerArray.splice( index, 1 );
			}
		}
	}

	dispatchEvent( event:iEvent ) {

		if ( this._listeners === undefined ) return;

		var listeners = this._listeners;
		var listenerArray = listeners[ event.type ];

		if ( listenerArray !== undefined ) {

			event.target = this;

			var array:any = [];
			var length = listenerArray.length;

			for ( var i = 0; i < length; i ++ ) {

				array[ i ] = listenerArray[ i ];

			}

			for ( var i = 0; i < length; i ++ ) {

				array[ i ].call( this, event );

			}

		}

	}
}
