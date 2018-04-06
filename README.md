# videojs-postmessage-api

A Video.js plugin for postMessage API

## Table of Contents

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Installation](#installation)
- [Usage](#usage)
  - [`<script>` Tag](#script-tag)
  - [Browserify/CommonJS](#browserifycommonjs)
  - [RequireJS/AMD](#requirejsamd)
- [API](#api)
- [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Installation

```sh
npm install --save videojs-postmessage-api
```

## Usage

To include videojs-postmessage-api on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-postmessage-api.min.js"></script>
<script>
  var player = videojs('my-video');

  player.postmessageApi();
</script>
```

### Browserify/CommonJS

When using with Browserify, install videojs-postmessage-api via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-postmessage-api');

var player = videojs('my-video');

player.postmessageApi();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-postmessage-api'], function(videojs) {
  var player = videojs('my-video');

  player.postmessageApi();
});
```

## API

* **Play video:**
  ```
    {
      type: 'player:play',
      data: {}
    }
  ```

* **Pause video:**
  ```
  {
    type: 'player:pause',
    data: {}
  }
  ```

* **Stop video and reset video buffer and ads:**
  ```
  {
    type: 'player:stop',
    data: {}
  }
  ```

* **Go to a specific second of the video:**

  `data.time` - new playback time in seconds.

  ```
  {
    type: 'player:setCurrentTime',
    data: {
      time: 20
    }
  }
  ```

* **Rewind the video for a specified number of seconds forward or backward:**

  `data.time` - number of seconds to rewind a video:
  * `-` *(minus)* - rewind to back;
  * `+` *(plus)* - rewind forward.

  ```
  {
    type: 'player:relativelySeek',
    data: {
      time: +20
    }
  }
  ```

* **Change video source:**

  `data.source` - video source in videojs format.

  ```
  {
    type: 'player:relativelySeek',
    data: {
      {
        source: {
          src: 'http://rmcdn.2mdn.net/Demo/vast_inspector/android.mp4',type: 'video/mp4'
        }
      }
    }
  }
  ```

* **Mute video:**
  ```
  {
    type: 'player:mute',
    data: {}
  }
  ```

* **Unmute video:**
  ```
  {
    type: 'player:unMute',
    data: {}
  }
  ```

* **Setting the volume level:**

  `data.volume` - a value from 0 to 1.

  ```
  {
    type: 'player:setVolume',
    data: {
      volume: 0.20
    }
  }
  ```

* **Remove player, and release the resources it is using**
  ```
  {
    type: 'player:remove',
    data: {}
  }
  ```


## License

MIT. Copyright (c) Sergey Gromkov &lt;sgromkov@gmail.com&gt;


[videojs]: http://videojs.com/
