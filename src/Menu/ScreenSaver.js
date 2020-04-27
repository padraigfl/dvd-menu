import { styled } from 'linaria/react';
import React, { useState, useEffect, useCallback, useRef } from 'react';

const loopTime = 20;
const increment = 4;

const ScreenSaverBody = styled.div`
  position: absolute;
  max-width: 100%;
  max-height: 100%;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: black;
  img {
    width: 240px;
  }
`;

const formatTranslate = ({ x, y }) => `translate(${x}px, ${y}px)`

const ScreenSaverView = () => {
  const wrapperEl = useRef(null);
  const logoEl = useRef(null);
  const coordiantes = useRef({ x: Math.ceil(Math.random() * 600), y: Math.ceil(Math.random() * 480) });
  const xDir = useRef(increment);
  const yDir = useRef(increment);
  const start = useRef(null);

  const updateDirection = useCallback(() => {
    const logo = logoEl.current.getBoundingClientRect();
    const wrapper = wrapperEl.current.getBoundingClientRect();
    if (xDir.current < 0 && logo.x < wrapper.x) {
      xDir.current = increment;
    } else if (xDir.current > 0 && (logo.right > wrapper.right)) {
      xDir.current = -increment;
    }
    if (yDir.current < 0 && logo.y < wrapper.y) {
      yDir.current = increment;
    } else if (yDir.current > 0 && (logo.bottom > wrapper.bottom)) {
      yDir.current = -increment
    }
  }, []);

  const updatePosition = useCallback((timestamp) => {
    if (start.current < 0) {
      return;
    }
    if (!start.current) {
      start.current = timestamp;
    }
    const progress = timestamp - start.current;

    if (progress > loopTime) {
      updateDirection();
      coordiantes.current = {
        x: coordiantes.current.x + xDir.current,
        y: coordiantes.current.y + yDir.current,
      }
      logoEl.current.style = `transform: ${formatTranslate(coordiantes.current)};`;
      start.current = timestamp;
    }
    requestAnimationFrame(updatePosition);
  }, [])

  useEffect(() => {
    requestAnimationFrame(updatePosition);
  }, []);

  return (
    <ScreenSaverBody ref={wrapperEl}>
      <img src="/static/dvd-logo.png" ref={logoEl} style={ { transform: formatTranslate(coordiantes.current) }}/>
    </ScreenSaverBody>
  )
}

const addEvent = (listener, action) => {
  listener.current = action;
  document.body.addEventListener('mousemove', action);
  document.body.addEventListener('touchstart', action);
};

const removeEvent = (listener) => {
  document.body.removeEventListener('mousemove', listener.current);
  document.body.removeEventListener('touchstart', listener.current);
}

const ScreenSaver = () => {
  const [screenSaver, setScreenSaver] = useState(false);
  const timer = useRef(null);
  const listener = useRef(null);

  useEffect(() => {
    const clear = () => { removeEvent(listener); }
    if (listener.current) {
      clear();
    }
    addEvent(listener, screenSaverEvent)
    return clear;
  }, [screenSaver]);
  // useEffect(() => {
  //   addEvent(listener, screenSaverEvent);
  //   return () => { remove}
  // }, []);

  const screenSaverEvent = useCallback(() => {
    clearTimeout(timer.current);
    if (screenSaver) {
      setScreenSaver(false);
    } else {
      timer.current = setTimeout(() => {
        setScreenSaver(true);
      }, 12000);
    }
  }, [screenSaver]);

  return screenSaver && <ScreenSaverView />
}

export default ScreenSaver;