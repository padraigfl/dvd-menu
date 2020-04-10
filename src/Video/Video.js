import React from 'react';

const getSetup = ({ sources, techOrder, type }) => ({
  techOrder: techOrder || ['html5'],
  sources: sources.map(src => ({
    type,
    src,
  })),
});

class VideoPlayer extends React.Component {
  static defaultProps = {
    id: 'vid1',
    className: 'vjs-16-9',
    // width: '640',
    // height: '360',
    setup: getSetup({
      sources: ['https://www.youtube.com/watch?v=JE63vMzb3UE'],
      techOrder: ['youtube'],
    }),
    innerRef: React.createRef(),
    setVideo: () => {},
    muted: true,
    controls: true,
  };

  state = {};

  componentDidMount() {
    if (!videojs) {
      this.setState({ noVideoJs: 'videojs' });
    } else if (this.needsYoutube() && !this.hasYoutube()) {
      this.setState({ noVideoJs: 'youtube' });
    } else {
      this.instantiate();
    }
  }

  // destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      // this.props.setVideo(null);
      this.player.dispose();
    }
    if (this.timer) {
      clearInterval(this.timer);
    }
    if (this.iosIntervalHack) {
      clearInterval(this.iosIntervalHack);
    }
  }

  needsYoutube = () =>
    this.props.youtube ||
    this.props.setup.techOrder.find(tech => tech.toLowerCase === 'youtube');

  hasYoutube = () => videojs && videojs.getTech('youtube');

  instantiate = () => {
    this.player = videojs(
      this.props.innerRef.current,
      this.props.setup,
      this.props.onReadyCheck ? () => this.props.onReadyCheck(this) : undefined
    );
    this.player.playsinline(true);

    this.props.setVideo(this.player);
    this.iosIntervalHack = setInterval(() => {
      console.log('applying interval hack');
      const iframe = document.querySelector('iframe#vid1_youtube_api');
      if (iframe) {
        iframe.setAttribute('webkit-allowfullscreen', '0');
        iframe.setAttribute('allowfullscreen', '0');
        iframe.setAttribute('webkit-playsinline', 'true');
        iframe.setAttribute('playsinline', 'true');
        if (this.iosIntervalHack) {
          clearInterval(this.iosIntervalHack);
        }
      }
    }, 2000);
  };

  render() {
    const {
      setup,
      setVideo,
      onReadyCheck,
      innerRef,
      className,
      config,
      ...rest
    } = this.props;
    if (this.state.noVideoJs === 'videojs') {
      return <div>Wheres Videojs?</div>;
    }
    if (this.state.noVideoJs === 'youtube') {
      return <div>Wheres the youtube support</div>;
    }

    return (
      <div data-vjs-player>
        <video
          preload="auto"
          {...rest}
          ref={this.props.innerRef}
          className={`video-js video-js vjs-default-skin ${className}`}
          muted
        />
      </div>
    );
  }
}

export default VideoPlayer;
