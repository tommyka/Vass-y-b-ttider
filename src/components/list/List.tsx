import {h, FunctionalComponent as fc} from 'preact';
import { TimeList } from '../app';

import phoneIcons from '../../assets/phoneicon.svg';

interface IListProps {
  list: TimeList;
  className: string;
}

const List:fc<IListProps> = ({list, className}) => {
  return <div>
     {list.map(time => <div key={time.time} className={`p-2 pr-4 mb-2 text-white font-bold text-2xl flex items-center ${className}`}>
        <div className={`rounded-full bg-white text-center align-middle mr-2 inline-block icon text-black ${time.id === '898' ? 'car' : 'person'}`}></div>
        <div className="flex-grow">
         {time.time}

         <span className="text-xs font-normal ml-2">({time.id})</span>
     </div>
     {time.call && <div className="mr-4"><a href="tel:93460912"><img src={phoneIcons} alt="Ring fjordsjol"/></a></div>}
     <div>{time.duration} min.</div>
       </div>)}
  </div>;
}

export default List;
