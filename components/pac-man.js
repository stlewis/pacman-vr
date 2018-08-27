AFRAME.registerComponent('pac-man', {

  init: function() {
    console.log("registered as pac-man")
    this.registerEventListeners = this.registerEventListeners.bind(this);

    this.registerEventListeners();
  },

  registerEventListeners: function() {

  }

});
