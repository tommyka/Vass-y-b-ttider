import { Direction } from "../types/Direction";
import { useEffect } from "preact/hooks";

const vassoy_center = [58.993102, 5.78635];

const useGeolocation = (onLocationsFetched: (direction: Direction) => void) => {
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (e: any) {
        const dx = Math.abs(vassoy_center[0] - e.coords.latitude);
        const dy = Math.abs(vassoy_center[1] - e.coords.longitude);

        const offshore = dx < 0.001 && dy < 0.001;
        const result = offshore ? Direction.StavangerToVassøy : Direction.VassøyToStavanger;
        console.log("direction", offshore ? "stavanger" : "vassøy", e.coords.latitude, e.coords.longitude);
        onLocationsFetched(result);
      });
    }
  }, []);
};

export default useGeolocation;

// //geolocation
// if (navigator.geolocation) {
//   navigator.geolocation.getCurrentPosition(function(e: any) {
//     var dx = Math.abs(vassoy_center[0] - e.coords.latitude);
//     var dy = Math.abs(vassoy_center[1] - e.coords.longitude);

//     var offshore = dx < 0.001 && dy < 0.001;
//     if (offshore && way != boats.VASSOY) {
//       viewVassoy.classList.add("selected");
//       viewStavanger.classList.remove("selected");
//       tableBtn.setStateByValue(boats.VASSOY);

//       console.log("show Vassøy");
//     } else if (!offshore && way != boats.STAVANGER) {
//       viewStavanger.classList.add("selected");
//       viewVassoy.classList.remove("selected");
//       tableBtn.setStateByValue(boats.STAVANGER);
//     }
//   });
// }
