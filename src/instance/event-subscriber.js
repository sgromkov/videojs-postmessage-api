/**
 * Object to subscribe for player's events.
 */
const eventSubscriber = (function() {
  /**
   * Videojs player instance.
   */
  let player = null;

  /**
   * Private object containing methods to subscribe the player's events.
   */
  const events = {
    /**
     * Player loaded and ready to play.
     *
     * @function  ready
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    ready(type, callback) {
      player.one('ready', function() {
        callback(type);
      });
    },

    /**
     * Player state changed
     *
     * @function  changeState
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    changeState(type, callback) {
      player.on('playing', function() {
        callback(type, {state: 'playing'});
      });

      player.on('pause', function() {
        callback(type, {state: 'paused'});
      });

      player.on('ended', function() {
        callback(type, {state: 'stopped'});
      });
    },

    /**
     * Information about the current playing time of the video.
     *
     * @function  currentTime
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    currentTime(type, callback) {
      player.on('timeupdate', function() {
        callback(type, {time: player.currentTime()});
      });
    },

    /**
     * Information about the fact and status of ad playback in the player.
     *
     * @function  rollState
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    rollState(type, callback) {},

    /**
     * Enter or exit fullscreen.
     *
     * @function  changeFullscreen
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    changeFullscreen(type, callback) {
      player.on('fullscreenchange', function() {
        callback(type, {isFullscreen: player.isFullscreen()});
      });
    },

    /**
     * Error during playback
     *
     * @function  error
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    error(type, callback) {
      player.on('error', function(event) {
        event.stopImmediatePropagation();

        const error = player.error();
        let data = {};

        if (error) {
          data = {
            reason: 'playback',
            code: error.code,
            text: error.message
          };
        }

        callback(type, data);
      });

      player.on('postMessageError', function(event, hash) {
        const data = {
          reason: 'management'
        };

        if (hash.hasOwnProperty('code')) {
          data.code = hash.code;
        }

        if (hash.hasOwnProperty('text')) {
          data.text = hash.text;
        }

        callback(type, data);
      });
    },

    /**
     * End of playback event (video and advertising).
     * Player is going to endscreen.
     *
     * @function  playComplete
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    playComplete(type, callback) {
      player.on('ended', function() {
        callback(type);
      });
    },

    /**
     * Information about changing the sound level.
     *
     * @function  volumeChange
     * @param     {string} type
     *            Event name.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    volumeChange(type, callback) {
      player.on('volumechange', function() {
        const volume = (player.muted()) ? 0 : player.volume();

        callback(type, {volume});
      });
    }
  };

  /**
   * Public object to contact with eventSubscriber.
   * Facade pattern:
   * https://addyosmani.com/largescalejavascript/#facadepattern
   */
  return {
    /**
     * Public method to set the player you want to listen.
     *
     * @function  init
     * @param     {Object} playerInstance
     *            Videojs player instance.
     * @param     {Function} callback
     *            Callback for eventSubscriber to call when events occur in the player.
     */
    init(playerInstance, callback) {
      player = playerInstance;
      for (const type in events) {
        if (events.hasOwnProperty(type)) {
          events[type](type, callback);
        }
      }
    }
  };
}());

export default eventSubscriber;
