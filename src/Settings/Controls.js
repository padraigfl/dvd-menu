import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { navigate } from '@reach/router';
import { styled } from 'linaria/react';
import { cx, css } from 'linaria';

const Remote = styled('div')`
  z-index: 100;
  position: absolute;
  bottom: 0px;
  left: 50%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-bottom-left-radius: 30%;
  border-bottom-right-radius: 30%;
  transform: translateX(-50%);
  background-color: #111;
  width: 250px;
  max-wdith: 20vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 20px;
  padding-top: 50px;
  padding-bottom: 50px;
  transform: perspective(1000px) translate3d(0px, 50%, 0px);
  transition: transform ease-in 2s;
  filter: opacity(0.6) grayscale(0.5);
  box-shadow: 1px 24px 0px -5px #111, 2px 20px 20px #aaa, inset 0px 0px 3px 0px #aaa, inset 0px 0px 0px 2px #111;

  > button, a {
    pointer-events: none;
    &:nth-child(3n - 1):not(:last-child) {
      margin-top: 0;
      margin-bottom: 22px;
    }
  }

  &.remote--active {
    height: 480px;
    transform:  perspective(500px) rotate3d(1,0,-0.3,40deg) translate3d(-80px,-20%,-100px) scale3d(1,1,1);
    filter: none;
    > button, > a {
      pointer-events: initial;
      cursor: pointer;
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

const remoteButtonStyles = css`
  display: inline-flex;
  width: 27%;
  height: 35px;
  border-radius: 35%;
  margin: 11px 5px;
  translate: translate3d(0, 0, 5px);
  text-align: center;
  text-transform: uppercase;
  border: 1px solid grey;
  font-weight: bold;
  font-size: 16px;
  padding: 0px;
  align-content: center;
  text-align: center;
  align-items: center;
  justify-content: space-around;
  color: black;
  text-decoration: none;
  box-shadow: 0 4px 0px 0px white, 0px 5px 0px 1px black;
  &.Power {
    height: 50px;
    border-radius: 50%;
  }
  &:active {
    transform: perspective(500px) translate3d(0, 2px, 3px);
    box-shadow: 0px 2px 0px #ccc;
  }
  &[disabled] {
    filter: greyscale(0.5) opacity(0.2);
  }
`;

const remoteButtonColorStyles = (color = 'white') => ({
  backgroundColor: color,
});

const RemoteButton = (props) => {
  const Comp = props.href ? 'a' : 'button';
  return (
    <Comp
      {...props}
      className={cx(remoteButtonStyles, props.className)}
      style={remoteButtonColorStyles(props.color)}
    />
  )
}

const Controls = (props) => {
  const [active, setActive] = useState(false);
  const locationChange = useCallback((e) => {
    e.preventDefault();
    const newLocation = e.currentTarget.getAttribute('href');
    if (newLocation) {
      navigate(newLocation);
    }
  }, []);
  const buttons = useMemo(() => (
    [
      { icon: 'TV/DVD', onClick: props.toggleTv },
      { icon: 'Power', href: '/', color: 'red' },
      { icon: 'Eject', href: '/' },
    
      ...new Array(9).fill(null).map((_, idx) => ({ icon: idx + 1 })),
    
      { icon: 'subs', onClick: subThing },
      { icon: '0' },
      { icon: 'aux', onClick: auxThing },
    
      { icon: 'rew' },
      { icon: 'play' },
      { icon: 'ff' },

      { icon: '-', onClick: () => props.mute(true) },
      { icon: 'Menu', href: `/${ (props.title || 'shrek') }/root` },
      { icon: '+', onClick: () => props.mute(false) },

      { icon: 'Hide', onClick: () => setActive(false) },
      { icon: 'HELP', href: '/help' },
    ]
  ), [
    props.mute,
    props.muted,
    props.title,
    props.toggleTv,
  ]);
  
  return ReactDOM.createPortal(
    <Remote
      onClick={!active ? () => setActive(true) : undefined}
      role={!active ? 'button' : undefined}
      className={active ? 'remote--active' : undefined}
    >
      { buttons.map(button => (
        <RemoteButton
          href={button.href}
          key={button.icon}
          onClick={
            !active 
            ? undefined
            : button.href
              ? locationChange
              : button.onClick
                ? button.onClick
                : props.defaultClick
          }
          disabled={ !active || button.disabled }
          color={button.color}
          className={button.icon}
        >
          {button.icon}
        </RemoteButton>
      ))}
    </Remote>,
    document.getElementById('settings'),
  );
}

export default Controls;
