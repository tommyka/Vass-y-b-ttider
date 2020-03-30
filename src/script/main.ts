/// <reference path="EventDispatcher.ts" />
/// <reference path="Button.ts" />
/// <reference path="model.ts" />
/// <reference path="sticky.ts" />

var body = <HTMLBodyElement>document.querySelector("body");

var template: String = `
	<li class='[class]'>
    <div class='icon [icon]'></div>[text] <span>([boat])</span>
		<div class=\"boat\">[duration] min.</div>
    <a href="tel:48201919" class="phone"><span class="phone-icon"><img src="assets/phoneicon.svg" width="30"></span></a>
	</li>`;

var boats: Model = new Model();
var directionView: HTMLElement = <HTMLElement>(
  document.querySelector(".direction")
);
var viewVassoy: HTMLElement = <HTMLElement>document.querySelector(".vassoy");
viewVassoy.classList.add("selected");
var viewStavanger: HTMLElement = <HTMLElement>(
  document.querySelector(".stavanger")
);

var warningContainer: HTMLElement = <HTMLElement>(
  document.querySelector(".warning-container")
);
var warningField: HTMLElement = <HTMLElement>document.querySelector(".warning");

function renderTemplate(obj: any) {
  var rtn = template;
  for (var key in obj) {
    rtn = rtn.replace("[" + key + "]", obj[key]);
  }
  return rtn;
}

function formatTime(time: string) {
  time = String(time);
  if (time.length == 1) {
    time = "0" + time;
  }
  var qoute = time.length - 2;

  var sp = time.substring(0, qoute) + ":" + time.substring(qoute);

  while (sp.length < 5) {
    sp = "0" + sp;
  }

  return sp;
}

var way = boats.VASSOY;

var group = boats.getGroupFromDate(new Date());
var groupOfToday = group;

var lastCheck: Date = new Date();
var lastUpdate: number = lastCheck.getTime();

setInterval(function() {
  var t = new Date();

  if (lastCheck.toDateString() != t.toDateString()) {
    SetToCurrentGroupWithRedDay();

    return;
  }

  if (t.getTime() - lastUpdate > 15 * 60 * 1000) {
    updateView();
  }
}, 60 * 1000);

boats.addEventListener("complete", function() {
  SetToCurrentGroupWithRedDay();
  renderRedDayList(boats.red);
});

function SetToCurrentGroupWithRedDay() {
  var redday = boats.getRedDay(new Date());

  if (redday) {
    group = redday.route;
    groupOfToday = group;
    warningContainer.classList.add("show");
    var d: Date = redday.day;
    console.log(redday);
    warningField.textContent =
      d.getDate() +
      "." +
      d.getMonth() +
      "." +
      d.getFullYear() +
      ": " +
      redday.message;
    sticky.activate();
  } else {
    warningContainer.classList.remove("show");
    group = boats.getGroupFromDate(new Date());
    groupOfToday = group;
    sticky.deactivate();
  }
  dayBtn.setStateByValue(group);
  updateView();
}

function renderRedDayList(days: any) {
  var target: HTMLElement = <HTMLElement>(
    document.querySelector(".red-days .content")
  );

  var today: Date = new Date();

  for (var i = 0; i < days.length; i++) {
    var day = days[i];
    var d: Date = day.day;
    if (d.getTime() > today.getTime()) {
      var li = document.createElement("li");
      li.textContent =
        d.getDate() +
        "." +
        d.getMonth() +
        "." +
        d.getFullYear() +
        ": " +
        day.message;
      target.appendChild(li);
    }
  }
}

function updateView() {
  updateDirectionText(way);

  renderBoatTimes(
    <HTMLElement>viewVassoy.querySelector("ul"),
    boats.VASSOY,
    group
  );
  renderBoatTimes(
    <HTMLElement>viewStavanger.querySelector("ul"),
    boats.STAVANGER,
    group
  );
}

function updateDirectionText(way: string) {
  directionView.textContent =
    way === boats.VASSOY ? "Vassøy -> Stavanger" : "Stavanger -> Vassøy";
}

function renderBoatTimes(target: HTMLElement, way: string, group: string) {
  //var result = boats.getCombinedTimeTable(way);

  var result = boats.getCombinedTimeTablePlusNext(way, group);
  lastUpdate = new Date().getTime();
  var date = new Date();
  var nowtime = date.getHours() * 100 + date.getMinutes();

  var nowSet = false;

  var str = "";
  for (var i = 0; i < result.length; i++) {
    var item = result[i];

    var data = {
      text: formatTime(item.time),
      class: item.call ? "show-phone" : "",
      duration: item.duration,
      boat: item.id,
      icon: item.id == 898 ? "car" : "person"
    };

    if (!nowSet && group == groupOfToday && item.time > nowtime) {
      data.class += " now";
      nowSet = true;
    }

    str = str + renderTemplate(data);
  }
  var ul: HTMLElement = target;
  ul.innerHTML = str;

  if (way === boats.VASSOY && !body.classList.contains("alternative")) {
    body.classList.add("alternative");
  } else if (
    way === boats.STAVANGER &&
    body.classList.contains("alternative")
  ) {
    body.classList.remove("alternative");
  }

  if (nowSet) {
    scrollToNow();
  }
}

function scrollToNow() {
  var n = <HTMLDivElement>document.querySelector(".now");
  body.scrollTop = n.offsetTop - 100;
}

boats.load();
// quick reload solution
document.querySelector("#reload").addEventListener("click", function(e) {
  window.location.reload();
});

var vassoy_center = [58.993102, 5.78635];
//geolocation
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(e: any) {
    var dx = Math.abs(vassoy_center[0] - e.coords.latitude);
    var dy = Math.abs(vassoy_center[1] - e.coords.longitude);

    var offshore = dx < 0.001 && dy < 0.001;
    if (offshore && way != boats.VASSOY) {
      viewVassoy.classList.add("selected");
      viewStavanger.classList.remove("selected");
      tableBtn.setStateByValue(boats.VASSOY);

      console.log("show Vassøy");
    } else if (!offshore && way != boats.STAVANGER) {
      viewStavanger.classList.add("selected");
      viewVassoy.classList.remove("selected");
      tableBtn.setStateByValue(boats.STAVANGER);
    }
  });
}

var tableBtn = new ToggleBtn("#way", [
  { lable: "Fra Vassøy", value: boats.VASSOY },
  { lable: "Fra Stavanger", value: boats.STAVANGER }
]);
tableBtn.setStateByValue(way);

tableBtn.addEventListener("click", function(e: any) {
  switch (e.data) {
    case boats.VASSOY:
      viewVassoy.classList.add("selected");
      viewStavanger.classList.remove("selected");
      way = boats.VASSOY;
      updateDirectionText(way);
      break;
    case boats.STAVANGER:
      viewStavanger.classList.add("selected");
      viewVassoy.classList.remove("selected");
      way = boats.STAVANGER;
      updateDirectionText(way);
      break;
  }
});

var dayBtn = new ToggleBtn("#route", [
  { lable: "Hverdag", value: "Weekday" },
  { lable: "Lørdag", value: "Saturday" },
  { lable: "Søndag", value: "Sunday" }
]);
dayBtn.setStateByValue(groupOfToday);

dayBtn.addEventListener("click", function(e: any) {
  group = e.data;
  updateView();
});
warningField.addEventListener("click", function() {
  SetToCurrentGroupWithRedDay();
});
var infoModal: HTMLElement = <HTMLElement>document.querySelector(".modal");
infoModal.querySelector(".close").addEventListener("click", function() {
  infoModal.classList.add("hide");
});
var infoBtn: HTMLElement = <HTMLElement>document.querySelector("#app_info");
infoBtn.addEventListener("click", function() {
  infoModal.classList.remove("hide");
});

var sticky: Sticky = new Sticky(warningContainer);
