import React, { Component, useState } from "react";
import matrixData from "./matrix.json";
import shrekData from './shrek.json';
import { Router, Route, Link } from "@reach/router";
import DVD from './DVD';
import Info from "./Info";
import MainMenu from "./Main";

const dvds = [shrekData, matrixData];

const Victory = () => (
  <div className="fillHeight" style={{
    width: '100%',
    maxWidth: '100vw',
    backgroundColor: 'pink',
    fontSize: '36px',
    zIndex: 1000,
    alignContent: 'center',
    textAlign: 'center',
    position: 'fixed',
    textTransform: 'uppercase',
    fontWeight: 'bold',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
  }}>
    <div>Congratulations!</div>
    <div>The DVD logo from the screensaver hit the corner!</div>
    <div>You have won the game!</div>
  </div>
);

class App extends Component {
  render() {
    return (
      <>
        <Link
          to="/info"
          target="_blank"
          style={ {
            position: 'absolute',
            top: '4px',
            left: '4px',
            color: 'white',
            fontSize: '28px',
            padding: '4px 9px 2px',
            textDecoration: 'none',
            textAlign: 'center',
            border: '2px solid white',
          } }
        >
          ?
        </Link>
        <Router>
          { dvds.map((data) => (
            <DVD key={data.title} data={data} path={`${data.title}/*`} />
          ))}
          <Victory path="/victory" />
          <Info path="/info"/>
          <MainMenu discs={dvds} default />
        </Router>
      </>
    );
  }
}

export default App;
