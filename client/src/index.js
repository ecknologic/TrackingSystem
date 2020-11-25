import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorker from './serviceWorker';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import 'antd/dist/antd.css';
import './index.css';
import './sass/global-styles.scss'

ReactDOM.render(
  <App />,
  document.getElementById('root')
);

serviceWorker.unregister();
