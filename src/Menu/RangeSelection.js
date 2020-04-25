import React from 'react';
import { generateLink, processOption } from './utils';
import Entry from './MenuEntry';

const RangeSelection = ({ count, perPage, styles }) => {
  const iterations = Math.ceil(count/perPage);
  let i = 0;
  const links = [];
  while (i < iterations) {
    const link = `/scenes/${i}`;
    console.log(styles);
    const [style, domAttrs] = processOption({
      ...styles[i % iterations],
      link,
      onClick: generateLink(link),
    })
    links.push(
      <li>
        <Entry
          {...domAttrs}
          href={link}
          style={style}
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
