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
      play: function(data) {
        console.log("play", data);
        player.play();
      },
      pause: function(data) {
        console.log("pause", data);
        player.pause();
      },
      // TODO: stop
      stop: function(data) {
        console.log("stop", data);
      },
      setCurrentTime: function(data) {
        console.log("setCurrentTime", data);
        player.currentTime(data.time);
      },
      // TODO: relativelySeek
      relativelySeek: function(data) {
        console.log("relativelySeek", data);
      },
      // TODO: changeVideo
      changeVideo: function(data) {
        console.log("changeVideo", data);
      },
      // TODO: mute
      mute: function(data) {
        console.log("mute", data);
      },
      // TODO: unMute
      unMute: function(data) {
        console.log("unMute", data);
      },
      // TODO: setVolume
      setVolume: function(data) {
        console.log("setVolume", data);
      },
      // TODO: remove
      remove: function(data) {
        console.log("remove", data);
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
