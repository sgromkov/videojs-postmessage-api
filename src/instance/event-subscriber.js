const eventSubscriber = (function() {
  let player = null;

  const events = {
    ready(type, callback) {
      player.one('ready', function() {
        callback(type);
      });
    },

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

    currentTime(type, callback) {
      player.on('timeupdate', function() {
        callback(type, {time: player.currentTime()});
      });
    },

    rollState(type, callback) {},

    changeFullscreen(type, callback) {
      player.on('fullscreenchange', function() {
        callback(type, {isFullscreen: player.isFullscreen()});
      });
    },

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

    playComplete(type, callback) {
      player.on('ended', function() {
        callback(type);
      });
    },

    volumeChange(type, callback) {}
  };

  return {
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
