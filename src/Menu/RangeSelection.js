import React from 'react';
import { generateLink, processOption } from './utils';
import Entry from './MenuEntry';

const RangeSelection = ({ count, perPage, styles, defaultLinkStyle = [{}], title }) => {
  const iterations = Math.ceil(count/perPage);
  let i = 0;
  const links = [];
  console.log(title);
  while (i < iterations) {
    const link = `/${title}/scenes/${i}`;
    const [style, domAttrs] = processOption({
      ...styles[i % iterations],
      link,
      onClick: generateLink(link),
    })
    console.log({
      ...defaultLinkStyle[style.defaultStyleOption || 0],
      style
    });
    links.push(
      <li>
        <Entry
          {...domAttrs}
          link={link}
          style={{
            ...defaultLinkStyle[styles[i % iterations].defaultStyleOption || 0],
            ...style
          }}
          key={link}
        />
      </li>
    );
    i++;
  }
  return (
    <ol>
      { links }
    </ol>
  );
}

export default RangeSelection;
