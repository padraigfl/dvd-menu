import React, { useRef, useCallback, useMemo } from 'react';
import { cx, css } from 'linaria';
import { styled } from 'linaria/react';
import { generateLink } from './utils';

const generalStyles = (type) => styled[type]``;

// @todo figure out how to apply tag dynamically
const EntryLink = styled('a')`
  filter: grayscale(0);
  display: inline-block;
  opacity: 0.01;
  &:active, &:focus, &:hover {
    opacity: 0.8;
    filter: ${props => (
      props.activeStyle && props.activeStyle.filter
        ? props.activeStyle.filter
        : (props.styles && props.style.filter) || 'none'
    )};
  }
`;

const EntryDiv = styled('div')`
  filter: grayscale(0);
  display: inline-block;
  opacity: 0.01;
  &:active, &:focus, &:hover {
    opacity: 0.8;
    filter: ${props => (
      props.activeStyle && props.activeStyle.filter
        ? props.activeStyle.filter
        : (props.styles && props.style.filter) || 'none'
    )};
  }
`;

export const Entry = props => {
  const Comp = props.link ? EntryLink : EntryDiv;
  const ref = useRef();
  const { link, onClick, className, hidden, children, ...restProps } = props;

  const onMouseEnter = useCallback(() => {
    ref.current.focus();
    if (props.hidden) {
      ref.current.blur();
    }
  }, [props.hidden]);

  
  return (
    <Comp
      {...restProps}
      onMouseEnter={window.innerWidth > 800 ? onMouseEnter : undefined}
      ref={ref}
      href={link}
      onClick={generateLink(link, props.onClick)}
      className={cx('menuEntry', props.className)}
      title={children}
    />
  );
}

export default Entry;
