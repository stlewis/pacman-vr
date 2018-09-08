/*
 * This is the baseline behavior for all ghosts. Given a particular target, move through
 * the maze towards that target in a prescribed fashion.
 */

AFRAME.registerComponent('ghost-behavior', {

  schema: {
    ghostName: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function () {
    this.pacMaze     = this.el.sceneEl.systems['pac-maze'];
    this.pacMan      = document.querySelector('#rig') // For Pac-Man's maze agent

    this.el.addEventListener('frameChange', this.handleFrameChange.bind(this));
  },

  tick: function(){
    this.setTargetFrame();
    this.updateNavDestination();
  },

  handleFrameChange: function(e){
    this.setTargetFrame();
    this.updateNavDestination();
  },

  updateNavDestination: function(){
    currentDotCount  = this.el.sceneEl.components.scoreboard.globalDotCounter;
    isActive         = currentDotCount >= this.data.initializationDotCount
    destinationFrame = this.calculateDestinationFrameToo();
    if(!destinationFrame) return false
    this.el.setAttribute('nav-agent', {active:  isActive, destination: destinationFrame.position  })
  },

  setTargetFrame: function(){
    // Figure out where we want to go.
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
    // For the _moment_ we'll let the destination frame be where ever Mr. Pac Man is.
    return this.pacMaze.frameFromPosition(this.pacMan.object3D.position)
  },

  calculateDestinationFrameToo: function() {
    //return {position: {x: -30, y: 0.28, z: 0} }
    self = this;
    // At any given frame of the maze, a ghost has between 1 and 3
    // possible choices for which frame to move to next. Beyond this they
    // have a "target frame" which acts as their ultimate destination. In
    // general, the frame they choose to move to should bring them closer
    // to their ultimate destination in the most efficient way possible.

    // First get a list of possible frames that are reachable from the
    // ghost's current frame. These are all traversable frames _except_
    // the one they've just vacated. Ghosts aren't allowed to move backwards
    myFrame         = this.pacMaze.frameFromPosition(this.el.object3D.position);
    candidateFrames = this.pacMaze.framesWithin(1, myFrame, true);
    candidateFrames = candidateFrames.filter(function(cf){
      console.log(self.el.components);
      myPreviousFrame = self.el.components['maze-agent'].previousFrame;
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
    closestFrame         = candidateFrames[0];
    bestDistanceToTarget = Infinity;
    target               = this.targetFrame;
    targetV3             = new THREE.Vector3(target.position.x, target.position.y, target.position.z);
    preferenceScale      = ['East', 'South', 'West', 'North'];

    for(i = 1; i < candidateFrames.length; i++){
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
    return this.pacMan.components['maze-agent'].currentFrame;
  },

  pinkyTargetFrame: function(){

   },

  inkyTargetFrame: function() {

  },

  clydeTargetFrame: function() {

  }

});
