var EventDispatcher = (function () {
    function EventDispatcher() {
    }
    EventDispatcher.prototype.addEventListener = function (type, listener) {
        if (this._listeners === undefined)
            this._listeners = {};
        var listeners = this._listeners;
        if (listeners[type] === undefined) {
            listeners[type] = [];
        }
        if (listeners[type].indexOf(listener) === -1) {
            listeners[type].push(listener);
        }
    };
    EventDispatcher.prototype.hasEventListener = function (type, listener) {
        if (this._listeners === undefined)
            return false;
        var listeners = this._listeners;
        if (listeners[type] !== undefined && listeners[type].indexOf(listener) !== -1) {
            return true;
        }
        return false;
    };
    EventDispatcher.prototype.removeEventListener = function (type, listener) {
        if (this._listeners === undefined)
            return;
        var listeners = this._listeners;
        var listenerArray = listeners[type];
        if (listenerArray !== undefined) {
            var index = listenerArray.indexOf(listener);
            if (index !== -1) {
                listenerArray.splice(index, 1);
            }
        }
    };
    EventDispatcher.prototype.dispatchEvent = function (event) {
        if (this._listeners === undefined)
            return;
        var listeners = this._listeners;
        var listenerArray = listeners[event.type];
        if (listenerArray !== undefined) {
            event.target = this;
            var array = [];
            var length = listenerArray.length;
            for (var i = 0; i < length; i++) {
                array[i] = listenerArray[i];
            }
            for (var i = 0; i < length; i++) {
                array[i].call(this, event);
            }
        }
    };
    return EventDispatcher;
})();
/// <reference path="EventDispatcher.ts" />
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var ToggleBtn = (function (_super) {
    __extends(ToggleBtn, _super);
    function ToggleBtn(selector, toggles) {
        var _this = this;
        _super.call(this);
        this._index = 0;
        this._text = "";
        this.element = document.querySelector(selector);
        this.states = toggles;
        this._index = 0;
        this.element.addEventListener("click", function () { return _this.nextState(); });
    }
    ToggleBtn.prototype.changeText = function (text) {
        this.element.innerHTML = text;
        this._text = text;
    };
    Object.defineProperty(ToggleBtn.prototype, "text", {
        get: function () {
            return this._text;
        },
        set: function (value) {
            this.changeText(value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ToggleBtn.prototype, "index", {
        get: function () {
            return this._index;
        },
        set: function (value) {
            this._index = value;
            var stateValue = this.states[this.index];
            var text = "";
            if (typeof (stateValue) == 'object') {
                this.text = (stateValue.lable);
                text = stateValue.value;
            }
            else {
                this.text = stateValue;
                text = stateValue;
            }
            this.dispatchEvent({ type: "click", value: text });
        },
        enumerable: true,
        configurable: true
    });
    ToggleBtn.prototype.nextState = function () {
        this.index = (this._index + 1) % this.states.length;
    };
    ToggleBtn.prototype.setStateByValue = function (str) {
        for (var i = 0; i < this.states.length; i++) {
            if (this.states[i].value == str) {
                this._index = i;
                this.text = this.states[i].lable;
            }
        }
    };
    return ToggleBtn;
})(EventDispatcher);
/// <reference path="EventDispatcher.ts" />
var Model = (function (_super) {
    __extends(Model, _super);
    function Model() {
        _super.call(this);
        this.VASSOY = "v-s";
        this.STAVANGER = "s-v";
        this.data = [];
    }
    Model.prototype.getRouteName = function (way) {
        if (way == this.VASSOY) {
            return "Vassøy -> Stavanger";
        }
        else if (way == this.STAVANGER) {
            return "Stavanger -> Vassøy";
        }
    };
    Model.prototype.parseData = function (data) {
        for (var routename in data) {
            for (var groupname in data[routename]) {
                for (var i = 0; i < data[routename][groupname].length; i++) {
                    var t = data[routename][groupname][i];
                    t.time = parseInt(t.time.replace(":", ""));
                }
            }
        }
        return data;
    };
    Model.prototype.load = function (url) {
        if (url === void 0) { url = null; }
        var self = this;
        var req = new XMLHttpRequest();
        req.open("GET", url || "boat.json", true);
        req.onload = function (e) {
            var data = self.parseData(JSON.parse(req.responseText));
            self.data = data;
            self.dispatchEvent({ type: "complete", data: data });
        };
        req.send();
    };
    Model.prototype.dayGroupName = function (dayNumber) {
        if (dayNumber == 0) {
            return "Sunday";
        }
        else if (dayNumber < 6) {
            return "Weekday";
        }
        else if (dayNumber == 6) {
            return "Saturday";
        }
    };
    Model.prototype.getGroupFromDate = function (date) {
        var day = date || new Date();
        var group = this.dayGroupName(day.getDay());
        return group;
    };
    Model.prototype.getTimeTables = function (way, group) {
        var routes = [];
        for (var key in this.data) {
            if (key.indexOf(way) != -1) {
                for (var routeday in this.data[key]) {
                    if (routeday.indexOf(group) != -1) {
                        routes.push(this.data[key][routeday]);
                    }
                }
            }
        }
        return routes;
    };
    Model.prototype.getCombinedTimeTable = function (way, group) {
        var tables = this.getTimeTables(way, group);
        for (var i = 1; i < tables.length; i++) {
            tables[0] = tables[0].concat(tables[i]);
        }
        return tables[0].sort(this.SORT_TIME);
    };
    Model.prototype.SORT_TIME = function (a, b) {
        var an = Number(a.time);
        var bn = Number(b.time);
        if (an < bn) {
            return -1;
        }
        else if (an > bn) {
            return 1;
        }
        else {
            return 0;
        }
    };
    return Model;
})(EventDispatcher);
/// <reference path="EventDispatcher.ts" />
/// <reference path="Button.ts" />
/// <reference path="parser.ts" />
var body = document.querySelector("body");
var template = "<li class='[class]'><div class='icon [icon]'></div>[text] <span>([duration] min.)</span> <div class=\"boat\">[boat]</div></li>";
var boats = new Model();
function renderTemplate(obj) {
    var rtn = template;
    for (var key in obj) {
        rtn = rtn.replace("[" + key + "]", obj[key]);
    }
    return rtn;
}
function formatTime(time) {
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
var lastUpdate = null;
setInterval(function () {
    var t = new Date().getTime();
    if (t - lastUpdate > 15 * 60 * 1000) {
        displayBoatTimes();
    }
}, 60 * 1000);
boats.addEventListener("complete", function () {
    //var result = boats.getNextDepature(boats.VASSOY);
    displayBoatTimes();
});
function displayBoatTimes() {
    //var result = boats.getCombinedTimeTable(way);
    var result = boats.getCombinedTimeTable(way, group);
    lastUpdate = new Date().getTime();
    var date = new Date();
    var nowtime = date.getHours() * 100 + date.getMinutes();
    var nowSet = false;
    var str = "";
    for (var i = 0; i < result.length; i++) {
        var item = result[i];
        var data = { text: formatTime(item.time), class: "", duration: item.duration, boat: item.id, icon: item.id == 898 ? "car" : "person" };
        if (!nowSet && group == groupOfToday && item.time > nowtime) {
            data.class = "now";
            nowSet = true;
        }
        str = str + renderTemplate(data);
    }
    var ul = document.querySelector(".result_view ul");
    ul.innerHTML = str;
    if (way === boats.VASSOY && !body.classList.contains("alternative")) {
        body.classList.add("alternative");
    }
    else if (way === boats.STAVANGER && body.classList.contains("alternative")) {
        body.classList.remove("alternative");
    }
    if (nowSet) {
        scrollToNow();
    }
}
function scrollToNow() {
    var n = document.querySelector(".now");
    body.scrollTop = n.offsetTop - 100;
}
boats.load();
var vassoy_center = [58.993102, 5.786350];
//geolocation
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function (e) {
        var dx = Math.abs(vassoy_center[0] - e.coords.latitude);
        var dy = Math.abs(vassoy_center[1] - e.coords.longitude);
        var offshore = dx < 0.001 && dy < 0.001;
        if (offshore && way != boats.VASSOY) {
            way = boats.VASSOY;
            displayBoatTimes();
            tableBtn.setStateByValue(boats.VASSOY);
        }
        else if (!offshore && way != boats.STAVANGER) {
            way = boats.STAVANGER;
            displayBoatTimes();
            tableBtn.setStateByValue(boats.STAVANGER);
        }
    });
}
var tableBtn = new ToggleBtn("#way", [{ lable: "Fra Vassøy", value: boats.VASSOY }, { lable: "Fra Stavanger", value: boats.STAVANGER }]);
tableBtn.setStateByValue(way);
tableBtn.addEventListener("click", function (e) {
    way = e.value;
    displayBoatTimes();
});
var dayBtn = new ToggleBtn("#route", [{ lable: "Hverdag", value: "Weekday" }, { lable: "Lørdag", value: "Saturday" }, { lable: "Søndag", value: "Sunday" }]);
dayBtn.setStateByValue(groupOfToday);
dayBtn.addEventListener("click", function (e) {
    group = e.value;
    displayBoatTimes();
});
