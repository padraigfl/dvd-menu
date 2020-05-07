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
      this.setState({ [key]: bool });
    }
  }

  muted = this.genericSwitch('muted')
  controls = this.genericSwitch('controls');
  play = () => this.video.play()
  pause = () => {
    this.video.pause();
    this.setState({ pause: true });
    this.video.one('play', () => this.setState({ pause: false }));
  }

  render() {
    const { attachVideo, state, muted, play, pause } = this;
    return (
      <SettingsContext.Provider value={{
        state,
        actions: {
          muted,
          play,
          pause
        },
        attachVideo,
      }}>
        <StateView>
          <div  style={{ transform: `scale(${1 / this.props.scale})`, transformOrigin: 'top right' }}>
            { this.state.initialized && (
              <>
                {/* <button
                  type="button"
                  onClick={() => this.controls(!this.state.controls)}
                >
                  Video Controls {this.state.controls ? 'On' : 'Off'}
                </button> */}
                <button
                  type="button"
                  onClick={() => this.muted(!this.state.muted)}
                >
                  { this.state.muted ? 'Unmute' : 'Mute' }
                </button>
              </>
            )}
          </div>

          {!this.state.initialized && (
            <Rant>
              <h2>Mute on launch</h2>
              Kinda ruins the thing but super considerate of me, innit?
            </Rant>
          )}
        </StateView>
        <Controls
          initialized={this.state.initialized}
          muted={this.state.muted}
          mute={this.muted}
        />
        {!this.state.controls && this.state.initialized && this.props.children}
      </SettingsContext.Provider>
    )
  }
}

export default Settings;
