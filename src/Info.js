import React from 'react';
import { styled } from 'linaria/react';
import { Link } from '@reach/router';

const InfoWrapper= styled.div`
  position: relative;
  overflow: auto;
  background-color: #999;
  z-index: 10;
  padding: 16px;
  padding-bottom: 20px;
  padding-top: 50px;
  text-shadow: 0px 0px 2px black;
  img {
    margin-top: -2px;
    margin-bottom: -2px;
    margin-left: 4px;
    height: 24px;
    filter: brightness(0);
    box-shadow: inset 0px -2px 0px 0px black;
  }
  a { color: white; font-weight: bold; }
`;

const Info = () => (
  <InfoWrapper>
    <Link to="/">Home</Link>
    <h2>What is this?</h2>
    <p>
      This project attempts to recreate DVD menus using the source menu video file from the DVD. {' '}
      Most custom configuration is handled via JSON so the code could be used to make others. {' '}<br />
      Apologies for the video quality, I'm not very good at converting dvd menus to mp4.
    </p>

    <h2>How DVD Menus Work</h2>
    <p>
      I'm probably going to write something about DVD menus around this project at some point. If you've like me to cover something please contact me.
    </p>
    <p>A basic summary (to my knowledge) is as follows</p>
    <ul>
      <li>DVDs use a single video file for their menus</li>
      <li>The various menus and transitions are configured to use a portion of this video (e.g. a still background with no audio is likely to be a fraction of a second of video looping)</li>
      <li>Each individual section contains rules determining the various buttons on the page and where they lead</li>
      <li>Transitions contain no buttons but a location to go to on video end</li>
    </ul>

    <h2>Issues</h2>
    <ul>
      <li>Most issues should be resolvable by a refresh</li>
      <li>Everything mutes by default to prevent video loading issues on browsers</li>
      <li>iOS proved especially difficult (consistently forces videos to full screen) so I'm self-hosting super low-res videos especially for it</li>
      <li>Due to the timeouts involved all over the place, code breaks fairly often if you switch tabs, it usually should right itself</li>
      <li>As seen in the <Link to="/matrix-BETA/root">Matrix DVD</Link>, the super brief timeframes for some menu pages within the videos is highly likely to break</li>
      <li>Initially I was trying to get this thing to handle multiple videos so you could potentially stack in the extra features and the film itself, enable subtitles, etc... I got lazy and bailed on this, links away from the menus specifically loop back on themselves</li>
      <li>I thought scenes were handles a bit more cleverly than they are going by the Shrek DVD</li>
    </ul>

    <h2>Other things I've done</h2>
    <ul>
      {[
        { link: 'https://packard-belle.netlify.app/', text: 'Windows98 Clone', github: 'https://github.com/padraigfl/packard-belle' },
        { link: 'https://react-coursebuilder.netlify.app', text: 'Youtube Playlists\' Note Taker', github: 'https://github.com/padraigfl/videojs-react-course-assistant' },
        { link: 'https://critics-lists.netlify.app/', text: 'End-of-year critics\' lists breakdown (wip)', github: 'https://github.com/padraigfl/critics-lists' },
        { link: 'https://github.com/padraigfl/us-bus-data', text: 'GeoJSON data for loads of US public transit routes' }
      ].map((v, idx, arr) => (
        <li>
          <a href={v.link} target="_blank">{v.text}</a>
          {v.github && (
            <a href={v.github} target="_blank"><img src="/static/highlights/github-icon.png" /></a>
          )}
          {idx !== arr.length - 1 && `, `}
        </li>
      ))}
    </ul>
    <p>
      If you'd like to improve the videojs integration or add some other menus that'd be really neat!{' '}
      [<a href="https://github.com/padraigfl/dvd-menu" target="_blank">Source Code</a>]
    </p>
  </InfoWrapper>
);

export default Info;
