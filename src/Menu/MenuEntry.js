import React from 'react';
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

  &:active, &:focus, &:hover {
    opacity: 0.5;
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
  return (
    <Comp
      {...props}
      href={props.link}
      onClick={generateLink(props.link, props.onClick)}
      className={cx(props.className, entryStyles)}
    />
  );
}

export default Entry;
