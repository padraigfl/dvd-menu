import React, { useCallback, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { navigate } from '@reach/router';
import { styled } from 'linaria/react';

const Remote = styled('div')`
  z-index: 100;
  position: absolute;
  bottom: 0px;
  left: 50%;
  border-radius: 10%;
  transform: translateX(-50%);
  background-color: #111;
  height: 450px;
  max-height: 72vh;
  width: 250px;
  max-wdith: 40vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 20px;
  padding-top: 30px;
  padding-bottom: 30px;
  transform: perspective(500px) rotate3d(10, 0, -1.5, 40deg) translate3d(-80px, 0px, 0px) scale3d(1, 1, -0.2);
  box-shadow: 1px 20px 0px 1px black, 2px 23px 3px #aaa, inset 0px 0px 3px 0px #aaa,inset 0px 0px 0px 2px #111;
  > button {
    &:nth-child(3n - 1):not(:last-child) {
      margin-top: 0;
      margin-bottom: 22px;
    }
  }
`;

const subThing = () => {
  alert(
    `Subtitles: ${window.localStorage.getItem('subtitles') || 'default'}`
  )
};
const auxThing = () => {
  alert(
    `Audio Track: ${window.localStorage.getItem('audio') || 'default'}`
  )
};

const RemoteButton = styled('button')`
  width: 25%;
  height: 35px;
  border-radius: 35%;
  margin: 11px 10px;
  translate: translate3d(0, 0, 5px);
  text-align: center;
  background-color: ${props => props.color || 'white'};
  border: 1px solid grey;
  box-shadow: ${props => `0 2px 0px 1px ${props.color || 'white'}, 0px 3px 0px 1px black`};
  &:active {
    transform: perspective(500px) translate3d(0, 2px, 3px);
    box-shadow: 0px 1px 0px #ccc;
  }
`;

const Controls = (props) => {
  const buttons = useMemo(() => (
    [
      { icon: 'TV/DVD', onClick: navigate('/static') },
      { icon: 'Power', onClick: navigate('/'), color: 'red' },
      { icon: 'Eject', onClick: navigate('/') },
    
      ...new Array(9).fill(null).map((_, idx) => ({ icon: idx + 1 })),
    
      { icon: 'subs', onClick: subThing },
      { icon: '0' },
      { icon: 'aux', onClick: auxThing },
    
      { icon: 'rew' },
      { icon: 'play' },
      { icon: 'ff' },

      { icon: '-', onClick: () => props.mute(true), disabled: props.muted },
      { icon: 'OK' },
      { icon: '+', onClick: () => props.mute(false), disabled: !props.muted },
      { icon: 'Hide', onClick: props.hide },
      { icon: 'Menu', onClick: navigate(`/${props.title || 'shrek'}/root`) },
    ]
  ), [props.mute, props.muted]);
  
  return ReactDOM.createPortal(
    <Remote>
      { buttons.map(button => (
        <RemoteButton
          onClick={ button.onClick || props.dummyAction}
          disabled={ button.disabled }
          color={button.color}
        >
          {button.icon}
        </RemoteButton>
      ))}
    </Remote>,
    document.getElementById('settings'),
  );
}

export default Controls;
