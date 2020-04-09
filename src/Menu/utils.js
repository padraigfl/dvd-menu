import { navigate } from '@reach/router';

const dataKeys = {
  y: 'top',
  x: 'left',
  h: 'height',
  w: 'width',
}

export const processOption = (option) => {
  const styles = {
    ...(option.style || {}),
    transform: option.x || option.y
      ? `${(option.style && option.style.transform) || ''} translate(${option.x || 0}px, ${option.y || 0}px)`
      : 'none',
    width: (option.w || 0) + 'px',
    height: (option.h || 0) + 'px',
  };

  const domAttrs = Object.entries(option)
    .reduce((acc, [key, value]) => {
      if (dataKeys[key] || key === 'style' || key === 'toggle') {
        return acc;
      }
      return {
        ...acc,
        [key]: value,
      };
    }, {});

  return [ styles, domAttrs ];
}

export const generateLink = (link, onClick) => link || onClick 
  ? (e => {
    e.preventDefault();
    if (!onClick && link) {
      navigate(link);
    }
    if (onClick) {
      onClick(e);
    }
  }) : undefined;
