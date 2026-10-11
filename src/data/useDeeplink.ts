import { Day } from "../types/Day";
import { Direction } from "../types/Direction";
import dateToDay from "./dateToDay";

/**
 * Deeplink parameters, e.g. from vassoy.org event pages:
 *   ?fra=stavanger|vassoy  direction to show
 *   ?dato=2026-10-23       which day's timetable (weekday/saturday/sunday)
 *   ?dag=hverdag|lordag|sondag  alternative to dato
 *   ?tid=16:45             highlight and scroll to the first departure at or after this time
 */
export interface IDeeplink {
  direction?: Direction;
  day?: Day;
  time?: number; // HHMM, e.g. 1645
}

const days: Record<string, Day> = { hverdag: Day.Weekday, lordag: Day.Saturday, sondag: Day.Sunday };

export const parseDeeplink = (search: string): IDeeplink => {
  const params = new URLSearchParams(search);
  const result: IDeeplink = {};

  const fra = params.get("fra")?.toLowerCase();
  if (fra === "stavanger") result.direction = Direction.StavangerToVassøy;
  else if (fra === "vassoy" || fra === "vassøy") result.direction = Direction.VassøyToStavanger;

  const dato = params.get("dato");
  const dag = params.get("dag")?.toLowerCase();
  if (dato && /^\d{4}-\d{2}-\d{2}$/.test(dato)) {
    // Noon avoids timezone edge cases around midnight
    result.day = dateToDay(new Date(`${dato}T12:00:00`));
  } else if (dag && days[dag]) {
    result.day = days[dag];
  }

  const tid = params.get("tid");
  if (tid && /^\d{1,2}:\d{2}$/.test(tid)) {
    const [h, m] = tid.split(":").map(Number);
    result.time = h * 100 + m;
  }

  return result;
};

const deeplink = parseDeeplink(window.location.search);

const useDeeplink = () => deeplink;

export default useDeeplink;
