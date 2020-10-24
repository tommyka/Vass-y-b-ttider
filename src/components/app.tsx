import { h, render } from "preact";
import { useState, useEffect } from "preact/hooks";

import * as rawData from "../boat.json";
import DateToDay, { TomorrowsRoute } from "../data/DateToDay";
import MarkCommingRoute from "../data/MarkCommingRoute";
import AddNightRoutes from "../data/AddNightRoutes";
import { Day } from "../types/Day";
import { Direction } from "../types/Direction";
import DirectionIndicator from "./direction";
import Header from "./header";
import List from "./list";

const stavangerRaw = rawData.route["s-v"];
const vassoyRaw = rawData.route["v-s"];

type TimeItem = typeof stavangerRaw.Weekday[0];
export type TimeList = (TimeItem & {next?:boolean})[];
export type Route = typeof rawData.route["s-v"];

const useTimesheet = () => {
  const [day, setDay] = useState(Day.Weekday);

  const now = new Date();
  const isToday = DateToDay(now) === day;

  const process = (route:Route) => {
    const tomorrowsDay = TomorrowsRoute(day, now);
    const r = AddNightRoutes(route[day], route, tomorrowsDay);
    return isToday ? MarkCommingRoute(r, now) : r;
  }

  const stavanger = process(stavangerRaw);
  const vassoy = process(vassoyRaw);
  return { stavanger, vassoy, setDay, day };
};

const App = () => {
  const { stavanger, vassoy, setDay, day } = useTimesheet();
  const [direction, setDirection] = useState(Direction.VassøyToStavanger);

  const changeDay = () => {
    const keys = Object.keys(Day);
    const index = keys.findIndex((item) => item === day);
    setDay(keys[(index + 1) % keys.length] as Day);
  };

  const changeDirection = () => {
    setDirection(direction === Direction.StavangerToVassøy ? Direction.VassøyToStavanger : Direction.StavangerToVassøy);
  };

  return (
    <div className="relative">
      <Header>
        <nav className="fixed bottom-0 shadow w-full flex md:bg-gray-700 ">
          <div className="w-1/3 hidden md:block p-3 text-center bg-gray text-white border-r border-t border-bgray">Fra Stavanger</div>
          <button className="p-3 w-1/2 md:hidden bg-svg text-white border-r border-t border-bgray" onClick={changeDirection}>
            {direction === Direction.StavangerToVassøy ? "Fra Stavanger" : "Fra Vassøy"}{" "}
          </button>
          <button className="p-3 w-1/2 md:1/3 bg-svg text-white border-t border-bgray" onClick={changeDay}>
            {day}
          </button>
          <div className="w-1/3 hidden md:block p-3 text-center bg-gray text-white border-l border-t border-bgray">Fra Vassøy</div>
        </nav>
      </Header>

      <DirectionIndicator className="md:hidden" />
      <div className="flex flex-col md:flex-row">
        <div className={`md:w-1/2 md:block md:mr-1 ${direction !== Direction.StavangerToVassøy ? "hidden" : ""}`}>
          <List list={stavanger} className="bg-vass" />
        </div>
        <div className={`md:w-1/2 md:block md:ml-1 ${direction !== Direction.VassøyToStavanger ? "hidden" : ""}`}>
          <List list={vassoy} className="bg-svg" />
        </div>
      </div>
      <div className="h-12 mb-2"></div>
    </div>
  );
};

export default App;
