import apiHandler from './api-handler';

const apiListener = {
  subscribe() {
    window.addEventListener("message", this.receiveMessage, false);
  },

  receiveMessage(event) {
    if (event.source !== event.target) {
      apiHandler.facade(JSON.parse(event.data));
    }
  },

  init(player) {
    apiHandler.init(player);
    this.subscribe();
  }
};

export default apiListener;