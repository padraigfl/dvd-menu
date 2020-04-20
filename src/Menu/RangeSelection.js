import React from 'react';
import { generateLink, processOption } from './utils';
import Entry from './MenuEntry';

const RangeSelection = ({ count, perPage, styles, defaultLinkStyle = [{}],  }) => {
  console.log(count);
  console.log(styles)
  const iterations = Math.ceil(count/perPage);
  let i = 0;
  const links = [];
  while (i < iterations) {
    const link = `/scenes/${i}`;
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
          href={link}
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
