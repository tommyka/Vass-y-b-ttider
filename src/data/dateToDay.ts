import { Day } from "../types/Day";
// force
export default (date: Date) => {
  const day = date.getDay();
  if (day === 0) {
    return Day.Sunday;
  } else if (day === 6) {
    return Day.Saturday;
  }

  return Day.Weekday;
};
export const tomorrowsRoute = (today: Day, now: Date) => {
  if (today === Day.Saturday) {
    return Day.Sunday;
  } else if (today === Day.Weekday && now.getDay() === 5) {
    return Day.Saturday;
  }
  return Day.Weekday;
};
