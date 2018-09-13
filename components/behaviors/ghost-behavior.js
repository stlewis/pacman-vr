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

    // Before we attempt any further logic, we have to get the ghosts
    // "out of the house". Blinky doesn't have this issue, but all the
    // others do. A relatively simple way to ensure this...if the ghost
    // isn't currently on a traversable frame, it should aim for the frame
    // just outside the house

    if(!myFrame.traversable) {
      return self.pacMaze.frameFromPosition({ x: -36, y: 0, z: 2 })
    }

    this.setTargetFrame();

    // At any given frame of the maze, a ghost has between 1 and 3
    // possible choices for which frame to move to next. Beyond this they
    // have a "target frame" which acts as their ultimate destination. In
    // general, the frame they choose to move to should bring them closer
    // to their ultimate destination in the most efficient way possible.

    // First get a list of possible frames that are reachable from the
    // ghost's current frame. These are all traversable frames _except_
    // the one they've just vacated. Ghosts aren't allowed to move backwards
    candidateFrames = this.pacMaze.framesWithin(1, myFrame, true);
    candidateFrames = candidateFrames.filter(function(cf){
      myPreviousFrame = self.el.components['maze-agent'].previousFrame;
      if(!myPreviousFrame) return true
      return myPreviousFrame && !self.pacMaze._sameFrame(cf, myPreviousFrame)
    });


    // Now that we've narrowed our list down to only those frames that are
    // eligible for movement, we need to decide which of our options is the
    // "best" one. Naturally, if our filtering leaves us with just one option,
    // we take that one.
    if(candidateFrames.length == 1) return candidateFrames[0];

    // If we've got more than one option, we need to measure the distance
    // between each option and our _ultimate_ target square. This is a
    // straight line measurement between the points and _most often_ should
    // result in a single remaining option. However, if more than 1 option is
    // the same distance away, we select just one by following these rules of
    // precedence: North is better than West, which is better than South,
    // which is better than East.

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
        // If the current candidate is better than the previous best, replace it.
        bestDistanceToTarget = distanceToTarget
        closestFrame = candidate
      }else if(distanceToTarget == bestDistanceToTarget){
        // If we have a duplicate distance, we can choose between them by
        // applying the rules of precedence. Whichever one wins between the
        // current best and the candidate takes/keeps the spot.

        // Get the relative direction of the current best Frame.
        currentBestDirection = this.pacMaze.directionFrom(closestFrame, target);
        candidateDirection   = this.pacMaze.directionFrom(candidate, target);

        currentBestScaleValue = preferenceScale.indexOf(currentBestDirection);
        candidateScaleValue   = preferenceScale.indexOf(candidateDirection);

        closestFrame  = currentBestScaleValue > candidateScaleValue ? closestFrame : candidate
      }
    }

    // One way or the other, at the end of all this, we should have just a single value;
    return closestFrame;
  },

  blinkyTargetFrame: function() {
    // Blinky is hardcore. Blinky is headed straight for Pacman.
    frame  = this.pacMan.components['maze-agent'].currentFrame;
    return frame;
  },

  pinkyTargetFrame: function(){
    // Pinky is aiming for the square 4 squares "in front" of Pacman, in an effort to cut him off.
    // To determine this, we get Pac-Man's facing and position, then count out 4 squares from that point.
    // It's worth noting that Pinky's target frame may not be traversable, but that's okay since Pinky will
    // never actually be _aiming_ for that square when navigating. Rather, he will be making turn decisions
    // based on _distance_ from it.

    pacPos       = this.pacMan.components['maze-agent'].currentFrame;
    pacFacing    = this.pacMan.components['maze-agent'].currentFacing;
    squares4Away = this.pacMaze.framesAway(4, pacPos)
    self         = this;

    squaresOnPath = squares4Away.filter(function(sq){ dir = self.pacMaze.directionFrom(pacPos, sq); return dir == pacFacing  })


    return squaresOnPath[0];
  },

  clydeTargetFrame: function() {
    // Clyde's target is dependent upon where he is with relation to Pac-man. If he's further than 8 tiles from Pacman,
    // he behaves just like Blinky. If he's within 8 tiles, he behaves as he would if he were in "scatter mode", aiming
    // for his scatter tile, (bottom left corner)
    pacPos   = this.pacMan.components['maze-agent'].currentFrame;
    clydePos = this.el.components['maze-agent'].currentFrame;

    clydeDistance = this.pacMaze.distanceBetween(pacPos, clydePos);


    return clydeDistance <= 10 ? pacPos : this.clydeScatterFrame();
  },

  clydeScatterFrame: function(){
    return this.pacMaze.frameArray[34][4]
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

    initialVector = squaresOnPath[0];

    // Get the vector between Blinky and the initial target
    vector      = new THREE.Vector3();
    blinkyVec   = new THREE.Vector3(blinkPos.x, blinkPos.y, blinkPos.z);

    pacVec      = new THREE.Vector3(pacPos.x, pacPos.y, pacPos.z);

    // Double the vector for a final position
    finalVector = vector.subVectors(blinkyVec, pacVec).normalize();

    return this.pacMaze.frameFromPosition(finalVector);
  },


});
