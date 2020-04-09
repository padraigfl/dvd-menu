import React from 'react';
import ReactDOM from 'react-dom';
import { css } from 'linaria';
import App from './App';

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
    opacity: 0.5;
  }
`;

const wrapper = document.getElementById('app');
wrapper ? ReactDOM.render((
  <>
    <App />
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
  </>
), wrapper) : false;
