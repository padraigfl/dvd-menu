import React, { useCallback, useMemo, useState } from 'react';
import { navigate } from '@reach/router';
import { styled } from 'linaria/react';

const boxWidth = 150;
const boxBorder = 3;
const discWidth = boxWidth - boxBorder - 24;
const transitionTime = 2000;
const Box = styled('a')`
  position: absolute;
  top: 50%;
  left: 50%;
  height: 100%;
  width:  ${({ oldbox }) => oldbox ? `calc(100% - ${boxBorder*3}px)` : '100%'};
  border: ${boxBorder}px solid black;
  border-left: 1px solid black;
  border-right: ${ ({ oldbox }) => oldbox ?  `${boxBorder * 3}px solid black` :  `${boxBorder}px solid black`};
  border-radius: 2px;
  background-image: ${props => `url(${props.backgroundImage})`};
  background-size: cover;
  box-shadow: 0px 0px 20px white;
  z-index: 5;
  transform: ${({ transitionState }) => 
    transitionState
      ?  `translate3d(-70%, 0%, 0) rotate(-45deg)`
      : `translate3d(-50%, -50%, 0) rotate(0deg)`
  };
  transform-origin: bottom left;
  transition: all linear ${transitionTime}ms;

  &:after {
    position: absolute;
    right: -${boxBorder * 2.5}px;
    top: 50%;
    transform: translateY(-50%);
    height: ${boxWidth/3}px;
    width: 20px;
    background-color: black;
    content: '';
    border-top-left-radius: 200%;
    border-bottom-left-radius: 200%;
    display: ${({ oldbox }) => oldbox ? 'block' : 'none'};
  }
`;

const Disc = styled('div')`
  position: absolute;
  width: ${discWidth}px;
  height: ${discWidth}px;
  max-width: 48vw;
  max-height: 48vw;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  background-image: radial-gradient(transparent 0%, transparent 10%, #999 10%, #999 11%, #aaa 11%, #aaa 20%, transparent 22%, #aaa 22%, #ddd 70%, #aaa 100%);
  border: 1px solid #999;
  content: '';
  transform: translate3d(-50%, -50%, 0) rotate3d(0, 0, 0, 0deg) scale(1);
  animation: ${({ transitionState }) => transitionState === 'open' ? '4s insertDisc 2s' : 'none' };
  display: ${ ({ transitionState }) => transitionState ? 'block' : 'none' };
`;

const BoxContainer = styled('div')`
  margin: 40px auto;
  position: relative;
  height: ${boxWidth*1.4}px;
  width: ${boxWidth}px;
  &:after {
    position: absolute;
    top: 100%;
    width: 100%;
    text-align: center;
    content: attr(data-name);
    padding-top: 5px;
    z-index: 0;
  }
`

const MainWrapper = styled('div')`
  width: 100%;
  max-width: 600px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: auto;
  margin-top: 50vh;
  transform: translateY(-50%);
`;

const FilmOption = (props) => {
  const [transitionState, updateTransitionState] = useState(null);

  const clickAction = useCallback((e) => {
    const link = e.currentTarget.getAttribute('href');
    e.preventDefault();
    updateTransitionState('open');
    setTimeout(() => {
      navigate(link);
    }, transitionTime*3);
  }, []);

  return (
    <BoxContainer
      data-name={props.title}
    >
      <Disc transitionState={transitionState} />
      <Box
        transitionState={transitionState} 
        href={`/${props.title}`}
        backgroundImage={props.poster}
        oldbox={props.title.includes('matrix')}
        onClick={clickAction}
      />
    </BoxContainer>
  );
};

const MainMenu = (props) => {
  return (
    <MainWrapper>
      {props.discs.map(disc => (
        <FilmOption key={disc.title} {...disc} />
      ))}
    </MainWrapper>
  )
}

export default MainMenu;