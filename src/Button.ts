/// <reference path="EventDispatcher.ts" />

class ToggleBtn extends EventDispatcher{

	private element:HTMLElement;
	private states:any[];
	private _index:number = 0;
	private _text:string = "";

	constructor(selector:string, toggles:any[]){
		super();
		this.element = <HTMLElement>document.querySelector(selector);
		this.states = toggles;
		this._index = 0;

		this.element.addEventListener("click", () => this.nextState());
	}

	changeText(text:string){
		this.element.innerHTML = text;
		this._text = text;
	}

	set text(value:string){
		this.changeText(value);
	}
	get text():string{
		return this._text;
	}

	set index(value:number){
		this._index = value;

		var stateValue = this.states[this.index];
		var text:string = "";
		if(typeof(stateValue) == 'object'){
			this.text = <string>(stateValue.lable);
			text = <string>stateValue.value;
		}else{
			this.text = <string>stateValue;
			text = <string>stateValue;
		}

		this.dispatchEvent({type:"click", data:text});
	}
	get index():number{
		return this._index;
	}

	nextState():void{
		this.index = (this._index + 1) % this.states.length;
	}

	setStateByValue(str:String):void{
		for(var i = 0; i < this.states.length; i++){
			if(this.states[i].value == str){
				this._index = i;
				this.text = this.states[i].lable;
			}
		}
	}

}