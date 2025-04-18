import { FunctionalComponent } from "preact";

import infoIcons from './InfoIcon.png';

const Header: FunctionalComponent<{ onInfo: () => void }> = ({ children, onInfo }) => {
  return (
    <header className="bg-nav">
      <div className="flex p-4 pt-0 md:pt-4">
        <h1 className="text-2xl uppercase text-white flex-grow font-bold">Vassøy ferjeplan</h1>
        <button className="absolute right-0 mr-4 mt-3 md:mt-0"><img className="w-8 relative z-10" onClick={onInfo} src={infoIcons} /></button>
      </div>
      {children && <div>{children}</div>}
    </header>
  );
};

export default Header;
