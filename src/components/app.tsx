import { h, render, FunctionalComponent } from "preact";
import { useState } from "preact/hooks";

import useTimesheet from "../data/useTimesheet";
import { Day, DayMap } from "../types/Day";
import { Direction } from "../types/Direction";
import DirectionIndicator from "./direction";
import Header from "./header";
import InfoPanel from "./info";
import List from "./list";
import useGeolocation from "../data/useGeolocation";

const App = () => {
  const { stavanger, vassoy, setDay, day } = useTimesheet();
  const [direction, setDirection] = useState(Direction.VassøyToStavanger);
  const [showInfo, setInfoVisibility] = useState(false);

  useGeolocation(setDirection);

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
      <Header onInfo={() => setInfoVisibility(true)}>
        <nav className="fixed bottom-0 shadow w-full flex md:bg-gray-700 ">
          <FakeButton>Fra Vassøy</FakeButton>
          <DirectionButton left onClick={changeDirection}>
            {direction === Direction.StavangerToVassøy ? "Fra Stavanger" : "Fra Vassøy"}
          </DirectionButton>
          <DirectionButton onClick={changeDay}>{DayMap[day]}</DirectionButton>
          <FakeButton right>Fra Stavanger</FakeButton>
        </nav>
      </Header>

      <DirectionIndicator className="md:hidden" direction={direction} />

      {showInfo && <InfoPanel onClose={() => setInfoVisibility(false)} />}

      <div className="flex flex-col md:flex-row mt-2">
        <div className={`md:w-1/2 md:block md:mr-1 ${direction !== Direction.VassøyToStavanger ? "hidden" : ""}`}>
          <List list={vassoy} className="bg-vass" />
        </div>
        <div className={`md:w-1/2 md:block md:ml-1 ${direction !== Direction.StavangerToVassøy ? "hidden" : ""}`}>
          <List list={stavanger} className="bg-svg" />
        </div>
      </div>
      <div className="h-12"></div>
    </div>
  );
};

const FakeButton: FunctionalComponent<{ right?: boolean }> = ({ children, right }) => (
  <div className={`w-1/3 hidden md:block p-3 text-center bg-gray text-white border-t border-bgray ${right ? "border-l" : "border-r"}`}>
    {children}
  </div>
);

const DirectionButton: FunctionalComponent<{ left?: boolean; onClick: () => void }> = ({ left, onClick, children }) => (
  <button
    type="button"
    className={`p-3 w-1/2 capitalize bg-svg text-white focus:outline-none border-t border-bgray ${left ? "border-r md:hidden" : "md:1/3"}`}
    onClick={onClick}
  >
    {children}
  </button>
);

export default App;
