
AFRAME.registerComponent('blinky-behavior', {

  schema: {
    targetEntity: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function () {
    this.target = document.querySelector(this.data.targetEntity);
    this.pacMaze = this.el.sceneEl.systems['pac-maze'];
  },

  tick: function() {
    // Blinky doesn't give a fuck...Blinky is chasing the player directly
    if(!this.target) return;

    sceneEl         = this.el.sceneEl;
    currentDotCount = sceneEl.components.scoreboard.globalDotCounter;

    isActive = currentDotCount >= this.data.initializationDotCount;

    targetLocation  = this.target.object3D.position;
    pacFrame        = this.pacMaze.frameFromPosition(targetLocation);
    myFrame         = this.pacMaze.frameFromPosition(this.el.object3D.position)


    console.log("Blinky Traverse", myFrame.traversable)

    if(!myFrame.traversable) {
      newFrame = this.pacMaze.framesWithin(1, myFrame).filter(function(frame){ return frame.traversable })

      this.el.setAttribute('position', newFrame.position);
      this.el.setAttribute('nav-agent', {active: false})
    }


    if(!pacFrame) return true;

    this.el.setAttribute('nav-agent', { active: isActive, destination:  pacFrame.position })

  }

});
