/// <reference path="EventDispatcher.ts" />
class Model extends EventDispatcher {
  VASSOY: string = "v-s";
  STAVANGER: string = "s-v";

  //Data

  data: any = [];
  route: any = {};
  red: any = [];

  constructor() {
    super();
  }

  getRouteName(way: string): string {
    if (way == this.VASSOY) {
      return "Vassøy -> Stavanger";
    } else if (way == this.STAVANGER) {
      return "Stavanger -> Vassøy";
    }
  }

  parseData(data: any) {
    console.log("parseData");

    var route = data.route;
    for (var routename in route) {
      for (var groupname in route[routename]) {
        for (var i = 0; i < route[routename][groupname].length; i++) {
          var t = route[routename][groupname][i];
          t.time = parseInt(t.time.replace(":", ""));
        }
      }
    }

    this.route = route;

    var red = data.red;
    for (i = 0; i < red.length; i++) {
      var routechange = red[i];
      var daysplit: string[] = routechange.day.split("/");
      routechange.day = new Date(
        Number(daysplit[2]),
        Number(daysplit[1]) - 1,
        Number(daysplit[0])
      );
    }

    this.red = red;
    return data;
  }

  load(url: string = null) {
    var self = this;

    //if (window.navigator.onLine) {
    var req = new XMLHttpRequest();
    req.open("GET", url || "boat.json", true);
    req.onload = function(e) {
      var data = self.parseData(JSON.parse(req.responseText));
      self.data = data;

      localStorage.setItem("timesheet", req.responseText);

      self.dispatchEvent({ type: "complete", data: data });
    };
    req.onerror = function() {
      var cacheData = localStorage.getItem("timesheet");
      if (cacheData != null) {
        self.data = self.parseData(JSON.parse(cacheData));
        self.dispatchEvent({ type: "complete", data: self.data });
      }
    };

    req.send();
    /*}else{
			var cacheData = localStorage.getItem("timesheet");

			if (cacheData != null) {

				self.data = self.parseData(JSON.parse(cacheData));
				self.dispatchEvent({ type: "complete", data: self.data });
			}
		}*/
  }

  dayGroupName(dayNumber: number) {
    if (dayNumber == 0) {
      return "Sunday";
    } else if (dayNumber < 6) {
      return "Weekday";
    } else if (dayNumber == 6) {
      return "Saturday";
    }
  }
  groupDayNumber(groupName: string) {
    if (groupName === "Saturday") {
      return 6;
    } else if (groupName === "Sunday") {
      return 0;
    }

    var daynumber = new Date().getDay();
    return daynumber > 1 && daynumber < 6 ? daynumber : 2;
  }

  getRedDay(date: Date): any {
    console.log("getRedDay", this.red);
    for (var i = 0; i < this.red.length; i++) {
      var red = this.red[i];
      if (date.toDateString() == red.day.toDateString()) {
        return red;
      }
    }
  }

  getGroupFromDate(date: Date) {
    var day = date || new Date();

    var group = this.dayGroupName(day.getDay());

    return group;
  }

  getTimeTables(way: string, group: string) {
    var routes: any = [];

    for (var key in this.route) {
      if (key.indexOf(way) != -1) {
        for (var routeday in this.route[key]) {
          if (routeday.indexOf(group) != -1) {
            routes.push(this.route[key][routeday]);
          }
        }
      }
    }

    return routes;
  }

  getCombinedTimeTable(way: string, group: string) {
    var tables = this.getTimeTables(way, group);
    for (var i = 1; i < tables.length; i++) {
      tables[0] = tables[0].concat(tables[i]);
    }

    return tables[0].sort(this.SORT_TIME);
  }

  getCombinedTimeTablePlusNext(way: string, group: string) {
    var data = this.getCombinedTimeTable(way, group);

    var nextDay = this.groupDayNumber(group);
    nextDay = (nextDay + 1) % 7;

    var nextDayData = this.getCombinedTimeTable(
      way,
      this.dayGroupName(nextDay)
    );
    for (var i = 0; i < nextDayData.length; i++) {
      if (nextDayData[i].time < 400) {
        data.push(nextDayData[i]);
      } else {
        break;
      }
    }

    return data;
  }

  SORT_TIME(a: any, b: any) {
    var an = Number(a.time);
    var bn = Number(b.time);
    if (an < bn) {
      return -1;
    } else if (an > bn) {
      return 1;
    } else {
      return 0;
    }
  }
}
