import { TimeList, Route } from "../components/app";
import { Day } from "../types/Day";

const AddNightRoutes = (list:TimeList, route:Route, day:Day) => {
  const nightItems = route[day].filter(item => parseInt(item.time.replace(':', ''), 10) < 400);
  return [...list, ...nightItems];
}

export default AddNightRoutes;
