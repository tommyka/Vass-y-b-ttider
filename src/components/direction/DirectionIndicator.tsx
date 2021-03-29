import {h, render, FunctionalComponent} from 'preact';

const DirectionIndicator:FunctionalComponent<{className:string}> = ({className = ""}) => {
  return <div className={`sticky top-0 bg-nav -mt-6 px-4 py-1 font-bold text-base uppercase text-white ${className}`}>
    Vassøy -{'>'} Stavanger
  </div>
};

export default DirectionIndicator;
