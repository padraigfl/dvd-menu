import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { cx } from 'linaria';
import { styled } from 'linaria/react';
import { processOption, generateLink } from './utils';
import Entry from './MenuEntry';
import RangeSelection from './RangeSelection';
import Helmet from 'react-helmet';
import ScreenSaver from './ScreenSaver';

const MenuWrapper = styled.div`
  height:480px;

  >ul, >ol {
    list-style: none;
    margin: 0px;
    padding: 0px;

    >li {
      width: 0px;
      height: 0px;
    }
  }
`;
const Message = styled('div')`
  &:after {
    font-size: 16px;
    max-width: calc(100vw - 150px);
    transform: ${({ scaling = 1 }) => `translate(-50%, -${scaling < 1 ? (100 / scaling) : 100}%) scale(${1 / scaling})`};
    position: absolute;
    left: 50%;
    text-align: center;
    content: 'Click on items in the menu on screen to navigate';
  }
`;


const storeRadioValue = (key, value) => window.localStorage.setItem(key, value);;

const getRadioValue = (key) => window.localStorage.getItem(key);

const getInitialValues = (options = []) => {
  const radioValues = {};
  if (options.every(option => !option.toggle)) {
    return radioValues;
  }
  options.forEach((option) => {
    if (option.toggle) {
      radioValues[option.key] = getRadioValue(option.key);
    }
  });
  return radioValues;
}

const DefaultComponent = (props) =>  {
  const queryStringObj = window.location.search
    .split('&')
    .map(v => v.split('='))
    .reduce((acc, [key, val]) => (
      {...acc, [key]: val || true }
    ), {});

  const [radioValues, setRadioState] = useState(getInitialValues(props.options));
  const updateRadioValues = React.useCallback((key, value) => {
    setRadioState({
      ...radioValues,
      [key]: value,
    });
    storeRadioValue(key, value);
  }, [setRadioState, radioValues, storeRadioValue]);

  const setActive = useCallback(() => {
    props.setActive(true)
  }, []);

  useEffect(() => {
    props.onLoad({
      media: props.media,
      redirect: props.redirect,
      start: props.start || +queryStringObj.start,
      end: props.start + props.length,
      loadAction: setActive,
      controls: props.controls,
    });
    return () => {
      props.setActive(false);
    }
  }, []);

  return props.active && (
    <MenuWrapper className={cx('defaultComponent', props.pageName)}>
      <Message scaling={props.scale} />
      { Array.isArray(props.options) && props.options.length > 0  &&
        <ul>
          { props.options.map((option) => {
            const [ styles, domAttrs ] = processOption(option);
            if (option.toggle) {
              return (
                option.toggle.map(({ value: toggleValue, ...entryProps }) => {
                  const [ toggleStyles, toggleDomAttrs ] = processOption({ ...domAttrs, ...entryProps });
                  return (
                    <li key={toggleValue}>
                      <input type="radio" value={toggleValue} id={toggleValue} checked={toggleValue === radioValues[option.key]} onChange={() => updateRadioValues(option.key, toggleValue)} />
                      <label htmlFor={toggleValue}>
                        <Entry
                          {...toggleDomAttrs}
                          style={{
                            ...props.defaultLinkStyle[entryProps.defaultStyleOption || 0],
                            ...toggleStyles,
                          }}
                        >
                            {toggleValue}
                        </Entry>
                      </label>
                    </li>
                  );
                })
              );
            }

            return (
              <li key={option.link || option.x + option.y}>
                <Entry
                  {...domAttrs}
                  style={{
                    ...props.defaultLinkStyle[option.defaultStyleOption || 0],
                    ...styles,
                  }}
                  href={option.link}
                />
              </li>
            );
          })}
        </ul>
      }
      { props.active && props.pageName.match(/^\/scenes\/.*/) && props.scenesData && props.scenesData.scenes.length > props.scenesData.perPage && (
        <RangeSelection
          perPage={props.scenesData.perPage}
          count={props.scenesData.scenes.length}
          index={props.index}
          styles={props.scenesData.navigation}
          defaultLinkStyle={props.defaultLinkStyle}
          title={props.title}
        />
      )}
      { /* back and hidden */}
      <Helmet title={`DVD: ${props.title} -- ${props.pageName}`} />
      <ScreenSaver />
    </MenuWrapper>
  )
};

export default DefaultComponent;
