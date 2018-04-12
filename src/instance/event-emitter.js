import eventSubscriber from './event-subscriber';

/**
 * Object to send messages when events occur in the player.
 */
const eventEmitter = {
  TYPE_PREFIX: 'player:',

  /**
   * Will return correct data with prefix.
   *
   * @function  getMessage
   * @param     {string} type
   *            Event name.
   * @param     {Object} data
   *            Event additional data.
   * @return    {Object}
   *            Plugin's message.
   */
  getMessage(type, data = {}) {
    return {
      type: this.TYPE_PREFIX + type,
      data
    };
  },

  /**
   * Send postmessage to parent window.
   *
   * @function  sendMessage
   * @param     {Object} message
   *            Plugin's message.
   */
  sendMessage(message) {
    if (parent !== window) {
      parent.postMessage(JSON.stringify(message), '*');
    }
  },

  /**
   * Callback for eventSubscriber to call when events occur in the player.
   *
   * @function  triggerMessage
   * @param     {string} type
   *            Event name.
   * @param     {Object} data
   *            Event additional data.
   */
  triggerMessage(type, data = {}) {
    const message = this.getMessage(type, data);

    this.sendMessage(message);
  },

  /**
   * Call eventEmitter with videojs player instance
   * and listen to the player events.
   *
   * @function  init
   * @param     {Object} player
   *            Videojs player instance.
   */
  init(player) {
    eventSubscriber.init(player, this.triggerMessage.bind(this));
  }
};

export default eventEmitter;
