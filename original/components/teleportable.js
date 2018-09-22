AFRAME.registerComponent('teleportable', {
  tick: function() {
    var currentPosition = this.el.getAttribute('position')
    //var currentFrame    = this.el.sceneEl.systems['pac-maze'].frameFromPosition(currentPosition).position

    if(currentPosition.z <= -25){
      // Teleport the user to 27
      this.el.setAttribute('position', { x: currentPosition.x, y: currentPosition.y, z: 27 })
    }

    if(currentPosition.z >= 28){
      this.el.setAttribute('position', { x: currentPosition.x, y: currentPosition.y, z: -24 })
    }
  }

});
