import React, { useRef, useCallback } from 'react';
import { css, cx } from 'linaria';
import { styled } from 'linaria/react';
import { generateLink } from './utils';


const entryStyles = css`
  $test: &; 
  background-position: bottom center;
  color: transparent;
  display: inline-block;
  opacity: 0;
  background-image: url(/static/highlights/underline-fat.png);
  filter: grayscale(1);

  /* for underlines */
  background-size: auto 10px;
  background-repeat: repeat-x;
  background-repeat-y: no-repeat;
  background-repeat-x: repeat;

  &:focus, &:hover {
    opacity: 0.8;
    outline: none;
  }
`;

// @todo figure out how to apply tag dynamically
const EntryLink = styled.a`
  filter: grayscale(0);
  &:active, &:focus, &:hover {
    opactiy: 1;
    filter: ${props => (
      props.activeStyle && props.activeStyle.filter
        ? props.activeStyle.filter
        : (props.styles && props.style.filter) || 'none'
    )};
  }
`;

export const Entry = props => {
  const Comp = props.link ? EntryLink : 'div';
  const ref = useRef();
  const { link, onClick, className, hidden, ...restProps } = props;

  const onMouseEnter = useCallback(() => {
    ref.current.focus();
    if (props.hidden) {
      ref.current.blur();
    }
  }, [props.hidden]);

  return (
    <Comp
      {...restProps}
      onMouseEnter={onMouseEnter}
      ref={ref}
      href={props.link}
      onClick={generateLink(props.link, props.onClick)}
      className={cx(props.className, entryStyles)}
    />
  );
}

export default Entry;
