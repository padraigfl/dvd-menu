import React from 'react';
import Helmet from 'react-helmet';
import { Link } from '@reach/router';
import { InfoWrapper } from './Info';
import ScreenSaver from './Menu/ScreenSaver';
import { styled } from 'linaria/react';

const title = "I made a recreation of the Shrek DVD Menu in React";
const description = "...and, er, did I learn anything from it?";

const ImageWrapper = styled.div`
  text-align: center;
  margin: 8px 0px;
  img {
    max-width: ${({ multiImage }) => multiImage ? 90 / multiImage : 100}%;
    width: 100%;
    display: ${({ multiImage }) => multiImage > 1 ? 'inline-block' : 'block'};
    margin: 0 auto 4px;
    filter: none;
    height: initial;
    min-width: 250px;
  }
  em {
    display: block;
  }
  backdrop-filter: drop-shadow(0px 0px 3px blue);
`;

const ImageWithCaption = ({ src, caption, alt='' }) => {
  const images = Array.isArray(src) ? src : [src];
  return (
    <ImageWrapper multiImage={Array.isArray(src) ? src.length : 1}>
      { images.map((img, idx) => (
        <a href={`/static/why/${img}`} target="_blank">
          <img src={`/static/why/${img}`} alt={alt[idx] || alt} />
        </a>
      ))}
      {caption && <em>{caption}</em>}
    </ImageWrapper>
  );
}

const Why = () => (
  <InfoWrapper>
    <Link to="/">Home</Link> <Link to="/info">About</Link>
    <Helmet
      title={title}
      description={description}
    />
    <h1>{title}</h1>
    <h2>But why??</h2>
    <p>
      A few months ago I abruptly got super interested in director commentary tracks as work accompaniment audio (the first few Simpsons ones are fantastic, the Criterion ones with academics are 👌) and was on a big DVD nostalgia kick trying to get my hands on some neat sounding ones that were hard to find.
    </p>
    <p>
      Around the same time I had been messing about with videojs for <a href="https://react-coursebuilder.netlify.app" target="_blank">another side project</a>. So one day I was like...
      <blockquote>
        <p>...I wonder how DVD menus work?[<a href="#how">*</a>]</p>
        <p>...were they just loads of videos?[<a href="#how-video">*</a>]</p>
        <p>...and how were the buttons styled?[<a href="#how-buttons">*</a>]</p>
        <p>...or how were transitions handled?[<a href="#how-flow">*</a>]</p>
        <p>...but also, how did those ones with multiple tiny videos playing in a menu work?  What about the static menus with audio in the background?[<a href="#how-media-variants">*</a></p>
        <p>And what was the deal with those specific versions of the main menu with an intro that would only play once?[<a href="#how-intro">*</a>]</p>
      </blockquote>
    </p>
    <p>The way I saw it, I had two options to answer all these questions:</p>
    <ol>
      <li>Read an article on how DVDs work</li>
      <li>Figure it out myself, give myself some sort of excuse to rip a DVD and start poking around its insides</li>
    </ol>
    <p>So yeah... I went with #2.</p>

    <h2>Objectives</h2>
    <ul>
      <li>make an SPA from a very well known film from the peak of the DVD era</li>
      <li>Host the videos on youtube if at all possible so it could <em>potentially</em> be easily adapted by other people without much need to mess with the JavaScript</li>
      <li>Most if not all data within the app for a DVD to be contained within one json file (e.g. <a href="https://github.com/padraigfl/dvd-menu/blob/master/src/shrek.json" target="_blank">Shrek's here</a>)</li>
      <li>Routing, valid urls, the ability to go back and forward, have transitions between pages but not when going back</li>
    </ul>

    <p>With the "well known" requirement I decided to go with the Matrix (features packed but came out before DVDs really took off) and Shrek (pretty much around the peak of elaborate menus)</p>

    <ImageWithCaption src="cex.jpg" caption="Had to buy the DVDs..." />

    <h2 id="how">"I wonder how DVD menus work"</h2>

    <h3 id="how-video">"Were they just loads of videos"</h3>
    <p>Not exactly? If you've ever dealt with the files of a DVD there's a VIDEO_TS folder with a whole load fo files following a format of VTS_[<em>x</em>]_<em>y</em>.(VOB|BUP|IFO). The value of <em>x</em> seems to be the same for all files relating to the menus and the main film file, with other x values typically relating to other bonus features, opening splash screens, trailers, etc.</p>

    <ImageWithCaption
      src={["matrixFinder.png", "shrekFinder.png"]}
      caption="file structures for The Matrix and Shrek with the menu files highlighted"
    />

    <p>Now, I know nothing about .VOB, all I know is ffmpeg occasionally cut the files when I converted to MP4 at points that suggest its a container with multiple individual video files within it.</p>

    <h3 id="how-buttons">"How were the buttons styled?"</h3>
    <p>Inactive buttons are hardcoded into the video.</p>
    <p>As for active ones... *sigh* This was hard, I was able to get some info from the .BUP and .IFO files via a tool called <a href="http://download.videohelp.com/r0lZ/pgcedit/" target="_blank">PGCEdit</a> that was strongly recommended on various threads from 2003. Unfortuantely it's a Windows tool and I'm working on a Mac, and it hasn't been maintained since about 2010 and I'm in 2020. Some users seemed to be able to apply modifications to button shapes and whatnot but I wasn't able to find that at all.</p>
    <p>As seen in the pictures below, the coordinates and layouts of buttons on menus are quite simply specified, so I decided I may as well just do this manually with x, y, w and h coordinates. As most DVDs seemed to use a limited range of styles for highlighting active buttons (not Shrek though...), I just ripped them via screenshots (<a href="/static/why/shrekButtonHighlight.png" target="_blank">example of highlighted field</a>)</p>

    <ImageWithCaption src="shrekScenes.png" caption="Shrek scene selection screen" />
    <ImageWithCaption src="pgcEditShrekScenes.png" caption="PGCEdit represenation of scene selection screen's data" />

    <p>If you wanna investigate further into what PGCEdit is at, <a href="/static/why/pgcLonger.png" target="_blank">here</a>'s a more advanced screenshot delving into one button.</p>

    <h3 id="how-flow">"How were transitions handled?"</h3>
    <p>What I was able to find from PGCEdit was how the DVDs sequenced stuff, and it's altogether pretty damn simple</p>
    <p>Basically the Menu is split up into loads of parts, each one can contain</p>
    <ul>
      <li>Start point</li>
      <li>End point</li>
      <li>Action on end (e.g. redirect)</li>
      <li>(optional) Buttons, which have their own definitions for actions (redirect, update subtitles/audio) </li>
    </ul>
    <p>With this in mind I mapped out each screen to have a start and end point wired through to the video on page load and the ability to also accept toggle values that (I guess) could be relayed into the video too</p>
    <p>Many DVDs have two versions of the root menu, one which only loaded the first time and another which occurs everywhere you access the shot from. It seems largely to be about handling whatever cute initial transition clip they play on inserting the DVD. </p>

    <h3 id="how-media-variants">"How did those ones with multiple tiny videos playing in a menu work? What about the static menus with audio in the background? </h3>
    <p>They were all video files, if a film has silent menus it suggests they were so short on space that the menu is taking up as little space as it possible can (the Matrix relies on this heavily due to it being stuffed with video features), if a film has audio in a menu thats static that probably suggests that there's very little in the way of extra content on the disc cos they clearly aren't arsed about it</p>

    <h3 id="how-intro">"what was the deal with those specific versions of the main menu with an intro that would only play once?"</h3>
    <p>Both Shrek and the Matrix's menu video files (links <a href="https://youtu.be/V3airyA0Kig" target="_blank">here</a> and <a href="https://youtu.be/ix0tlRLbTVw" target="_blank">here</a> have an initial transition, then a ~30 second video clip, which then is followed up by another one for the exact same menu). These are just loading different sections of the video on intitial play and providing no means to access that one again within the menus.</p>

    <h2>{description}</h2>
    <p>Hmm...</p>
    <p>@reach/router has been deprecated? @reach/router is very hard to google for?</p>
    <p>Weird limitations like "it must be able to use videos from youtube" are a total waste of time in terms of learning unless there's a very practical reason for why.</p>
    <p>It's not a good idea to make assumptions that require convoluted abstractions on the basis of an extremely small sample size (I assumed scene selection followed a very consistent format across pages due to how Shrek reused pieces, the Matrix did not do this so it's broken</p>
    <p>iOS and autoplaying video is painful: I totally bailed on youtube for iOS devices and self hosted at super low res, </p>
    <p>Oh, and it's quite easy to see how so many DVDs wound up coming out on two discs when you consider just how much fancy menus eat into the disc space but also became necessary for any film that didn't want to give off vibes of being cheap as all hell</p>
    <p>Dumb bonus touches are the best part, so when doing a goofy project like this it's best to stick to a basic MVP and avoid headaches in the name of "extensibility", instead adding nonsense like the screensaver and remote control afterwards</p>
    <ScreenSaver timer={60000}/>
  </InfoWrapper>
);

export default Why;
