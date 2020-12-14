import React, { useCallback, useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { navigate } from '@reach/router';
import { styled } from 'linaria/react';
import { cx, css } from 'linaria';

const Remote = styled('div')`
  pointer-events: all;
  z-index: 100;
  bottom: 0px;
  left: 50%;
  border-top-left-radius: 40px;
  border-top-right-radius: 40px;
  border-bottom-left-radius: 30%;
  border-bottom-right-radius: 30%;
  background-color: #111;
  width: 250px;
  max-width: 60vh;
  max-height: 100vh;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding: 20px;
  padding-top: 50px;
  padding-bottom: 150px;
  transform-origin: bottom center;
  transform: translateY(50%) scale(0.75);
  filter: opacity(50%);
  transition: transform ease-in 1s, filter linear 1s;
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
    transform: translateY(0%) scale(0.75);
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
  img {
    max-width: 25px;
    max-height: 25px;
    filter: brightness(0);
  }
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
      { text: 'TV/DVD', onClick: props.toggleTv },
      { text: 'Power', href: '/', color: 'red', icon: 'icons/power.png' },
      { text: '\u23cf', href: '/' },
    
      ...new Array(9).fill(null).map((_, idx) => ({ text: idx + 1 })),
    
      { text: 'subs', onClick: props.showSubs },
      { text: '0' },
      { text: 'aux', onClick: props.showAudio },
    
      { text: '<<' || '\u23ea', icon: 'icons/rw.png' },
      { text: '▶' },
      { text: '>>' || '\u23e9', icon: 'icons/ff.png' },

      { text: 'vol-', onClick: () => props.mute(true),  icon: '/icons/mute.png' },
      { text: 'Menu', href: `/${ (props.title || 'shrek') }/root` },
      { text: 'vol+', onClick: () => props.mute(false), icon: 'icons/unmute.png' },

      { text: 'Hide', onClick: () => setActive(false) },
      { text: 'HD', disabled: !props.toggleHD, onClick: props.toggleHD },
      { text: 'Info', href: '/info' },
    ]
  ), [
    props.mute,
    props.muted,
    props.title,
    props.toggleTv,
    props.toggleHD,
  ]);
  
  return ReactDOM.createPortal(
    <Remote
      onClick={!active && props.initialized ? () => setActive(true) : undefined}
      role={!active && props.initialized ? 'button' : undefined}
      className={active ? 'remote--active' : undefined}
      initialized={props.initialized}
    >
      { buttons.map(button => (
        <RemoteButton
          href={button.href}
          key={button.icon}
          onClick={
            (!active || !props.initialized)
            ? undefined
            : button.href
              ? locationChange
              : button.onClick
                ? button.onClick
                : props.defaultClick
          }
          disabled={ !active || button.disabled }
          color={button.color || (!button.onClick && !button.href ? 'rgba(255, 255, 255, 0.5)' : undefined)}
          className={button.icon}
        >
          {button.icon ? <img src={`/static/${button.icon}`} alt={button.text} /> : button.text}
        </RemoteButton>
      ))}
    </Remote>,
    document.getElementById('settings'),
  );
}

export default Controls;
