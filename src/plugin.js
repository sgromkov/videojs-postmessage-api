import videojs from 'video.js';
import {version as VERSION} from '../package.json';

// Default options for the plugin.
const defaults = {};

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

const apiHandler = (function() {
  let player = null;
  const _private = {
    TYPE_PREFIX: 'player:',
    getHandlerKeys: function() {
      return Object.getOwnPropertyNames(this.handlers);
    },
    getTypeName: function(type) {
      return (type && type.indexOf(this.TYPE_PREFIX) !== -1)
      ? type.slice(this.TYPE_PREFIX.length): false;
    },
    validateTypeName: function(typeName) {
      return this.getHandlerKeys().includes(typeName);
    },
    log: function() {
      videojs.log(...arguments);
    },
    handlers: {

      /**
       * Play video content.
       *
       * @function  play
       */
      play: function() {
        player.play();
      },

      /**
       * Pause video content.
       *
       * @function  pause
       */
      pause: function() {
        player.pause();
      },

      /**
       * Stop video content and reset video buffer and ads.
       *
       * @function  stop
       */
      stop: function() {
        player.src(player.src());
      },

      /**
       * Go to a specific second of the video.
       *
       * @function  setCurrentTime
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {Number} data.time
       *            New playback time.
       */
      setCurrentTime: function(data) {
        player.currentTime(data.time);
      },

      /**
       * Rewind a video to specific second: back or forward.
       *
       * @function  relativelySeek
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {Number} data.time
       *            Number of seconds to rewind a video:
       *            (minus sign) - rewind to back;
       *            (plus sign) - rewind forward.
       */
      relativelySeek: function(data) {
        let resultTime = player.currentTime() + data.time;
        if (resultTime < 0) {
          resultTime = 0;
        }
        player.currentTime(resultTime);
      },

      /**
       * Change video content.
       *
       * @function  changeVideo
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {Object} data.source
       *            Video source in videojs format.
       *
       * @param     {String} data.id
       *            Link to source.
       *
       * @param     {String} data.hash
       *            Link to source.
       *            Upload the video directly to the highest quality available (without automatic switching),
       *            passing the parameter data.quality with the value 1.
       *
       * @param     {Number} data.quality
       *            Param to upload video with highest quality.
       */
      changeVideo: function(data) {
        const source = data.source;
        if (source) {
          player.src(source);
        }
      },

      /**
       * Mute video content.
       *
       * @function  mute
       */
      mute: function() {
        player.muted(true);
      },

      /**
       * Unmute video content.
       *
       * @function  unMute
       */
      unMute: function() {
        player.muted(false);
      },

      /**
       * Setting the sound level.
       *
       * @function  setVolume
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {Number} data.volume
       *            A value from 0 to 1
       */
      setVolume: function(data) {
        player.volume(data.volume);
      },

      /**
       * The removal of the player, and release the resources it is using
       *
       * @function  remove
       */
      remove: function() {
        player.dispose();
      }
    }
  };
  return {
    facade: function(message) {
      const data = message.data || {};
      const type = _private.getTypeName(message.type);

      if (!type || !_private.validateTypeName(type)) {
        _private.log("Wrong data:", message);
        return false;
      }

      _private.log(type, data);
      _private.handlers[type](data);
    },
    init: function(playerInstance) {
      player = playerInstance;
    }
  }
}());

class PostMessageApiListener {
  constructor(player) {
    apiHandler.init(player);
  }

  subscribe() {
    window.addEventListener("message", this.receiveMessage, false);
  }

  receiveMessage(event) {
    apiHandler.facade(event.data);
  }
}


/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 *           A Video.js player object.
 *
 * @param    {Object} [options={}]
 *           A plain object containing options for the plugin.
 */
const onPlayerReady = (player, options) => {
  player.addClass('vjs-videojs-postmessage-api');

  const listener = new PostMessageApiListener(player);
  listener.subscribe();
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function postmessageApi
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
const postmessageApi = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

// Register the plugin with video.js.
registerPlugin('postmessageApi', postmessageApi);

// Include the version number.
postmessageApi.VERSION = VERSION;

export default postmessageApi;
