import React, { Component, useState, useMemo } from "react";
import { Router, Route } from "@reach/router";
import Menu from "./Menu";
import Video from "./Video";
import Settings from "./Settings";
import Info from "./Info";
import { cx } from "linaria";

const buildPageComponent = data => (props) => {
  const {
    component: Component = Menu,
    media,
    index,
    options,
    title,
    ...restData
  } = data;
  const [active, setActive] = useState(false);
  const formattedOptions = useMemo(() =>
    options
      ? options.map((o) => ({
          ...o,
          link: o.link && !o.link.match(/^https?:\/\/.*/) ? `/${title}${o.link}` : o.link,
        }))
      : undefined,
    [props.options],
  );
  return (
    <Component
      {...props}
      {...restData}
      title={title}
      redirect={data.redirect ? `/${title}${data.redirect}` : undefined}
      options={formattedOptions}
      media={Array.isArray(media) ? media[index] : media}
      active={active}
      setActive={setActive}
    />
  );
};

const X = () => <div>{['HELLO'].map(v => {alert("X"); return v;})}</div>;

const buildScenesPages = (scenes) => {
  const scenePages = {};
  const pageCount = Math.ceil(scenes.scenes.length / scenes.perPage);
  for (let i = 0; i < pageCount; i++) {
    scenePages[`scenes/${i}`] = {
      options: [
        ...scenes.scenes.slice(i * scenes.perPage, (i + 1) * scenes.perPage )
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
  return scale;
}

class DVD extends Component {
  constructor(props) {
    super(props);
    this.ohDearItsIos = /iPhone|iPod|iPad/.test(navigator.platform);
    this.state = {
      scale: document.getElementById('app').getBoundingClientRect().width < 800 ? getResizeValues({ width: 853, height: 480 }) : 1
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
      this.setState({ scale })
    }
  }

  componentDidMount() {
    let iOSNote = 'IOS_WARNING';
    if (this.ohDearItsIos && !window.localStorage.getItem(iOSNote)) {
      console.log('Warning: There will be video rendering issues on iOS. Please refresh if video fails and double click buttons.');
      window.localStorage.setItem(iOSNote, true);
    }
    if (this.state.scale !== 1) {
      window.addEventListener('resize', this.resizeListener);
      window.addEventListener('orientationchange', this.resizeListener);
    }
  }

  componentWillUnmount() {
    if (this.listener) {
      window.removeEventListener('orientationchange', this.resizeListener)
    }
  }

  render() {
    const { pages, launch, scenes, defaultLinkStyle = {}, ...config } = this.props.data; 
    const sceneData = buildScenesPages(scenes);
    const pageOptions = { ...pages, ...sceneData };
    let links = [];
    return (
        <div
          id="wrapper"
          ref={this.ref}
          className={cx('dvd', config.title)}
          style={
            {
              transform: this.state.scale !== 1 ? `scale(${this.state.scale})` : '',
              transformOrigin: 'top left',
            }
          }
        >
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
                <Settings title={config.title} video={getVideo()} clearVideoListeners={clearVideoListeners} scale={this.state.scale}>
                  <Router>
                      {Object.entries(pageOptions).map(([link, data], idx) => {
                        const Component = buildPageComponent({ ...data, title: config.title, defaultLinkStyle, scenesData: scenes, pageName: `/${link}` });
                        return (
                          <Component
                            scale={this.state.scale}
                            onLoad={onLoad}
                            path={`/${link}`}
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
    );
  }
}

export default DVD;
