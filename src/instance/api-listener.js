import apiHandler from './api-handler';

/**
 * Object to listen the API commands and send it to the player.
 */
const apiListener = {
  TYPE_PREFIX: 'player:',

  /**
   * Will return type name without prefix, or false if it's not.
   *
   * @function  getTypeName
   * @param     {string} type
   *            Type name with prefix.
   * @return    {string | boolean}
   *            Type name without prefix or false.
   */
  getTypeName(type) {
    return (typeof type === 'string' && type.indexOf(this.TYPE_PREFIX) === 0) ?
    type.slice(this.TYPE_PREFIX.length) : false;
  },

  /**
   * Will return valid message object for apiHandler, or false if it's not.
   *
   * @function  getMessage
   * @param     {Object} eventData
   *            Should has type and additional data to control player.
   * @return    {Object | boolean}
   *            Valid message object or false.
   */
  getMessage(eventData) {
    const data = eventData.data || {};
    const type = (eventData.hasOwnProperty('type')) ?
      this.getTypeName(eventData.type) : false;
    let message = false;

    if (type) {
      message = {data, type};
    }

    return message;
  },

  /**
   * Listen to postmessage and send it to the apiHandler.
   *
   * @function  receiveMessage
   * @param     {Object} event
   *            Standart browser's event.
   */
  receiveMessage(event) {
    const prefix = 'player-api-command://';
    let data;
    let message;

    if (typeof event.data === 'string' && event.data.indexOf(prefix) === 0) {
      data = event.data.substring(prefix.length);
      message = this.getMessage(JSON.parse(data));

      if (message) {
        apiHandler.facade(message);
      }
    }
  },

  /**
   * Add event listener for the window postmessages.
   *
   * @function  subscribe
   */
  subscribe() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  },

  /**
   * Call apiHandler with videojs player instance
   * and subscribe for postmessages.
   *
   * @function  init
   * @param     {Object} player
   *            Videojs player instance.
   */
  init(player) {
    apiHandler.init(player);
    this.subscribe();
  }
};

export default apiListener;
