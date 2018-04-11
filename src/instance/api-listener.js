import apiHandler from './api-handler';

const apiListener = {
  TYPE_PREFIX: 'player:',

  getTypeName(type) {
    return (typeof type === 'string' && type.indexOf(this.TYPE_PREFIX) === 0) ?
    type.slice(this.TYPE_PREFIX.length) : false;
  },

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

  receiveMessage(event) {
    if (event.source !== event.target) {
      const message = this.getMessage(JSON.parse(event.data));

      if (message) {
        apiHandler.facade(message);
      }
    }
  },

  subscribe() {
    window.addEventListener('message', this.receiveMessage.bind(this), false);
  },

  init(player) {
    apiHandler.init(player);
    this.subscribe();
  }
};

export default apiListener;
