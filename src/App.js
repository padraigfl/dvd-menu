import React, { Component, useState } from "react";
import dataJson from "./data.single.json";
import config from "./config.json";
import { Link, Router } from "@reach/router";
import Menu from "./Menu";
import Video from "./Video";
import Settings from "./Settings";

const buildPageComponent = data => (props) => {
  const {
    component: Component = Menu,
    media,
    index,
    ...restData
  } = data;
  const [active, setActive] = useState(false);
  console.log(restData);
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

const debugConfig = {
  defaultVideo: 'default2.mp4',
  type: 'video/youtube',
  sourceDir: '/assets/video/',
  ...config,
};

class App extends Component {
  state = {
    initialLoadCompleted: false,
  };

  render() {
    const { launch, ...pageOptions } = dataJson;
    let links = [];

    if (/iPhone|iPod|iPad/.test(navigator.platform) || window.innerWidth < 500) {
      return (
        <p>
          Sorry, iOS (and probably many mobile devices) keeps forcing videos to fullscreen so this doesn't work at all there yet.
          Let me know if you can help at <a href="https://github.com/padraigfl">my github</a>.
        </p>
      );
    }

    return (
      <>
        <Video
          launch={launch}
          config={debugConfig}
        >
          {({ onLoad, startPageChange, getVideo, clearVideoListeners }) => {
            return (
              <Settings video={getVideo()} clearVideoListeners={clearVideoListeners}>
                <Router>
                  {Object.entries(pageOptions).map(([link, data], idx) => {
                    const Component = buildPageComponent({ ...data, scenesData: config.scenesData, pageName: `/${link}` });
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
      </>
    );
  }
}

export default App;
