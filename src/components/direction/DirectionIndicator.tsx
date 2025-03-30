import { FunctionalComponent } from "preact";
import { Direction } from "../../types/Direction";

const DirectionIndicator: FunctionalComponent<{ className: string; direction: Direction }> = ({ className = "", direction }) => {
  return (
    <div className={`sticky top-0 bg-nav -mt-6 px-4 py-1 font-bold text-base uppercase text-white ${className}`}>
      {direction === Direction.VassøyToStavanger ? "Vassøy -> Stavanger" : "Stavanger -> Vassøy"}
    </div>
  );
};

export default DirectionIndicator;
