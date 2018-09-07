AFRAME.registerComponent('inky-behavior', {

  schema: {
    targetEntity: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function () {
    this.target      = document.querySelector(this.data.targetEntity);
    this.pacMaze     = this.el.sceneEl.systems['pac-maze'];
    this.targetFrame = null
  },

  tick: function() {
    if(!this.target) return;
    targetRotation  = document.querySelector('#camera').object3D.getWorldDirection()

    facingNorth = targetRotation.x > 0 && targetRotation.z >= 0;
    facingSouth = targetRotation.x < 0 && targetRotation.z <= 0;
    facingEast  = targetRotation.x <= 0 && targetRotation.z > 0;
    facingWest  = targetRotation.x >= 0 && targetRotation.z < 0;

    var sceneEl         = this.el.sceneEl;
    var currentDotCount = sceneEl.components.scoreboard.globalDotCounter;

    var isActive = currentDotCount >= this.data.initializationDotCount;


    // Pinky wants to end up two frames in front of Pac-Man. Targeting such a tile means:
    // 1. Figure out which direction PacMan is facing.
    // 2. Figure out which tile he is on.
    // 3. Target a frame that is a distance of 2 from Pac-Man in the direction he is facing.
    targetLocation  = this.target.object3D.position;
    pacFrame        = this.pacMaze.frameFromPosition(targetLocation);
    candidateFrames = this.pacMaze.framesWithin(2, pacFrame).filter(function(frame){ return frame.traversable })

    if(candidateFrames.length < 1) return true;

    facingFrames = null;

    // If pacman is facing north, choose a candidate with an X or a Z less than pacman's current X/Z
    if(facingNorth) facingFrames = candidateFrames.filter(function(frame){ return frame.position.x <= targetLocation.x  || frame.position.z <= targetLocation.z });
    // If pacman is facing south, choose a candidate with an X or a Z greater than pacman's current X/Z
    if(facingSouth) facingFrames = candidateFrames.filter(function(frame){ return frame.position.x >= targetLocation.x  || frame.position.z >= targetLocation.z });
    // If pacman is facing east, choose a candidate with an X greater than pac's position, or a Z less than pac's position
    if(facingEast) facingFrames = candidateFrames.filter(function(frame){ return frame.position.x >= targetLocation.x  || frame.position.z <= targetLocation.z });
    // If pacman is facing west, choose a candidate with an X less than pac's position, or a Z greater than pac's position
    if(facingWest) facingFrames = candidateFrames.filter(function(frame){ return frame.position.x <= targetLocation.x  || frame.position.z >= targetLocation.z });

    finalFrame = facingFrames.length == 1 ? facingFrames[0] : facingFrames[Math.floor(Math.random() * facingFrames.length)]

    if(this.targetFrame == null || facingFrames.indexOf(this.targetFrame) == -1) this.targetFrame = finalFrame;

    myFrame = this.pacMaze.frameFromPosition(this.el.object3D.position)

    if(!myFrame.traversable) {
      newFrame = this.pacMaze.framesWithin(1, myFrame).filter(function(frame){ return frame.traversable })

      this.el.setAttribute('position', newFrame.position);
      this.el.setAttribute('nav-agent', {active: false})
    }



    if(finalFrame) this.el.setAttribute('nav-agent', { active: isActive, destination: this.targetFrame.position })
  }

});

