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

    vector = camera.object3D.getWorldDirection();
    theta  = Math.atan2(vector.x, vector.z);
    angle  = THREE.Math.radToDeg(theta);

    // Because of reasons, we think of the degrees that _would_ be north as being East, and all other values change accordingly.
    facingEast  = angle >= -60 && angle <= 40
    facingNorth = angle >= 41 && angle <= 114
    facingWest  = angle >= 115 && angle <= 179 || angle >= -179  && angle <= -130
    facingSouth = angle >= -129 && angle <= -59



    if(facingNorth) this.currentFacing = 'North';
    if(facingSouth) this.currentFacing = 'South';
    if(facingEast)  this.currentFacing = 'East';
    if(facingWest)  this.currentFacing = 'West';
  }

});
