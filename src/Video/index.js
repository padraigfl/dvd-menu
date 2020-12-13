import React, { Component, createContext } from "react";
import { navigate } from "@reach/router";
import Video from './Video';

class VideoHandler extends Component {
  constructor(props) {
    super(props);
    this.baseVideo = `${props.config.sourceDir}${props.config.defaultVideo}`;
    this.defaultVidSource = props.needsBackup
      ? props.config.backupLocalVideo[0]
      : this.baseVideo;
    this.state = {
      needsBackup: props.needsBackup,
      video: null,
    };
  }

  pauseListener; // as youtube displays stuff if you pause, we loop a small patch over instead
  loopListener;
  endAction;
  video;
  pauseTime;
  audio = true;
  attempts = 0;
  pauseMode;

  componentWillUnmount() {
    this.cleanup();
  }

  getCorrectType = () => this.state.needsBackup ? 'video/mp4' : this.props.config.type;

  setSource = (source, sourceType) => {
    if (source === this.video.src()) {
      return;
    }
    const src = source || this.defaultVidSource;
    const type = sourceType || this.getCorrectType();
    this.video.src({ src, type });
  }

  errorHandler = (startTime, redirect) => {
    if (this.attempts > 5 && this.video.src() === this.baseVideo) {
      this.setState({ needsBackup: true });
      this.defaultVidSource = this.props.config.backupLocalVideo[0];
    }
    if (this.attempts > 10){
      if (redirect) {
        window.location.replace(redirect);
        return;
      }
      const retry = confirm(
        `The video has failed to load, please click OK to refresh and try again. If you are on iOS, please try on a computer.`
      );
      if (retry) {
        window.location.reload();
      }
    } else if ([this.baseVideo, ...this.props.config.backupLocalVideo].includes(this.video.src())) {
      this.setSource(this.props.config.backupLocalVideo[this.attempts % this.props.config.backupLocalVideo]);
      setTimeout(() => this.videoPlay({ startTime, redirect }), 500 * (this.attempts + 1));
    }
    this.attempts++;
  }

  videoPlay = (playData = {}) => {
    const {
      callback,
      errorHandler = this.errorHandler,
      startTime = 0,
      redirect,
    } = playData;
    this.video.currentTime(startTime);
    this.video.play()
      .then((...args) => {
        if (this.pauseMode) {
          this.video.pause();
        }
        if (callback) {
          callback(...args);
        }
      })
      .catch((...args) => {
        if (typeof errorHandler === 'undefined') {
          this.errorHandler(startTime, redirect);
        } else {
          errorHandler(...args);
        }
      });
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
    // NOTE: will need to update how youtube videos work or strip them out entirely
    this.pauseMode = (end - start) < 0.5;
    const startPoint = start || 0;
    this.cleanup();
    const onFinish = redirect
      ? () => navigate(redirect, { replace: true })
      : () => {
          this.video.currentTime(startPoint);
          this.videoPlay({ startTime: startPoint });
        }
    this.video.one('play', () => {
      this.video.controls(!!controls);

      // // if the time set in the promise occurs prematurely and fails
      if (Math.abs(this.video.currentTime() - startPoint) > 0.5){
        this.video.currentTime(startPoint);
      }
    });

    if (this.pauseMode && !this.video.paused()) {
      this.video.currentTime(startPoint);
      this.video.play().then(this.video.pause);
    }

    this.setOnFinishAction(onFinish);  

    if (media) {
      this.setSource(`${this.props.config.sourceDir}${media}`, this.props.config.type);
      this.video.controls(true);
      if (!this.pauseMode) {
        setTimeout(() => {
          this.video.play();
        }, 2000);
      }
      return;
    } else {
      this.setSource(this.defaultVidSource);
    }

    const callback = () => {
      this.video.currentTime(startPoint);
      if (loadAction) {
        loadAction(true);
      }
      this.attempts = 0;
      if (end && !this.pauseMode) {
        this.loopListener = setInterval(() => {
          if (this.video.currentTime() >= end) {
            onFinish();
          }
        }, 10);
      }
    };

    this.video.one('pause', () => {
      this.videoPlay({ callback, startTime: start });
    });
  
    this.videoPlay({
      callback,
      startTime: startPoint,
      redirect,
    });
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

  setVideo = (video) => {
    window.vid = video;
    this.video = video;
    this.setState({ video });
    video.muted(true);
    video.controls(true);
    this.videoPlay();
    // if (this.props.launch && window.location.pathname === '/') {
    //   this.runLaunchVideos(0);
    // }
  }

  getVideo = () => this.video;

  toggleHD = this.props.config.hq
    ? () => {
      this.setSource(
        this.video.src() === this.defaultVidSource
          ? `${this.props.config.sourceDir}${this.props.config.hq}`
          : this.defaultVidSource
      );
    }
    : null;

  render() {
    const { startPageChange, toggleHD, onLoad, getVideo, cleanup, props } = this;
    return (
      <>
        <Video
          setup={{
            sources: [{ src: this.defaultVidSource, type: this.getCorrectType() }],
            //sources: [{ src: 'https://www.youtube.com/watch?v=V3airyA0Kig', type: 'video/youtube' }],
            techOrder: ['html5', 'youtube'],
          }}
          poster={props.config.poster}
          setVideo={this.setVideo}
          autoPlay
          playsInline="1" // youtube requires "1"
        />
        {
          this.props.children({ startPageChange, onLoad, getVideo, clearVideoListeners: cleanup, toggleHD })
        }
      </>
    );
  }
}

export default VideoHandler;
