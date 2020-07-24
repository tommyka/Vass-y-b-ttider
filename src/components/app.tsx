import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import * as rawData from '../boat.json';
import List from './list';

const stavangerRaw = rawData.route["s-v"];
const vassoyRaw = rawData.route["v-s"];

export enum Day {
  Weekday = 'Weekday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

export type TimeList = typeof stavangerRaw.Weekday;

const useTimesheet = () => {
  const [day, setDay] = useState(Day.Weekday);

  const stavanger = stavangerRaw[day];
  const vassoy = vassoyRaw[day];
  return {stavanger, vassoy, setDay, day};
}

const App = () => {
  const {stavanger, vassoy, setDay, day} = useTimesheet();

  const changeDay = () => {
    const keys = Object.keys(Day);
    const index = keys.findIndex(item => item === day);
    setDay(keys[(index +1) %  keys.length] as Day);
  }

  return (<div>

    <div className="flex">
    <div className="w-1/2 px-2">
      <List list={stavanger} />
    </div>
    <div className="w-1/2 px-2">
      <List list={vassoy} className="bg-blue-700"/>
    </div>
  </div>

    <div>
      <button className="bg-pink-900 p-4" onClick={changeDay}>{day}</button>
    </div>
  </div>);
}

export default App;
