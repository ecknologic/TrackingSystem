import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import './sass/global-styles.scss'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
