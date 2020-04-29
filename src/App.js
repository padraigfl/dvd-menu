import React, { Component, useState } from "react";
import data from "./shrek.json";
import { Router } from "@reach/router";
import Menu from "./Menu";
import Video from "./Video";
import Settings from "./Settings";
import Info from "./Info";

const buildPageComponent = data => (props) => {
  const {
    component: Component = Menu,
    media,
    index,
    ...restData
  } = data;
  const [active, setActive] = useState(false);
  return (
    <Component
      {...props}
      {...restData}
      media={Array.isArray(media) ? media[index] : media}
      active={active}
      setActive={setActive}
    />
  );
};

const buildScenesPages = (scenes) => {
  const scenePages = {};
  const pageCount = Math.ceil(scenes.scenes.length / scenes.split);
  for (let i = 0; i < pageCount; i++) {
    scenePages[`scenes/${i}`] = {
      options: [
        ...scenes.scenes.slice(i * scenes.split, (i + 1) * scenes.split )
          .map((v, idx) => ({ ...v, ...scenes.buttons[idx % scenes.buttons.length]})),
        ...scenes.options,
      ],
      ...scenes.media[i % scenes.media.length],
    };
  }
  return scenePages;
};

const debugConfig = {
  defaultVideo: 'default2.mp4',
  type: 'video/youtube',
  sourceDir: '/static/video/',
};

const getResizeValues = ({ width, height }) => {
  const rect = document.getElementById('app').getBoundingClientRect();
  const scaleByWidth = rect.width / width;
  const scaleByHeight = rect.height / height;
  const scale = scaleByWidth > scaleByHeight ? scaleByHeight : scaleByWidth;
  return { transform: `scale(${scale})`, transformOrigin: 'center left' };
}

class App extends Component {
  constructor(props) {
    super(props);
    this.ohDearItsIos = /iPhone|iPod|iPad/.test(navigator.platform);
    this.state = {
      style: document.getElementById('app').getBoundingClientRect().width < 800 ? getResizeValues({ width: 853, height: 480 }) : undefined
    };
  }

  ref;
  resizeListener = () => {
    const style = getResizeValues({ width: 853, height: 480 });
    if (style.transform) {
      return;
    }
    const change = Math.abs(+style.transform.split(/\(|\)/)[1] - this.state.style.transform.split(/\(|\)/)[1]);
    if (change > 0.2) {
      this.setState({ style })
    }
  }

  componentDidMount() {
    let iOSNote = 'IOS_WARNING';
    if (this.ohDearItsIos && !window.localStorage.getItem(iOSNote) && confirm('Warning: There will be video rendering issues on iOS. Please refresh if video fails and double click buttons.')) {
      window.localStorage.setItem(iOSNote, true);
    }
    if (this.state.style) {
      window.addEventListener('resize', this.resizeListener);
    }
  }

  componentWillUnmount() {
    if (this.listener) {
      window.removeEventListener('resize', this.resizeListener)
    }
  }

  render() {
    const { pages, launch, scenes, ...config } = data; 
    const sceneData = buildScenesPages(scenes);
    const pageOptions = { ...pages, ...sceneData };
    let links = [];
    return (
      <>
        <a
          href="https://github.com/padraigfl/dvd-menu"
          target="_blank"
          style={ {position: 'absolute', top: '0', left: '0' } }
        >
          <img style={{width: '32px', height: '32px'}} src="/static/highlights/github-icon.png"/>
        </a>
        <div id="wrapper" ref={this.ref} className={config.title} style={this.state.style}>
          <Video
            launch={launch}
            config={{
              ...debugConfig,
              ...config,
            }}
            needsBackup={this.ohDearItsIos}
          >
            {({ onLoad, getVideo, clearVideoListeners }) => {
              return (
                <Settings video={getVideo()} clearVideoListeners={clearVideoListeners}>
                  <Router>
                    {Object.entries(pageOptions).map(([link, data], idx) => {
                      const Component = buildPageComponent({ ...data, scenesData: scenes, pageName: `/${link}` });
                      links.push(`/${link}`);
                      return (
                        <Component
                          onLoad={onLoad}
                          path={link}
                          key={`r${idx}`}
                          default={link === 'launch'}
                        />
                      );
                    })}
                  </Router>
                </Settings>
            )}}
          </Video>
        {/* DEBUG: list of routes */}
        {/* {links.map(link => (
          <Link to={link}> {link}</Link>
        ))} */}
        </div>
        <Info />
      </>
    );
  }
}

export default App;
