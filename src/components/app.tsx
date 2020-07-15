import { h, render } from 'preact';
import { useState, useEffect } from 'preact/hooks';

import * as rawData from '../boat.json';

export enum Day {
  Weekday = 'Weekday',
  Saturday = 'Saturday',
  Sunday = 'Sunday'
}

const useTimesheet = () => {
  const [day, setDay] = useState(Day.Weekday);

  const routes = rawData.route;
  const stavanger = routes["s-v"][day];
  const vassoy = routes["v-s"][day];
  return {stavanger, vassoy, setDay};
}

const App = () => {
  const {stavanger} = useTimesheet();

  return (<div>Here is what the app is going to be
    <div>
      {stavanger.map(depature => <div key={depature.time}>{depature.time} - {depature.id}</div>)}
    </div>
  </div>);
}

export default App;
