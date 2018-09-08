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
  },

  updateNavDestination: function(){
    currentDotCount  = this.el.sceneEl.components.scoreboard.globalDotCounter;
    isActive         = currentDotCount >= this.data.initializationDotCount
    destinationFrame = this.calculateDestinationFrame();
    if(!destinationFrame) return false
    this.el.setAttribute('nav-agent', {active:  isActive, destination: destinationFrame.position  })
  },

  updateNavToFrame: function() {
    // Let's use this method to try to figure out frame-by-frame navigation.
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
