class Sticky {
	
	private startPos: number;
	private height: number; 
	private target: HTMLElement;

	private placehoder: HTMLElement;

	private handle_scroll_proxy:any;

	private floating: boolean = false;

	constructor(target:HTMLElement) {
		this.startPos = target.offsetTop;
		this.height = target.offsetHeight;
		this.target = target;

		this.handle_scroll_proxy = (x:Event) => this.handle_scroll(x);

		this.placehoder = document.createElement("div");
		this.placehoder.style.display = "none";
		this.target.parentNode.insertBefore(this.placehoder, this.target);
	}

	activate(){
		window.addEventListener("scroll", this.handle_scroll_proxy);
		this.startPos = this.target.offsetTop;
		this.height = this.target.offsetHeight;

		this.placehoder.style.height = this.height + "px";
	}

	deactivate(){
		window.removeEventListener("scroll", this.handle_scroll_proxy);
	}

	private handle_scroll(e:Event){
		var top = (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0);
		if(top > this.startPos){
			if(!this.floating){
				this.placehoder.style.height = this.height + "px";
				this.placehoder.style.display = "block";
				this.target.style.position = "fixed";
				this.target.style.top = "0px";
				this.floating = true;
			}
		}else{
			if(this.floating){
				this.placehoder.style.display = "none";
				this.target.style.position = "static";
				this.floating = false;
			}
		}

	}
}