Data array structure types

### `launch`

A string array of video files which are unskippable. Must use the key `launch`.

example:
```
[
  'big legal disclaimer',
  'trailer for crap film',
  'trailer for film no one watching this would be interested in',
  'you wouldn't download a car',
]
```

NOTE this means /launch will be a broken page in the current implementation

### Regular Menu page

```
{
  media: string // if missing use default from config
  start: number // if missing use 0
  end: number // if missing use end of file
  options: OptionsTypes[]
  redirect?: string // location to redirect to 
}
```

the default page to load following "launch" will be "root",
This will contain one additional option called `initialMedia` which supplants media on initial load, 

#### Options Type: link

```
// link variant
{
  toggle?: toggle object // selection of radio buttons, will save to local storage
  children?: string | Component,
  link?: string // where it goes
  x: number // x postion
  y: number
  h: number // height
  w: number // width
  style?: styleobject // will be applied inline, standard jsx structure here
}
```

### Config file
```
  defaultVideo: string // name of video file, e.g. "https://youtube.com/embed/V3airyA0Kig", 
  type: string // source type for videojs e.g. "video/youtube", must be same for all videos
  sourceDir: string // useful if wanting to avoid repeating stuff "https://youtube.com/embed/",
  poster: string // loads on page launch "https://images-na.ssl-images-amazon.com/images/I/518D7QGC3TL._AC_SY445_.jpg",
  scenesData: stuff // the layout for the pages on scenes stuff involved a load of repetition so I dumped it in here
```
