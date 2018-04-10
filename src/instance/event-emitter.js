import eventSubscriber from './event-subscriber';

const eventEmitter = {
  TYPE_PREFIX: 'player:',

  getMessage(type, data = {}) {
    return {
      type: this.TYPE_PREFIX + type,
      data: data
    };
  },

  sendMessage(message) {
    if (parent !== window) {
      parent.postMessage(JSON.stringify(message), "*");
    }
  },

  triggerMessage(type, data = {}) {
    const message = this.getMessage(type, data);

    this.sendMessage(message);
  },

  init(player) {
    eventSubscriber.init(player, this.triggerMessage.bind(this));
  }
};

export default eventEmitter;