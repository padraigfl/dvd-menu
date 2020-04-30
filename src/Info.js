import React, { useState, useCallback } from 'react';
import { css } from 'linaria';
import { styled } from 'linaria/react';

const marqueeStyles = css`
  position: fixed;
  width: 100vw;
  max-height: 80vh;
  bottom: 0px;
  left: 0px;
  display: flex;
  flex-direction: column;
  overflow: auto;

  > p {
    margin: 8px;
  }
  background-color: #999;
  z-index: 10;
  img {
    margin-top: -2px;
    margin-bottom: -2px;
    margin-left: 4px;
    height: 24px;
    filter: brightness(0);
    box-shadow: inset 0px -2px 0px 0px black;
  }
  padding-bottom: 20px;
`;

const InfoButton = styled.button`
  position: absolute;
  right: 0px;
  bottom: 0px;
  background-color: #eee;
  height: 28px;
  font-size: 20px;
  margin: 8px;
  margin-left: auto;
  margin-right: 0px;
  border-color: red;
  z-index: 15;
`;

const Info = () => {
  const [overlay, setOverlay] = useState(false);
  const toggleOverlay = useCallback(() => setOverlay(!overlay), [overlay]);

  if (!overlay) {
    return (
      <InfoButton onClick={toggleOverlay}>Info</InfoButton>
    )
  }
  return  (
    <>
      <div className={marqueeStyles}>
        <p>
          Hi, this is a recreation of a DVD menu using the source menu file from the DVD. {' '}
          Most custom configuration is handled via JSON so the code could be used to make others. {' '}<br />
          Apologies for the video quality, I'm not very good at converting dvd menus to mp4.
        </p>
        <p>
          I'm probably going to write something about DVD menus around this project at some point. If you've like me to cover something please contact me.
        </p>

        <p><strong>ISSUES: </strong>Most issues should be resolvable by a refresh. iOS proved especially difficult so I'm self hosting super low-res videos especially for it. </p>
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
      <InfoButton onClick={toggleOverlay}>X</InfoButton>
    </>
  );
};

export default Info;
