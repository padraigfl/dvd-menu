import React, { useRef, useCallback } from 'react';
import { cx } from 'linaria';
import { styled } from 'linaria/react';
import { generateLink } from './utils';

// @todo figure out how to apply tag dynamically
const EntryLink = styled.a`
  filter: grayscale(0);
  &:active, &:focus, &:hover {
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
      href={props.link}
      onClick={generateLink(props.link, props.onClick)}
      className={cx('menuEntry', props.className)}
      title={children}
    />
  );
}

export default Entry;
