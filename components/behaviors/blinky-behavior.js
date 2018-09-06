
AFRAME.registerComponent('blinky-behavior', {

  schema: {
    targetEntity: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function () {
    this.target = document.querySelector(this.data.targetEntity);
  },

  tick: function() {
    // Blinky doesn't give a fuck...Blinky is chasing the player directly
    return true;
    if(!this.target) return;
    var targetLocation  = this.target.object3D.position;
    var sceneEl         = this.el.sceneEl;
    var currentDotCount = sceneEl.components.scoreboard.globalDotCounter;

    var isActive = currentDotCount >= this.data.initializationDotCount;

    this.el.setAttribute('nav-agent', { active: isActive, destination: targetLocation })
  }

});
