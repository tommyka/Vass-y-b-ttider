/// <reference path="EventDispatcher.ts" />
class Model extends EventDispatcher {

	VASSOY:string = "v-s";
	STAVANGER:string = "s-v";

	data:any = [];

	constructor(){
		super();
	}

	getRouteName(way:string):string{
		if(way == this.VASSOY){
			return "Vassøy -> Stavanger";
		}else if (way == this.STAVANGER){
			return "Stavanger -> Vassøy";
		}
	}

	parseData(data:any){
		for(var routename in data){
			for(var groupname in data[routename]){
				for(var i = 0; i < data[routename][groupname].length; i++){

					var t = data[routename][groupname][i];
					t.time = parseInt(t.time.replace(":", ""));

				}
			}
		}
		return data;
	}

	load(url:string = null){
		var self = this;

		

		var req = new XMLHttpRequest();
		req.open("GET",url || "boat.json", true);
		req.onload = function(e){

			var data = self.parseData(JSON.parse(req.responseText));
			self.data = data;

			localStorage.setItem("timesheet", data);


			self.dispatchEvent({type:"complete", data: data});
		}
		req.onerror = function(){
			var cacheData = localStorage.getItem("timesheet");
			if(cacheData != null){
				self.data = cacheData;
				self.dispatchEvent({type:"complete", data: data});
			}
		}

		req.send();
	}

	dayGroupName(dayNumber:number){
		if(dayNumber == 0){
			return "Sunday";
		}else if(dayNumber < 6){
			return "Weekday";
		}else if(dayNumber == 6){
			return "Saturday";
		}
	}

	getGroupFromDate(date:Date){
		var day = date || new Date();
		var group = this.dayGroupName(day.getDay());

		return group;
	}

	getTimeTables(way:string, group:string){
		var routes:any = [];

		for(var key in this.data){
			if(key.indexOf(way) != -1){
				for(var routeday in this.data[key]){
					if(routeday.indexOf(group) != -1){
						routes.push(this.data[key][routeday]);
					}
				}
			}
		}

		return routes;
	}

	getCombinedTimeTable(way:string, group:string){
		var tables = this.getTimeTables(way, group);
		for(var i = 1; i < tables.length; i ++){
			tables[0] = tables[0].concat(tables[i]);
		}

		return tables[0].sort(this.SORT_TIME);
	}

	SORT_TIME(a:any,b:any){
		var an = Number(a.time);
		var bn = Number(b.time);
		if(an < bn){
			return -1;
		}else if(an > bn){
			return 1;
		}else{
			return 0;
		}
	}

}