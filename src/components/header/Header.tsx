import {h, render, FunctionalComponent} from 'preact';

const Header:FunctionalComponent = ({children}) => {
  return <header className="bg-blue-500">
    <h1 className="text-2xl capitalize">Vassøy ferjeplan</h1>
    {children && <div>{children}</div>}
  </header>
}

export default Header;
