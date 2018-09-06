
AFRAME.registerComponent('clyde-behavior', {

  schema: {
    targetEntity: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function () {
    this.target = document.querySelector(this.data.targetEntity);
    this.pacMaze = this.el.sceneEl.systems['pac-maze'];
  },

  tick: function() {
    // Clyde only cares about getting roughly in the region of the player. He'll pick a spot within 5 frames
    if(!this.target) return;

    var sceneEl         = this.el.sceneEl;
    var currentDotCount = sceneEl.components.scoreboard.globalDotCounter;

    var isActive = currentDotCount >= this.data.initializationDotCount;


    targetLocation  = this.target.object3D.position;
    pacFrame        = this.pacMaze.frameFromPosition(targetLocation);
    candidateFrames = this.pacMaze.framesWithin(5, pacFrame).filter(function(frame){ return frame.traversable })

    if(candidateFrames.length < 1) return true;

    finalFrame = candidateFrames[0] //candidateFrames.length == 1 ? candidateFrames[0] : candidateFrames[Math.floor(Math.random() * candidateFrames.length)]

    this.el.setAttribute('nav-agent', { active: isActive, destination: finalFrame.position })
  }

});
