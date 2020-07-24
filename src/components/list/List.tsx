import {h, FunctionalComponent as fc} from 'preact';
import { TimeList } from '../app';

interface IListProps {
  list: TimeList;
  className?: string;
}

const List:fc<IListProps> = ({list, className = 'bg-teal-400'}) => {
  return <div>
     {list.map(time => <div key={time.time} className={`p-2 mb-2 text-white font-bold text-2xl flex items-center ${className}`}>
        <div className={`rounded-full bg-white text-center align-middle mr-2 inline-block icon text-black ${time.id === '898' ? 'car' : 'person'}`}></div>
        <div className="flex-grow">
         {time.time}
         <span className="text-xs font-normal ml-2">({time.id})</span>
     </div>
     <div>{time.duration} min.</div>
       </div>)}
  </div>;
}

export default List;
