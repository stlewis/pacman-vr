/*
 * This is the baseline behavior for all ghosts. Given a particular target, move through
 * the maze towards that target in a prescribed fashion.
 */

AFRAME.registerComponent('ghost-behavior', {

  schema: {
    ghostName: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function() {
    this.pacMaze     = this.el.sceneEl.systems['pac-maze'];
    this.pacMan      = document.querySelector('#rig') // For Pac-Man's maze agent
    this.shouldUpdateNavDestination = true;
    this.destinationFrame           = null;

    this.el.addEventListener('nav-end', this.handleNavEnd.bind(this));
  },

  tick: function() {
    currentDotCount  = this.el.sceneEl.components.scoreboard.globalDotCounter;
    isActive         = currentDotCount >= this.data.initializationDotCount

    if(this.shouldUpdateNavDestination) {
      this.shouldUpdateNavDestination = false;
      this.destinationFrame = this.calculateDestinationFrame();
      this.el.setAttribute('nav-agent', {active:  isActive, destination: this.destinationFrame.position  })
    }else{
      this.el.setAttribute('nav-agent', {active:  isActive })
    }

  },

  handleNavEnd: function(e) {
    this.shouldUpdateNavDestination = true;
  },

  setTargetFrame: function(){
    switch(this.data.ghostName){
      case 'blinky':
        this.targetFrame = this.blinkyTargetFrame();
      break;
      case 'pinky':
        this.targetFrame = this.pinkyTargetFrame();
      break;
      case 'inky':
        this.targetFrame = this.inkyTargetFrame();
      break;
      case 'clyde':
        this.targetFrame = this.clydeTargetFrame();
      break;
    }

  },

  calculateDestinationFrame: function() {
    self    = this;
    myFrame = this.pacMaze.frameFromPosition(this.el.object3D.position);

    if(!myFrame.traversable) {
      return self.pacMaze.frameFromPosition({ x: -36, y: 0, z: 2 })
    }

    this.setTargetFrame();

    candidateFrames = this.pacMaze.framesWithin(1, myFrame, true);
    candidateFrames = candidateFrames.filter(function(cf){
      myPreviousFrame = self.el.components['maze-agent'].previousFrame;
      if(!myPreviousFrame) return true
      return myPreviousFrame && !self.pacMaze._sameFrame(cf, myPreviousFrame)
    });

    if(candidateFrames.length == 1) return candidateFrames[0];

    return this.closestFrameToTarget(candidateFrames);
  },

  closestFrameToTarget: function(candidateFrames) {
    var closestFrame         = candidateFrames[0];
    if(!this.targetFrame) return closestFrame;
    var bestDistanceToTarget = Infinity;
    target               = this.targetFrame;

    targetV3             = new THREE.Vector3(target.position.x, target.position.y, target.position.z);
    preferenceScale      = ['East', 'South', 'West', 'North'];

    for(i = 0; i < candidateFrames.length; i++){
      candidate        = candidateFrames[i];
      candidateV3      = new THREE.Vector3(candidate.position.x, candidate.position.y, candidate.position.z)
      distanceToTarget = candidateV3.distanceTo(targetV3);

      if(distanceToTarget < bestDistanceToTarget){
        bestDistanceToTarget = distanceToTarget
        closestFrame = candidate
      }else if(distanceToTarget == bestDistanceToTarget){
        currentBestDirection = this.pacMaze.directionFrom(closestFrame, target);
        candidateDirection   = this.pacMaze.directionFrom(candidate, target);

        currentBestScaleValue = preferenceScale.indexOf(currentBestDirection);
        candidateScaleValue   = preferenceScale.indexOf(candidateDirection);

        closestFrame  = currentBestScaleValue > candidateScaleValue ? closestFrame : candidate
      }
    }

    return closestFrame;
  },

  blinkyTargetFrame: function() {
    frame  = this.pacMan.components['maze-agent'].currentFrame;
    return frame;
  },

  pinkyTargetFrame: function(){
    pacPos       = this.pacMan.components['maze-agent'].currentFrame;
    pacFacing    = this.pacMan.components['maze-agent'].currentFacing;
    squares4Away = this.pacMaze.framesAway(4, pacPos)
    self         = this;

    squaresOnPath = squares4Away.filter(function(sq){ dir = self.pacMaze.directionFrom(pacPos, sq); return dir == pacFacing  })
    target        = squaresOnPath[0];

    this.markTarget('pinky', target)
    return target
  },

  clydeTargetFrame: function() {
    pacPos   = this.pacMan.components['maze-agent'].currentFrame;
    clydePos = this.el.components['maze-agent'].currentFrame;

    clydeDistance = this.pacMaze.distanceBetween(pacPos, clydePos);

    target = clydeDistance >= 10 ? pacPos : this.clydeScatterFrame();

    this.markTarget('clyde', target);

    return target
  },

  inkyTargetFrame: function() {
    // Inky is a little tough, as he uses not only pac-man's position and orientation, (like pinky), but
    // also the position of Blinky in determining his target.
    // To start with, get the frame that falls 2 in front of pac-man, ala Pinky. Then, find Blinky's position.
    // Draw a vector between Blinky and the initial target, then double it's length. The resulting square is
    // Inky's target

    pacPos    = this.pacMan.components['maze-agent'].currentFrame;
    pacFacing = this.pacMan.components['maze-agent'].currentFacing;
    blinkPos  = document.querySelector('#blinky-ghost').components['maze-agent'].currentFrame;
    inkyPos   = this.el.components['maze-agent'].currentFrame;

    squares2Away = this.pacMaze.framesAway(2, pacPos)
    self         = this;

    squaresOnPath = squares2Away.filter(function(sq){
      dir = self.pacMaze.directionFrom(pacPos, sq); return dir == pacFacing
    });

    initialFrame = squaresOnPath[0];

    vector    = new THREE.Vector3();
    blinkyVec = new THREE.Vector3(blinkPos.position.x, blinkPos.position.y, blinkPos.position.z);
    iniVec    = new THREE.Vector3(initialFrame.position.x, initialFrame.position.y, initialFrame.position.z);

    // Get the directional vector
    dirVector = vector.subVectors(blinkyVec, iniVec).normalize();
    distance  = blinkyVec.distanceTo(iniVec);

    targetVec = new THREE.Vector3();

    targetPos = targetVec.addVectors(iniVec, dirVector.multiplyScalar(distance * 2));

    target = this.pacMaze.frameFromPosition(targetPos);

    console.log("Initial", iniVec)
    this.markTarget('inky', target)

    return pacPos
  },

  clydeScatterFrame: function(){
    return this.pacMaze.frameArray[34][4]
  },

  markTarget: function(forGhost, target) {
    color = null;
    stickID = forGhost + 'TargetStick'

    switch(forGhost){
      case 'blinky':
        color = 'red';
        break;
      case 'pinky':
        color = 'pink';
        break;
      case 'inky':
        color = 'blue';
        break;
      case 'clyde':
        color = 'orange';
        break;
    }

    targetStick = document.createElement('a-cylinder');
    targetStick.setAttribute('id', stickID);
    targetStick.setAttribute('height', 1000);
    targetStick.setAttribute('color', color);
    targetStick.setAttribute('opacity', 0.5);
    targetStick.setAttribute('position', target.position);

    existingStick = document.querySelector('#' + stickID);

    if(existingStick) {
      existingStick.parentNode.removeChild(existingStick);
    }

    document.querySelector('a-scene').appendChild(targetStick);
  },



});
