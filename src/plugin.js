import videojs from 'video.js';
import {version as VERSION} from '../package.json';
import defaults from './instance/defaults';
import apiListener from './instance/api-listener';
import eventEmitter from './instance/event-emitter';

// Cross-compatibility for Video.js 5 and 6.
const registerPlugin = videojs.registerPlugin || videojs.plugin;
// const dom = videojs.dom || videojs;

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

  apiListener.init(player);
  eventEmitter.init(player);
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
  onPlayerReady(this, videojs.mergeOptions(defaults, options));
};

// Register the plugin with video.js.
registerPlugin('postmessageApi', postmessageApi);

// Include the version number.
postmessageApi.VERSION = VERSION;

export default postmessageApi;
