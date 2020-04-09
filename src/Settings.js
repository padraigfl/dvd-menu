import React, { createContext } from 'react';
import { navigate } from '@reach/router';
import { styled } from 'linaria/react';

const SettingsContext = createContext({ muted: true, paused: true });

const Controls = styled.div`
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
        <Controls>
          <button onClick={() => {
            alert(
              `Subtitles: ${window.localStorage.getItem('subtitles') || 'default'
                }\nAudio Track: ${window.localStorage.getItem('audio') || 'default'
                }\n\nNote: This is a recreation of a DVD menu done in JavaScript with the source DVD menu as a background video hosted on youtube, adblockers may be required.`
            )
          }}>Settings</button>
          {window.location.pathname !== '/root' && (
              <button type="button" onClick={() => navigate('/root')}>Home</button>
          )}
          { this.state.initialized ? (
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
          ): (
            <Rant>
              <h2>Mute on launch</h2>
              Kinda ruins the thing but super considerate of me, innit?
            </Rant>
          )}
        </Controls>
        {!this.state.controls && this.state.initialized && this.props.children}
      </SettingsContext.Provider>
    )
  }
}

export default Settings;
