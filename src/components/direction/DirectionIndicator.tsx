import {h, render, FunctionalComponent} from 'preact';

const DirectionIndicator:FunctionalComponent<{className:string}> = ({className = ""}) => {
  return <div className={`sticky top-0 bg-blue-500 -mt-6 px-4 font-bold text-base uppercase text-white ${className}`}>
    Vassøy -{'>'} Stavanger
  </div>
};

export default DirectionIndicator;
