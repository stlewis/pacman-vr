AFRAME.registerSystem('pac-maze', {

  init: function() {
    this.initializeFrameArray();
  },

  initializeFrameArray: function() {
    var self              = this;
    this.frameArray       = []
    var lastX             = -80
    var traversableFrames = this.getTraversableFrames();

    for(j = 1; j <= 50; j++){
      xPos     = lastX + 2
      lastX        = xPos
      frameRow = [ {position: {x: xPos, y: 0, z: 50 } } ];

      for(i = 1; i < 50; i++){
        lastZ = frameRow[i - 1].position.z
        thisZ = lastZ - 2

        thisPosition = { x: xPos, y: 0.28, z: thisZ }
        isTraversable = traversableFrames.filter(function(frame){ return frame.x == i && frame.y == j   }).length == 1
        frameRow.push({ position: thisPosition, traversable: isTraversable, x: i, y: j })
      }

      this.frameArray.push(frameRow);

    }

    //this.paintFrames(true);

  },

  distanceMatrix: function() {
    distances = []
    pacFrame = {x: 17, y: 21 }

    for(y = 0; y < this.frameArray.length; y++){
      for(x = 0; x < this.frameArray[y].length; x++){
        distances[y] =  distances[y] ? distances[y] : []

        distances[y][x] = this.distanceBetween(pacFrame, this.frameArray[y][x])
      }
    }

    return distances
  },

  // Just drop an indicator on a frame -- useful for ID purposes
  paintFrame: function(frame) {
    position = frame.position;
    cylinder = document.createElement('a-cylinder');
    cylinder.setAttribute('material', 'color: red; opacity: 0.5;');
    cylinder.setAttribute('height', 2);
    cylinder.setAttribute('radius', 1)
    cylinder.setAttribute('position', position);

    document.querySelector("a-scene").appendChild(cylinder)
  },

  paintFrames: function(traversableOnly){
    for(y = 0; y < this.frameArray.length; y++){
      for(z = 0; z < this.frameArray[y].length; z++){
        if(traversableOnly){
          if(this.frameArray[y][z].traversable) this.paintFrame(this.frameArray[y][z])
        }else{
          this.paintFrame(this.frameArray[y][z])
        }
      }
    }
  },

  framesWithin: function(targetDistance, centerFrame, onlyTraversable){
    frames = [];
    onlyTraversable = onlyTraversable ? true : false;

    for(j = 0; j < this.frameArray.length; j++){
      row = this.frameArray[j];

      for(i = 0; i < row.length; i++){
        targetFrame     = this.frameArray[j][i];
        distance        = this.distanceBetween({x: targetFrame.x, y: targetFrame.y}, {x: centerFrame.x, y: centerFrame.y})
        traversableCond = targetFrame.traversable == onlyTraversable
        if(distance <= targetDistance && !this._sameFrame(centerFrame, targetFrame) && traversableCond){
          frames.push(targetFrame);
        }
      }
    }

    return frames;
  },

  framesAway: function(targetDistance, centerFrame, onlyTraversable) {
    frames = [];
    onlyTraversable = onlyTraversable ? true : false;

    for(y = 0; y < this.frameArray.length; y++){
      row = this.frameArray[y];

      for(x = 0; x < row.length; x++){
        targetFrame     = this.frameArray[y][x];
        if(!targetFrame) console.log('Bad Target', {x: x, y: y})
        if(!centerFrame) console.log('Bad Center?');
        distance        = this.distanceBetween({x: targetFrame.x, y: targetFrame.y}, {x: centerFrame.x, y: centerFrame.y})
        traversableCond = targetFrame.traversable == onlyTraversable
        if(distance == targetDistance){
          frames.push(targetFrame);
        }
      }
    }

    return frames;

  },

  _sameFrame: function(a, b){
    ax = a.x
    bx = b.x
    ay = a.y
    by = b.y

    if(ax != bx) return false;
    if(ay != by) return false;

    return true;
  },

  distanceBetween: function(targetFrame, centerFrame){
    var targetX = targetFrame.x
    var targetY = targetFrame.y;
    var centerX = centerFrame.x;
    var centerY = centerFrame.y;

    var xDistance = Math.abs(targetX - centerX);
    var yDistance = Math.abs(targetY - centerY);

    result = xDistance + yDistance
    return result

  },

  // Determine which cardinal direction to travel in order to reach target from origin
  directionFrom: function(origin, target){
    isNorth = origin.y < target.y && origin.x == target.x;
    isSouth = origin.y > target.y && origin.x == target.x;
    isEast  = origin.x < target.x && target.y == origin.y
    isWest  = origin.x > target.x && target.y == origin.y

    if(isNorth) return 'North';
    if(isSouth) return 'South';
    if(isEast) return 'East';
    if(isWest) return 'West';
  },

  frameFromPosition: function(targetPosition) {
    // Given an X/Z pair, determine which frame the player is currently occupying.
    // The coordinates stored in a frame represent it's center. If pac man's center point is +/- < 1 meter in both the X and Z axis of a given frame he is in that frame.
    // It is theoretically possible to catch Pac-man "between" frames in such a way that this method will return nothing. If that's true, then anything using this method
    // (for targeting, for instance), should maintain their previous target until they can get a good update.

    frameCandidate = null;

    for(j = 0; j < this.frameArray.length; j++){
      row = this.frameArray[j];

      for(i = 0; i < row.length; i++){
        targetFrame = this.frameArray[j][i];

        isCorrectFrame = Math.abs(targetPosition.x - targetFrame.position.x) < 1 && Math.abs(targetPosition.z - targetFrame.position.z) < 1

        if(isCorrectFrame) frameCandidate = targetFrame;
      }
    }

    if(!frameCandidate) console.log("What da fo?", targetPosition);

    return frameCandidate
  },

  nextFrameByDir(currentFrame, direction) {

    candidateFrames = this.framesWithin(1, currentFrame);

    nextFrame       = null;

    if(direction == 'West')  nextFrame = candidateFrames.filter(function(cf){
      return cf.x < currentFrame.x
    });

    return nextFrame;
  },


  getTraversableFrames: function() {
    left_offset = 11;
    traversable = []

    x_traversables = [
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
      [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20,21,22,23,24,25,26].map(function(i){ return i + left_offset}),
      [1,6,12,15,21,26].map(function(i){ return i + left_offset}),
      [1,6,12,15,21,26].map(function(i){ return i + left_offset}),
      [1,6,12,15,21,26].map(function(i){ return i + left_offset}),
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26].map(function(i){ return i + left_offset}),
      [1,6,9,18,21,26].map(function(i){ return i + left_offset}),
      [1,6,9,18,21,26].map(function(i){ return i + left_offset}),
      [1,2,3,4,5,6,9,10,11,12,15,16,17,18,21,22,23,24,25,26].map(function(i){ return i + left_offset}),
      [6,12,15,21].map(function(i){ return i + left_offset}),
      [6,12,15,21].map(function(i){ return i + left_offset}),
      [6,9,10,11,12,13,14,15,16,17,18,21].map(function(i){ return i + left_offset}),
      [6,9,18,21].map(function(i){ return i + left_offset}),
      [6,9,18,21].map(function(i){ return i + left_offset}),
      [0,1,2,3,4,5,6,7,8,9,18,19,20,21,22,23,24,25,26,27].map(function(i){ return i + left_offset}),
      [6,9,18,21].map(function(i){ return i + left_offset}),
      [6,9,18,21].map(function(i){ return i + left_offset}),
      [6,9,10,11,12,13,14,15,16,17,18,21].map(function(i){ return i + left_offset}),
      [6,9,18,21].map(function(i){ return i + left_offset}),
      [6,9,18,21].map(function(i){ return i + left_offset}),
      [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20,21,22,23,24,25,26].map(function(i){ return i + left_offset}),
      [1,6,12,15,21,26].map(function(i){ return i + left_offset}),
      [1,6,12,15,21,26].map(function(i){ return i + left_offset}), // 22
      [1,2,3,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21, 24,25,26].map(function(i){ return i + left_offset}),
      [3,6,9,18,21,24].map(function(i){ return i + left_offset}),
      [3,6,9,18,21,24].map(function(i){ return i + left_offset}),
      [1,2,3,4,5,6,9,10,11,12,15,16,17,18,21,22,23,24,25,26].map(function(i){ return i + left_offset}),
      [1,12,15,26].map(function(i){ return i + left_offset}), // 27
      [1,12,15,26].map(function(i){ return i + left_offset}),
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26].map(function(i){ return i + left_offset}),
    ]

    for(y = 0; y <= 40; y++){
      x_vals = x_traversables[y];

      for(i = 0; i < x_vals.length; i++){
        traversable.push({ x: x_vals[i], y: y })
      }
    }

    return traversable
  }



});
