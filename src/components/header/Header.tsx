import { h, render, FunctionalComponent } from "preact";

import infoIcons from '../../assets/InfoIcon.png';

const Header: FunctionalComponent<{onInfo:() => void}> = ({ children, onInfo }) => {
  return (
    <header className="bg-nav">
      <div className="flex p-4 pt-0 md:pt-4">
        <h1 className="text-2xl uppercase text-white flex-grow font-bold">Vassøy ferjeplan</h1>
        <button><img className="w-8 relative z-10" onClick={onInfo} src={infoIcons}/></button>
      </div>
      {children && <div>{children}</div>}
    </header>
  );
};

export default Header;
