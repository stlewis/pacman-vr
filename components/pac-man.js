AFRAME.registerComponent('pac-man', {

  init: function() {
    this.registerEventListeners = this.registerEventListeners.bind(this);

    this.registerEventListeners();
  },

  tick: function() {
    var currentPosition = this.el.getAttribute('position')

    if(currentPosition.z <= -25){
      // Teleport the user to 27
      this.el.setAttribute('position', { x: currentPosition.x, y: currentPosition.y, z: 27 })
    }

    if(currentPosition.z >= 28){
      this.el.setAttribute('position', { x: currentPosition.x, y: currentPosition.y, z: -24 })
    }
  },

  registerEventListeners: function() {

  }

});
