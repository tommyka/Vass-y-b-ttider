import { useState } from "preact/hooks";

import * as rawData from "../boat.json";
import DateToDay, { TomorrowsRoute } from "../data/DateToDay";
import MarkCommingRoute from "../data/MarkCommingRoute";
import AddNightRoutes from "../data/AddNightRoutes";
import { Day } from "../types/Day";

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

export default useTimesheet;
