import { useState } from "preact/hooks";

import * as rawData from "../boat.json";
import dateToDay, { tomorrowsRoute } from "./dateToDay";
import markCommingRoute from "./markCommingRoute";
import addNightRoutes from "./addNightRoutes";
import { Day } from "../types/Day";

const stavangerRaw = rawData.route["s-v"];
const vassoyRaw = rawData.route["v-s"];

export type TimeItem = (typeof stavangerRaw.Weekday)[0] & { next?: boolean };
export type TimeList = TimeItem[];
export type Route = (typeof rawData.route)["s-v"];

const useTimesheet = () => {
  const [day, setDay] = useState(getInitialDay);

  const now = new Date();
  const isToday = dateToDay(now) === day;

  const process = (route: Route) => {
    const tomorrowsDay = tomorrowsRoute(day, now);
    const r = addNightRoutes(route[day], route, tomorrowsDay);
    return isToday ? markCommingRoute(r, now) : r;
  };

  const stavanger = process(stavangerRaw);
  const vassoy = process(vassoyRaw);
  return { stavanger, vassoy, setDay, day };
};

const getInitialDay = () => {
  var dayIndex = new Date().getDay();

  switch (dayIndex) {
    case 0:
      return Day.Sunday;
    case 6:
      return Day.Saturday;
    default:
      return Day.Weekday;
  }
};

export default useTimesheet;
