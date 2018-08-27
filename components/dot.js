AFRAME.registerComponent('dot', {

  schema: {
    pointValue: {default: 10},
    grantsInvulnerability: {type: 'boolean', default: false}
  },

  init: function() {
    this.registerEventListeners = this.registerEventListeners.bind(this);
    this.registerEventListeners();
  },

  registerEventListeners: function() {
    this.el.addEventListener('hit', this.handleEaten.bind(this))
  },

  handleEaten: function() {
    this.el.emit('addPoints', {points: this.data.pointValue })
    this.el.sceneEl.removeChild(this.el);
  }

});
