import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';

const app = (
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

ReactDOM.render(
  app, document.getElementById('root')
);