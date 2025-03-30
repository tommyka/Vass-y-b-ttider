import { ContainerNode, render } from 'preact';

import App from './components/app'

render(<App />, document.getElementById('root') as ContainerNode);