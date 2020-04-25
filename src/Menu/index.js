import React, {
  useState,
  useEffect,
  useCallback,
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

  const setActive = useCallback(() => props.setActive(true), []);

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
      props.startPageChange();
      props.setActive(false);
    }
  }, []);

  return props.active && (
    <MenuWrapper className={cx('defaultComponent', props.pageName)}>
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
                        <Entry {...toggleDomAttrs} style={toggleStyles}>
                            {toggleValue}
                        </Entry>
                      </label>
                    </li>
                  );
                })
              );
            }

            return (
              <li key={option.link}>
                <Entry
                  {...domAttrs}
                  hidden={option.hidden}
                  style={styles}
                  href={option.link}
                  onClick={
                    generateLink(
                      option.link,
                      option.onClick,
                    )
                  }
                />
              </li>
            );
          })}
        </ul>
      }
      { props.active && props.pageName.match(/^\/?scenes\/.*/) && props.scenesData && props.scenesData.scenes.length > props.scenesData.split && (
        <RangeSelection
          perPage={props.scenesData.split}
          count={props.scenesData.scenes.length}
          index={props.index}
          styles={props.scenesData.navigation}
        />
      )}
      { /* back and hidden */}
      <Helmet title={`Menu -- ${props.pageName}`} />
      <ScreenSaver />
    </MenuWrapper>
  )
};

export default DefaultComponent;
