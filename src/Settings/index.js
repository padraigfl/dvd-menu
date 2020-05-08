import React, { createContext, createRef } from 'react';
import { navigate } from '@reach/router';
import { styled } from 'linaria/react';
import Controls from './Controls';

const SettingsContext = createContext({ muted: true, paused: true });

const StateView = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
  text-align: right;
  z-index: 10;
  .statuses > div {
    &:first-child {
      display: block;
    }
    display: none;
  }
`

const Rant = styled.div`
  h2 {
    font-size: 48px;
    text-transform: uppercase;
  }

  width: 100%;
  font-size: 18px;
  font-weight: bold;
  font-family: sans-serif;
  margin-top: 60px;
  color: white;
  text-shadow: 2px 2px black,
    -2px -2px black,
    2px -2px black,
    -2px 2px black,
    0px -2px black,
    -2px 0px black,
    0px 2px black,
    2px 0px black
    ;
`;

const StaticScreen = styled('div')`
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: grey;
`;

const  setDisplay = (ref, val) => {
  if (!ref || !ref.current) {
    return;
  }
  ref.current.style.display = val ? 'block' : 'none';
}

const tempDisplay = (ref, prev, timer) => {
  if (!ref || !ref.current) {
    return;
  }
  if (prev) {
    cancelTimeout(prev);
  }
  setDisplay(ref, true);
  return setTimeout(() => {
    setDisplay(ref, false);
  }, timer);
}

class Settings extends React.Component {
  state = {
    muted: true,
    pause: false,
    initialized: false,
  }

  mute = createRef();
  unmute = createRef();
  noop = createRef();
  dvdview = createRef();
  tvview = createRef();

  componentDidUpdate() {
    if (this.video !== this.props.video) {
      this.attachVideo();
    }
  }

  attachVideo = () => {
    this.video = this.props.video;
    this.video.one('play', () => {
      this.setState({ initialized: true })
      this.controls(false);
    });
  }

  genericSwitch = key => (bool) => {
    if (!this.video[key]) {
      return Error('invalid toggle attempt');
    }
    if (typeof bool !== 'boolean') {
      return `${this.video[key]()} – ${this.state[key]}`;
    }
    else {
      this.video[key](bool);
    }
  }

  muted = (bool) => {
    this.genericSwitch('muted')(bool);
    if (!bool) {
      setDisplay(this.mute, false);
      tempDisplay(this.unmute, null, 5000);
    } else {
      setDisplay(this.mute, true);
      setDisplay(this.unmute, false);
    }
  }

  bannedAction = () => {
    tempDisplay(this.noop, null, 2000);
  }

  controls = this.genericSwitch('controls');
  play = () => this.video.play()

  toggleTv = () =>{
    this.setState(state => {
      if (!state.static) {
        setDisplay(this.dvdview, false);
        tempDisplay(this.tvview, null, 2000);
        this.muted(true);
      } else {
        setDisplay(this.tvview, false);
        tempDisplay(this.dvdview, null, 2000);
      }
      return { static: !state.static };
    });
  }

  render() {
    const { attachVideo, state, play, pause } = this;
    return (
      <SettingsContext.Provider value={{
        state,
        actions: {
          play,
          pause
        },
        attachVideo,
      }}>
        <StateView>

          {!this.state.initialized ? (
            <Rant>
              <h2>Mute on launch</h2>
              Kinda ruins the thing but super considerate of me, innit?
            </Rant>
          ) : (
          <div className="statuses" style={{ transform: `scale(${1 / this.props.scale})`, transformOrigin: 'top right' }}>
            <div id="status__mute" ref={this.mute}>MUTE</div>
            <div id="status__unmute" ref={this.unmute}>UNMUTE</div>
            <div id="status__noop" ref={this.noop}>NO-OP</div>
            <div id="status__dvdview" ref={this.dvdview}>DVD</div>
            <div id="status__tvview" ref={this.tvview}>TV</div>
          </div>
          )}
        </StateView>
        <Controls
          initialized={this.state.initialized}
          mute={this.muted}
          toggleTv={this.toggleTv}
          video={this.props.video}
          defaultClick={this.bannedAction}
          title={this.props.title}
        />
        {this.state.initialized && this.props.children}
        { this.state.static && (
          <StaticScreen />
        )}
      </SettingsContext.Provider>
    )
  }
}

export default Settings;
