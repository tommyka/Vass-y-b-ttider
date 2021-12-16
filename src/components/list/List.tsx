import { h, FunctionalComponent as fc } from "preact";

import { FJORDSOL } from "../../consts/PhoneNumbers";
import { TimeItem, TimeList } from "../../data/useTimesheet";

import phoneIcons from "../../assets/phoneicon.svg";
import { useEffect, useRef } from "preact/hooks";

interface IListProps {
  list: TimeList;
  className: string;
}

const List: fc<IListProps> = ({ list, className }) => {
  return (
    <div>
      {list.map((time) => (
        <ListItem key={time.time} time={time} className={className} />
      ))}
    </div>
  );
};

const ListItem: fc<{ time: TimeItem; className: string }> = ({ time, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if(time.next === true) {
      containerRef.current.scrollIntoView({block: "center"});
    }
  }, [time.next])

  return (
    <div ref={containerRef} className={`p-2 pr-4 mb-2 text-white font-bold text-2xl flex items-center ${time.next ? "bg-next" : ""} ${className}`}>
      <div
        className={`rounded-full bg-white text-center align-middle mr-4 inline-block icon text-black ${
          time.id === "898" ? "car" : "person"
        }`}
      ></div>
      <div className="flex-grow">
        {time.time}
        <span className="text-xs font-normal ml-2">({time.id})</span>
      </div>
      {time.call && (
        <div className="mr-4">
          <a href={`tel:${FJORDSOL}`}>
            <img src={phoneIcons} alt="Ring fjordsjol" />
          </a>
        </div>
      )}
      <div>{time.duration} min.</div>
    </div>
  );
};

export default List;
