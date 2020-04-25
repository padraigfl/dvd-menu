import React, { Component, useState } from "react";
import data from "./shrek.json";
import { css } from 'linaria';
import { Router } from "@reach/router";
import Menu from "./Menu";
import Video from "./Video";
import Settings from "./Settings";

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
  }
`;

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

class App extends Component {
  state = {
    initialLoadCompleted: false,
  };

  render() {
    const { pages, launch, scenes, ...config } = data; 
    const sceneData = buildScenesPages(scenes);
    const pageOptions = { ...pages, ...sceneData };
    const ohDearItsIos = !/iPhone|iPod|iPad/.test(navigator.platform);
    let links = [];
    const footer = (
      <div className={marqueeStyles}>
        Hi, this is a recreation of a DVD menu using the source menu file from the DVD. {' '}
        Most custom configuration is handled via JSON so the code could be used to make others. {' '}<br />
        Apologies for the video quality, I'm not very good at converting dvd menus to mp4
        <br />
        <p>
          Other things I've hacked together include:{' '}
          {[
            { link: 'https://packard-belle.netlify.com', text: 'Windows98 Clone', github: 'https://github.com/padraigfl/packard-belle' },
            { link: 'https://react-coursebuilder.netlify.com', text: 'Youtube Playlists\' Note Taker', github: 'https://github.com/padraigfl/videojs-react-course-assistant' },
            { link: 'https://omdb--critics-lists.netlify.com/', text: 'End-of-year critics\' lists breakdown', github: 'https://github.com/padraigfl/critics-lists' },
            { link: 'https://github.com/padraigfl/us-bus-data', text: 'GeoJSON data for loads of US public transit routes' }
          ].map((v, idx, arr) => (
            <>
              <a href={v.link} target="_blank">{v.text}</a>
              {v.github && (
                <a href={v.github} target="_blank"><img src="/static/highlights/github-icon.png" /></a>
              )}
              {idx !== arr.length - 1 && `, `}
            </>
          ))}
        </p>
        <p>
          If you'd like to improve the videojs integration or add some other menus that'd be really neat!{' '}
          [<a href="https://github.com/padraigfl/dvd-menu" target="_blank">Source Code</a>]
        </p>
      </div>
    );

    if (ohDearItsIos) {
      alert('Video issues will occur on iOS, sorry.');
    }

    return (
      <>
        {footer}
        <div id="wrapper" style={ window.innerWidth < 500 ? { transform: `scale(${window.innerWidth / 853})`, transformOrigin: 'center left' } : undefined}>
          <Video
            launch={launch}
            config={{
              ...debugConfig,
              ...config,
            }}
            needsBackup={ohDearItsIos}
          >
            {({ onLoad, startPageChange, getVideo, clearVideoListeners }) => {
              return (
                <Settings video={getVideo()} clearVideoListeners={clearVideoListeners}>
                  <Router>
                    {Object.entries(pageOptions).map(([link, data], idx) => {
                      const Component = buildPageComponent({ ...data, scenesData: scenes, pageName: `/${link}` });
                      links.push(`/${link}`);
                      return (
                        <Component
                          onLoad={onLoad}
                          startPageChange={startPageChange}
                          path={link}
                          key={`r${idx}`}
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
      </>
    );
  }
}

export default App;
