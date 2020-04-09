import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'linaria';
import App from './App';

const marqueeStyles = css`
  position: fixed;
  width: 100vw;
  bottom: 0px;
  left: 0px;
  padding: 2px 4px;
  background-color: #999;
  img {
    margin-top: -2px;
    margin-bottom: -2px;
    margin-left: 4px;
    height: 24px;
    filter: brightness(0);
    box-shadow: inset 0px -2px 0px 0px black;
    opacity: 0.5;
  }
`;

const wrapper = document.getElementById('app');
wrapper ? ReactDOM.render((
  <App />
), wrapper) : false;
