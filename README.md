# DVD Menu Replica Thing

No, I don't know why I made this...

Previewable at https://dvd-rom.netlify.com

## Brief summary of DVD Menus
So DVD menus basically worked as follows:

- There was a video file on the DVD with all the menu bits and bobs in it (sometimes some short bonus features too), seems to always bee VIDEO_TS.VOB (I know next to nothing about these)
- There was accompanying date outlining various flows through the menus
- Each node could either have buttons or actions or relay into another action

So an DVD may have a flow as follows:

1. All that nonsense with trailers and stuff that you can't skip
2. An opening clip which leads into
3. Main menu and options
4. User clicks "Special features"
5. Underlying action is fired, which loads a
6. Transition video clip...
7. ...which redirects to...
8. ...special features menu

PLEASE CORRECT THE BITS I GOT WRONG HERE ^

## How this project copies that

- Have a video player running a file in the background
- Has a JSON file which outlines all of the actions within the menu and positioning of various links and buttons
- Capable of including local storage updates for attributes such as subtitles and audio track

Please see the datatypes file for how these bits work

## What does work

Absolutely loads, please see the TODO file. I guess the main thing right now is that it's overly coupled to Shrek and overly coupled to Youtube

## How to run

```
yarn install
yarn start
```
