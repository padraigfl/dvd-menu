import React from 'react';
import { styled } from 'linaria/react';
import { Link } from '@reach/router';

export const InfoWrapper= styled.div`
  position: relative;
  overflow: auto;
  background-color: #777;
  z-index: 10;
  padding: 16px;
  padding-bottom: 20px;
  padding-top: 50px;
  text-shadow: 0px 0px 2px black;
  display: inline-block;
  max-width: 800px;
  display: inline-block;
  img {
    margin-top: -2px;
    margin-bottom: -2px;
    margin-left: 4px;
    filter: brightness(0);
  }
  .gitlink { img { height: 24px; } }
  a { color: white; font-weight: bold; }
  .otherThings {
    .otherThing {
      display: flex;
      min-height: 24px;
      align-items: center;
      flex-wrap: wrap;
    }
  }
  blockquote {
    position: relative;
    p {
      margin-top: 0px;
      margin-bottom: 8px;
    }
    &::before {
      display: block;
      content: '“';
      position: absolute;
      transform: translateX(-100%);
      font-style: italic;
      font-weight: bold;
    }
    p:last-child::after {
      font-style: italic;
      content: '”';
      font-weight: bold;
    }
  }
`;

const Info = () => (
  <InfoWrapper>
    <Link to="/">Home</Link>
    <div style={{ maxWidth: '800px' }}>
      <h2>What is this?</h2>
      <p>
        This project attempts to recreate DVD menus using the source menu video file from the DVD. {' '}
        Most custom configuration is handled via JSON so the code could be used to make others. {' '}<br />
        Apologies for the video quality, I'm not very good at converting dvd menus to mp4.
      </p>

      <h2>How DVD Menus Work</h2>
      <p>Please check <Link to="/why">this page</Link> for more info on that, not sure how coherent it is</p>

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
      <ul className="otherThings">
        {[
          { link: 'https://packard-belle.netlify.app/', text: 'Windows98 Clone', github: 'https://github.com/padraigfl/packard-belle' },
          { link: 'https://react-coursebuilder.netlify.app', text: 'Youtube Playlists Note Taker (kinda like the ones you have on Udemy and such)', github: 'https://github.com/padraigfl/videojs-react-course-assistant' },
          { link: 'https://critics-lists.netlify.app/', text: 'End-of-year critics\' lists breakdown (wip)', github: 'https://github.com/padraigfl/critics-lists' },
          { link: 'https://github.com/padraigfl/', text: 'Other random crap' }
        ].map((v, idx, arr) => (
          <li>
            <div className="otherThing">
              <a href={v.link} target="_blank">{v.text}</a>
              {v.github && (
                <a className="gitlink" href={v.github} target="_blank"><img src="/static/highlights/github-icon.png" /></a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <p>
        If you'd like to improve the videojs integration (getting it possible to run multiple videos without huge issues and bugginess would be great) or add some other menus that'd be really neat!{' '}
        [<a href="https://github.com/padraigfl/dvd-menu" target="_blank">Source Code</a>]
      </p>
      <p><em>Oh, and did you find the thing in the screensaver?</em></p>
    </div>
  </InfoWrapper>
);

export default Info;
