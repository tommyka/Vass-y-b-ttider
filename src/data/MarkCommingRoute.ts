import { TimeList } from "../components/app";

const markCommingRoute = (timeList: TimeList, now: Date) => {
  let timeSet = false;
  return timeList.map((item) => {
    const timestamp = parseInt(item.time.replace(":", ""));
    if (!timeSet && timestamp > now.getHours() * 100 + now.getMinutes()) {
      timeSet = true;
      return { ...item, next: true };
    }
    return item;
  });
};

export default markCommingRoute;
