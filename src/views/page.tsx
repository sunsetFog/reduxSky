import { render } from 'react-dom';
import { useElement } from 'sunny-js/util/DOM';
import Container from './container';

const App = Container;
const containerID = 'app-container';

render(
  <App />,
  useElement('#' + containerID, {
    id: containerID,
  }),
);
