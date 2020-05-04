import React, { Component, useState } from "react";
import matrixData from "./matrix.json";
import shrekData from './shrek.json';
import { Router, Route, Link } from "@reach/router";
import DVD from './DVD';
import Menu from "./Menu";
import Video from "./Video";
import Settings from "./Settings";
import Info from "./Info";
import MainMenu from "./Main";


class App extends Component {
  render() {
    return (
      <>
        <a
          href="https://github.com/padraigfl/dvd-menu"
          target="_blank"
          style={ {position: 'absolute', top: '0', left: '0' } }
        >
          <img style={{width: '32px', height: '32px'}} src="/static/highlights/github-icon.png"/>
        </a>
        <Router>
          { [matrixData, shrekData].map((data) => (
            <DVD key={data.title} data={data} path={`${data.title}/*`} />
          ))}
          <MainMenu discs={[matrixData, shrekData]} default />
        </Router>
        <Info />
      </>
    );
  }
}

export default App;
