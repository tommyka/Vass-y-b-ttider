/// <reference path="EventDispatcher.ts" />
/// <reference path="Button.ts" />
/// <reference path="parser.ts" />

var body = <HTMLBodyElement>document.querySelector("body");

var template:String = "<li class='[class]'><div class='icon [icon]'></div>[text] <span>([duration] min.)</span> <div class=\"boat\">[boat]</div></li>";

var boats:Model = new Model();

function renderTemplate(obj){
	var rtn = template;
	for(var key in obj){
		rtn = rtn.replace("["+key+"]", obj[key]);
	}
	return rtn;
}

function formatTime(time){
	time = String(time);
	if(time.length == 1){
		time = "0"+time;
	}
	var qoute = time.length - 2;

	var sp = time.substring(0, qoute) + ":"+ time.substring(qoute);

	while(sp.length < 5){
		sp = "0"+sp;
	}

	return sp;
}

var way = boats.VASSOY;
var group = boats.getGroupFromDate(new Date());
var groupOfToday = group;

var lastUpdate = null;

setInterval(function(){
	var t = new Date().getTime();
	if(t - lastUpdate > 15 * 60 * 1000){
		displayBoatTimes();
	}
}, 60 * 1000)

boats.addEventListener("complete", function(){
	//var result = boats.getNextDepature(boats.VASSOY);
	displayBoatTimes();
});

function displayBoatTimes(){
	//var result = boats.getCombinedTimeTable(way);

	var result = boats.getCombinedTimeTable(way, group);
	lastUpdate = new Date().getTime();
	var date = new Date();
	var nowtime = date.getHours()*100+date.getMinutes();

	var nowSet = false;

	var str = "";
	for(var i = 0; i< result.length; i++){
		var item = result[i];

		var data = {text: formatTime(item.time), 
					class: "",
					duration: item.duration, 
					boat: item.id, 
					icon: item.id == 898 ? "car" : "person" 
		}

		if(!nowSet && group == groupOfToday && item.time > nowtime){
			data.class = "now";
			nowSet = true;
		}
		
		str = str + renderTemplate(data);
	}
	var ul:HTMLElement = <HTMLElement>document.querySelector(".result_view ul");
	ul.innerHTML = str;


	if(way === boats.VASSOY && !body.classList.contains("alternative")){
		body.classList.add("alternative");
	}else if(way === boats.STAVANGER && body.classList.contains("alternative")){
		body.classList.remove("alternative");
	}

	if(nowSet){
		scrollToNow();
	}
}

function scrollToNow(){
	var n = <HTMLDivElement>document.querySelector(".now");
	body.scrollTop = n.offsetTop - 100;
}

boats.load();

var vassoy_center = [58.993102, 5.786350];
//geolocation
if(navigator.geolocation){

	navigator.geolocation.getCurrentPosition(function(e){
		var dx = Math.abs(vassoy_center[0]-e.coords.latitude);
		var dy = Math.abs(vassoy_center[1]-e.coords.longitude);

		var offshore = dx < 0.001 && dy < 0.001;
		if(offshore && way != boats.VASSOY){
			way = boats.VASSOY;
			displayBoatTimes();
			tableBtn.setStateByValue(boats.VASSOY);
		}else if(!offshore && way != boats.STAVANGER){
			way = boats.STAVANGER;
			displayBoatTimes();
			tableBtn.setStateByValue(boats.STAVANGER);
		}
	});
}


var tableBtn = new ToggleBtn("#way", [{lable:"Fra Vassøy", value:boats.VASSOY}, {lable:"Fra Stavanger", value:boats.STAVANGER}]);
tableBtn.setStateByValue(way);

tableBtn.addEventListener("click", function(e){
	way = e.value;
	displayBoatTimes();

});

var dayBtn = new ToggleBtn("#route", [{lable:"Hverdag", value:"Weekday"}, {lable:"Lørdag", value:"Saturday"}, {lable:"Søndag",value:"Sunday"}]);
dayBtn.setStateByValue(groupOfToday);

dayBtn.addEventListener("click", function(e){
	group = e.value;
	displayBoatTimes();

});

var infoModal:HTMLElement = <HTMLElement>document.querySelector(".modal");
infoModal.querySelector(".close").addEventListener("click", function(){
	infoModal.classList.add("hide");
});
var infoBtn:HTMLElement = <HTMLElement>document.querySelector("#app_info");
infoBtn.addEventListener("click", function(){
	infoModal.classList.remove("hide");
});
