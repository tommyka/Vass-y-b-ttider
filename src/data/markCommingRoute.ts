import { TimeList } from "./useTimesheet";

/** Marks the first departure after `from` (HHMM). With `inclusive`, a departure exactly at `from` counts. */
const markCommingRoute = (timeList: TimeList, from: number, inclusive = false) => {
  let timeSet = false;
  return timeList.map((item) => {
    const timestamp = parseInt(item.time.replace(":", ""));
    if (!timeSet && (inclusive ? timestamp >= from : timestamp > from)) {
      timeSet = true;
      return { ...item, next: true };
    }
    return item;
  });
};

export default markCommingRoute;
