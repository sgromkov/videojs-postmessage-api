const apiHandler = (function() {
  let player = null;
  const _private = {
    getHandlerKeys() {
      return Object.getOwnPropertyNames(this.handlers);
    },
    handlerExist(typeName) {
      return this.getHandlerKeys().includes(typeName);
    },
    error(data) {
      player.trigger('postMessageError', data);
    },
    handlers: {

      /**
       * Play video content.
       *
       * @function  play
       */
      play() {
        player.play();
      },

      /**
       * Pause video content.
       *
       * @function  pause
       */
      pause() {
        player.pause();
      },

      /**
       * Stop video content and reset video buffer and ads.
       *
       * @function  stop
       */
      stop() {
        player.src(player.src());
      },

      /**
       * Go to a specific second of the video.
       *
       * @function  setCurrentTime
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {number} data.time
       *            New playback time.
       */
      setCurrentTime(data) {
        player.currentTime(data.time);
      },

      /**
       * Rewind a video to specific second: back or forward.
       *
       * @function  relativelySeek
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {number} data.time
       *            Number of seconds to rewind a video:
       *            (minus sign) - rewind to back;
       *            (plus sign) - rewind forward.
       */
      relativelySeek(data) {
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
       * @param     {string} data.id
       *            Link to source.
       *
       * @param     {string} data.hash
       *            Link to source.
       *            Upload the video directly to the highest quality available
       *            (without automatic switching),
       *            passing the parameter data.quality with the value 1.
       *
       * @param     {number} data.quality
       *            Param to upload video with highest quality.
       */
      changeVideo(data) {
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
      mute() {
        player.muted(true);
      },

      /**
       * Unmute video content.
       *
       * @function  unMute
       */
      unMute() {
        player.muted(false);
      },

      /**
       * Setting the sound level.
       *
       * @function  setVolume
       * @param     {Object} [data={}]
       *            An object of additional params.
       *
       * @param     {number} data.volume
       *            A value from 0 to 1
       */
      setVolume(data) {
        const volume = data.volume;

        player.volume(volume);
        if (volume === 0) {
          player.muted(true);
        } else {
          player.muted(false);
        }
      },

      /**
       * The removal of the player, and release the resources it is using
       *
       * @function  remove
       */
      remove() {
        player.dispose();
      }
    }
  };

  return {
    facade(message) {
      const data = message.data || {};
      const type = message.type;

      if (typeof type === 'string' && _private.handlerExist(type)) {
        _private.handlers[type](data);
      } else {
        _private.error({text: 'wrong message: ' + JSON.stringify(message)});
        return false;
      }
    },
    init(playerInstance) {
      player = playerInstance;
    }
  };
}());

export default apiHandler;
