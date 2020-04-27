import React, { Component, createContext } from "react";
import { navigate } from "@reach/router";
import Video from './Video';

class VideoHandler extends Component {
  constructor(props) {
    super(props);
    this.defaultVidSource = `${props.config.sourceDir}${props.config.defaultVideo}`;
    this.state = {
      video: null,
    };
  }

  pauseListener; // as youtube displays stuff if you pause, we loop a small patch over instead
  loopListener;
  endAction;
  video;
  pauseTime;
  audio = true;

  componentWillUnmount() {
    this.cleanup();
  }

  /* TODO resolve startTime issues
  currentTime should not have to be set this many times but was firing unreliably with youtube
  if assuming always youtube videos something could be done via updating src to include 
  */
  onLoad = ({
    media, // video file, if new will update the video file
    start, // will default to 0
    end, // will default to end of video
    redirect, // if absent video will loop according to specified times
    loadAction,
    controls,
  }) => {
    const startPoint = start || 0;
    this.cleanup();
    const onFinish = redirect
      ? () => navigate(redirect, { replace: true })
      : () => {
        this.video.currentTime(startPoint);
        this.video.play();
      }
    this.video.one('play', () => {
      if (this.pauseListener) {
        clearInterval(this.pauseListener);
      }
      this.video.controls(!!controls);

      // if the time set in the promise occurs prematurely and fails
      if (Math.abs(this.video.currentTime() - startPoint) > 0.5){
        this.video.currentTime(startPoint);
      }
    });

    this.setOnFinishAction(onFinish);  

    if (media && `${this.props.config.sourceDir}${media}` !== this.video.src()) {
      this.video.src({ src: `${this.props.config.sourceDir}${media}`, type: this.props.config.type });
      if (this.pauseListener) {
        clearInterval(this.pauseListener);
      }
      this.video.controls(true);
      return;
    } else if (
      !media
      && this.props.config
      && this.video.src() !== this.defaultVidSource
    ) {
      this.video.src({ src: this.defaultVidSource, type: this.props.config.type  });
    }
    // this.videoPause(startPoint);


    if (!redirect) {
      this.video.one('pause', () => {
          this.video.play();
      });
    };

    this.video.play().then(() => {
      this.video.play();
      this.video.currentTime(startPoint);
      if (loadAction) {
        loadAction();
      }
      if (end) {
        this.loopListener = setInterval(() => {
          if (this.video.currentTime() >= end) {
            onFinish();
          }
        }, 100);
      }
    });
  }

  // TODO: resolve issues with youtube pausing and interval check
  /*
    Currently this option fails as youtube displays some junk while pausing,
    the setInterval loop hack attempted here is too unreliable and would need to be tidied considerably to be an option
  */
  videoPause = (pauseTime) => {
    if (this.video.currentType() !== 'video/youtube' || !window.chrome) {
      this.video.pause();
    }
    else {
      this.pauseTime = typeof pauseTime === 'number' ? pauseTime : this.video.currentTime();
      if (this.pauseListener) {
        clearInterval(this.pauseListener);
      }
      this.pauseListener = setInterval(() => {
        this.video.currentTime(this.pauseTime);
      }, 40);
    }
  }

  cleanup = () => {
    if (this.loopListener) {
      clearInterval(this.loopListener);
    }
    if (this.pauseListener) {
      clearInterval(this.pauseListener);
    }
    this.video.off('ended', this.endAction);
  }

  setOnFinishAction = (action) => {
    this.video.one('ended', action);
    this.endAction = action;
  }

  // mimic staggered freeze on selecting an option in menu
  startPageChange = () => {
    // this.videoPause();
  }

  runLaunchVideos = (idx) => {
    this.cleanup();
    const vidData = this.props.launch[idx];
    if (!vidData) {
      if (this.video.src() !== this.defaultVidSource) {
        this.video.src({ src:  this.defaultVidSource, type: this.props.config.type });
      }

      if (window.location.pathname === '/') {
        navigate('/root');
      }
      return;
    }
    const newVidSrc = `${this.props.config.sourceDir}${vidData.media}`;
    try {
      if (vidData.media && this.video.src() !== newVidSrc) {
        this.video.src({ src: newVidSrc, type: this.props.config.type });
      } else if (!vidData.media && this.video.src() !== this.defaultVidSource) {
        this.video.src({ src: this.defaultVidSource, type: this.props.config.type });
      }
      this.video.currentTime(vidData.start || 0);
      const endAction = () => this.runLaunchVideos(idx + 1)
      this.video.play().then(() => {
        this.video.on('ended',  endAction);
        if (vidData.length) {
          this.loopListener = setInterval(() => {
            if (this.video.currentTime() > ((vidData.start || 0) + vidData.length)) {
              endAction();
            }
          }, 100);
        }
      });
    } catch {
      this.runLaunchVideos(idx + 1);
    }
  }

  setVideo = (video) => {
    window.vid = video;
    this.video = video;
    this.setState({ video });
    video.muted(true);
    video.controls(true);
    if (this.props.launch && window.location.pathname === '/') {
      this.runLaunchVideos(0);
    }
  }

  getVideo = () => this.video;

  render() {
    const { startPageChange, onLoad, getVideo, cleanup, props } = this;
    return (
      <>
        <Video
          setup={{
            sources: [{ src: this.defaultVidSource, type: this.props.config.type }],
            //sources: [{ src: 'https://www.youtube.com/watch?v=V3airyA0Kig', type: 'video/youtube' }],
            techOrder: ['html5', 'youtube'],
          }}
          poster={props.config.poster}
          setVideo={this.setVideo}
          autoPlay
          playsInline="1" // youtube requires "1"
        />
        {
          this.props.children({ startPageChange, onLoad, getVideo, clearVideoListeners: cleanup })
        }
      </>
    );
  }
}

export default VideoHandler;
