import {h, render, FunctionalComponent} from 'preact';

const Header:FunctionalComponent = ({children}) => {
  return <header className="bg-nav">
    <h1 className="text-2xl uppercase text-white font-bold p-4 pt-0 md:pt-4">Vassøy ferjeplan</h1>
    {children && <div>{children}</div>}
  </header>
}

export default Header;
