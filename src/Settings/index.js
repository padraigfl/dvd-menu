import React, { createContext } from 'react';
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
  width: 100%;
  height: 100%;
  background-color: grey;
`;

const tempDisplay = (id, prev, timer) => {
  if (prev) {
    cancelTimeout(prev);
  }
  const el = document.getElementById(id);
  el.style.display = 'block';
  return setTimeout(() => {
    el.style.display = 'none';
  }, timer);
}

class Settings extends React.Component {
  state = {
    muted: true,
    pause: false,
    initialized: false,
  }

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
      tempDisplay('settings--unmute');
    } else {
      mute.current.style.display = 'block';
    }
  }

  controls = this.genericSwitch('controls');
  play = () => this.video.play()

  toggleTv = () =>{
    this.setState(state => {
      if (!state.static) {
        this.muted(true);
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
          <div  style={{ transform: `scale(${1 / this.props.scale})`, transformOrigin: 'top right' }}>
            <div id="settings__mute" style={{ display: this.video.muted() ? 'none' : 'block'}}>MUTE</div>
            <div id="settings__unmute" style={{ display: this.video.muted() ? 'none' : 'block'}}>UNMUTE</div>
            <div id="settings__noop" style={{ display: 'none' }}>N/A</div>
            <div id="settings__dvdview" style={{ display: 'none' }}>DVD</div>
            <div id="settings__tvview" style={{ display: 'none' }}>DVD</div>
          </div>
          )}
        </StateView>
        <Controls
          initialized={this.state.initialized}
          mute={this.muted}
          toggleTv={this.toggleTv}
          video={this.props.video}
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
