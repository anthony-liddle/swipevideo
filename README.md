# SwipeVideo.js

This is your basic javascript gallery, except it stops at key moments in a video.

This is an early release, so there's still much to do.

It currently does not have a fallback for early versions of IE.

## Install

Include the minified source javascript and CSS files:

+ [swipevideo.min.css](dist/swipevideo.min.css)
+ [swipevideo.min.js](dist/swipevideo.min.js)

## Initialize

### In JavaScript

``` js
new SwipeVideo();
```

You can also set various options:

``` js
new SwipeVideo({
  intervaltime: 10,       // The video will update every __ms
  framerate: 0.01,        // This is the step in framerate every amount of ms set in intervaltime
  swipelength: 200,       // Min swipe length in pixels to advance (Won't work when animating on swipe)
  element: 'swipe-video', // Default name of the Swipe-Video element
  animateonswipe: false,  // Will update the animation frame by frame while swiping
  aroundthehorn: false    // Around the horn only works when animating on swipe. Allows the video to loop on swipe
});
```

### In HTML

The simplest version of `swipe-video` at this time is to have the following 3 children elements:

+ `video`
+ `.swipe-video-overlay`
+ `.swipe-dot-nav`

For a child of `.swipe-video-overlay` to be included as a stopping point in the video, it needs to have a class of `.overlay` and a custom attribute of `data-overlay`.

The value of the `data-overlay` attribute will tie to the a point in the `.swipe-dot-nav` (if used).

Within the `.overlay` you will need to include a custom attribute of `data-time`. This will be a numerical value that will equal the time stamp in seconds that the slide should correlate to.

The item in `.swipe-dot-nav` will also need a `data-moment` attribute that be equal to the corresponding overlay (if you intend to use a dot-nav.

``` html
<div id="swipe-video" class="swipe-video">
  <video src="video/car_video.m4v" width="1024" height="768"></video>
  <div class="swipe-video-overlay">
    <img src="images/slide-1.jpg" class="overlay" data-time="0"   data-overlay="screen_one" />
    <img src="images/slide-2.jpg" class="overlay" data-time="2"   data-overlay="screen_two" />
    <img src="images/slide-3.jpg" class="overlay" data-time="3.5" data-overlay="screen_three" />
    <img src="images/slide-4.jpg" class="overlay" data-time="5.7" data-overlay="screen_four" />
    <img src="images/slide-5.jpg" class="overlay" data-time="8"   data-overlay="screen_five" />
    <img src="images/slide-6.jpg" class="overlay" data-time="10.5"  data-overlay="screen_six" />
  </div>
  <!-- The below .swipe-dot-nav is optional -->
  <div class="swipe-dot-nav">
    <ul>
      <li data-moment="screen_one"></li>
      <li data-moment="screen_two"></li>
      <li data-moment="screen_three"></li>
      <li data-moment="screen_four"></li>
      <li data-moment="screen_five"></li>
      <li data-moment="screen_six"></li>
    </ul>
  </div>
  <!-- /optional .swipe-dot-nav -->
</div>
```

Please note that the javascript adds a class of `.active` to the overlay, so it does not need to be an image. You could have it be a `div` that has children who will respond to the active class:

As a default, it is set up to fade in the overlays:

``` css
overlay {
  opacity: 0;
  transition: .25s opacity ease-out;
}

overlay.active {
  opacity: 1;
}
```

You can get as advanced as you'd like:

``` html
<div class="overlay title" data-overlay="tile_moment">
  <h1>This is my fancy title</h1>
</div>
```

``` css
overlay.title h1 {
  opacity:0;
  transform:skewX(0deg);
  transition: .25s transform ease-out;
}
overlay.title.active h1 {
  opacity:1;
  transform:skewX(180deg);
}
```

## License

SwipeVideo.js is released under the [MIT license](http://opensource.org/licenses/MIT).

* * *

Copyright :copyright: 2014 Anthony Law Liddle

### ToDos

+ Add a `paddle-nav` options
+ Allow option for data-time to be in milliseconds
