# videojs-postmessage-api

A Video.js plugin for postMessage API

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
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

## License

MIT. Copyright (c) Sergey Gromkov &lt;sgromkov@gmail.com&gt;


[videojs]: http://videojs.com/
