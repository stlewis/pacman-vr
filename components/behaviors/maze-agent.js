/* The maze-agent component registers behaviors and methods that all moving objects
 * within the maze, (ghosts and pac-man), have in common. Primarily these are related
 * to the currently occupied frame, the agent's current facing in the maze, and their
 * direction of travel.
*/

AFRAME.registerComponent('maze-agent', {
  schema: {
    isPacMan: {type: 'boolean', default: false}
  },

  init: function(){
    this.pacMaze         = this.el.sceneEl.systems['pac-maze'];
    this.currentFrame    = null;
    this.previousFrame   = null;
    this.currentFacing   = null;
  },

  tick: function() {
    this.updateCurrentFrame();
    this.updateCurrentFacing();

    agentData = {currentFrame: this.currentFrame, currentFacing: this.currentFacing }
  },

  updateCurrentFrame: function() {
    el = this.el;
    currentFrame = this.pacMaze.frameFromPosition(el.object3D.position);

    if(currentFrame != this.currentFrame){
      this.previousFrame = Object.assign({}, this.currentFrame); // Need a copy so we don't end up with the same reference
      this.currentFrame  = currentFrame
      this.el.emit('frameChange', {previousFrame: this.previousFrame, currentFrame: this.currentFrame});
    }
  },

  updateCurrentFacing: function(){
    el = this.el;

    // If this element is wrapping a camera, we care about the _camera's_ facing. Otherwise, the facing of the entity is sufficient.
    cameraEl =  [].slice.call(el.children).filter(function(ch){ return ch.attributes['camera'] })[0];
    facingEl = this.data.isPacMan ? cameraEl : this.el;


    targetRotation  = facingEl.object3D.getWorldDirection()

    facingNorth = targetRotation.x > 0 && targetRotation.z >= 0;
    facingSouth = targetRotation.x < 0 && targetRotation.z <= 0;
    facingEast  = targetRotation.x <= 0 && targetRotation.z > 0;
    facingWest  = targetRotation.x >= 0 && targetRotation.z < 0;


    if(facingNorth) this.currentFacing = 'North';
    if(facingSouth) this.currentFacing = 'South';
    if(facingEast)  this.currentFacing = 'East';
    if(facingWest)  this.currentFacing = 'West';
  }

});
