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
  z-index: 10;
  .statuses {
    display: flex;
  }
  .statuses > div {
    &:first-child {
      display: block;
    }
    display: none;
  }
`

const StatusDisplay = styled.div`
  margin: 20px;
  margin-left: auto;
  font-size: 24px;
  color: white;
  text-shadow: 2px 2px 2px black, -2px -2px 2px black, -2px 2px 2px black, 2px -2px 2px black, 2px 0px 2px black, 0px 2px 2px black, -2px 0px 2px black, 0px -2px 2px black;
  position: ${({ left }) => left ? 'absolute' : 'relative'};
  left: ${({ left }) => left ? '20px' : 'initial'};
  img {
    max-width: 60px;
    max-height: 60px;
    filter: brightness(100)
    drop-shadow(2px 0px 0 black)
    drop-shadow(0px 2px 0 black)
    drop-shadow(-2px 0px 0 black)
    drop-shadow(0px -2px 0 black)
    drop-shadow(-2px -2px 0px black)
    drop-shadow(2px 2px 0px black)
    drop-shadow(0px 0px 2px black);
  }
`;

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
  z-index: 20;
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background-color: grey;
  &:after {
    content: 'NO SIGNAL';
    color: #2f6;
    position: absolute;
    top: 20px;
    left: 20px;
    font-size: 48px;
  }
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
    subtitles: '',
    audio: '',
  }

  mute = createRef();
  unmute = createRef();
  noop = createRef();
  dvdview = createRef();
  tvview = createRef();
  subtitles = createRef();
  audio = createRef();

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

  showVal = (key) => () => {
    this.setState(
      { [key]: window.localStorage.getItem(key)},
      () => tempDisplay(this[key], null, 2000),
    );
  }

  showSubs = this.showVal('subtitles');
  showAudio = this.showVal('audio');

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
    tempDisplay(this.noop, null, 1000);
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
              Kinda ruins the thing but browsers will be nicer to autoplay this way
            </Rant>
          ) : (
            <>
              <div
                className="statuses"
              >
                <StatusDisplay ref={this.mute}><img src="/static/icons/mute.png" alt="" /></StatusDisplay>
                <StatusDisplay ref={this.unmute}><img src="/static/icons/unmute.png" alt="" /></StatusDisplay>
                <StatusDisplay ref={this.noop} left><span>NO-OP</span></StatusDisplay>
                <StatusDisplay ref={this.audio} left>Audio: {this.state.audio}</StatusDisplay>
                <StatusDisplay ref={this.subtitles} left>Subtitles: {this.state.subtitles}</StatusDisplay>
              </div>
            </>
          )}
        </StateView>
        <Controls
          initialized={this.state.initialized}
          mute={this.muted}
          toggleTv={this.toggleTv}
          video={this.props.video}
          defaultClick={this.bannedAction}
          title={this.props.title}
          toggleHD={this.props.toggleHD}
          showAudio={this.showAudio}
          showSubs={this.showSubs}
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
