AFRAME.registerSystem('pac-maze', {

  init: function() {
    this.initializeFrameArray();
  },

  initializeFrameArray: function() {
    var self              = this;
    this.frameArray       = []
    var lastX             = -58
    var traversableFrames = this.getTraversableFrames();

    for(j = 1; j <= 33; j++){
      xPos     = lastX + 2
      lastX        = xPos
      frameRow = [ {position: {x: xPos, y: 0, z: 28 } } ];

      for(i = 1; i < 28; i++){
        lastZ = frameRow[i - 1].position.z
        thisZ = lastZ - 2

        thisPosition = { x: xPos, y: 0, z: thisZ }
        isTraversable = traversableFrames.filter(function(frame){ return frame.x == i && frame.y == j   }).length == 1
        frameRow.push({ position: thisPosition, traversable: isTraversable, x: i, y: j })
      }

      this.frameArray.push(frameRow);

    }

  },

  framesWithin: function(targetDistance, centerFrame){
    frames = [];

    for(j = 0; j < this.frameArray.length; j++){
      row = this.frameArray[j];

      for(i = 0; i < row.length; i++){
        targetFrame = this.frameArray[j][i];

        distance = this.distanceBetween({x: i, y: j}, {x: centerFrame.x, y: centerFrame.y})

        if(distance <= targetDistance && targetFrame != centerFrame) frames.push(targetFrame);
      }
    }

    return frames;
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

    return frameCandidate
  },


  getTraversableFrames: function() {
    traversable = []

    x_traversables = [
      [],
      [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20,21,22,23,24,25,26],
      [1,6,12,15,21,26],
      [1,6,12,15,21,26],
      [1,6,12,15,21,26],
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26],
      [1,6,9,18,21,26],
      [1,6,9,18,21,26],
      [1,2,3,4,5,6,9,10,11,12,15,16,17,18,21,22,23,24,25,26],
      [6,12,15,21],
      [6,12,15,21],
      [6,9,10,11,12,13,14,15,16,17,18,21],
      [6,9,18,21],
      [6,9,18,21],
      [0,1,2,3,4,5,6,7,8,9,18,19,20,21,22,23,24,25,26,27],
      [6,9,18,21],
      [6,9,18,21],
      [6,9,10,11,12,13,14,15,16,17,18,21],
      [6,9,18,21],
      [6,9,18,21],
      [1,2,3,4,5,6,7,8,9,10,11,12,15,16,17,18,19,20,21,22,23,24,25,26],
      [1,6,12,15,21,26],
      [1,6,12,15,21,26], // 22
      [1,2,3,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21, 24,25,26],
      [3,6,9,18,21,24],
      [3,6,9,18,21,24],
      [1,2,3,4,5,6,9,10,11,12,15,16,17,18,21,22,23,24,25,26],
      [1,12,15,26], // 27
      [1,12,15,26],
      [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26]
    ]

    for(y = 0; y <= 29; y++){
      x_vals = x_traversables[y];

      for(i = 0; i < x_vals.length; i++){
        traversable.push({ x: x_vals[i], y: y })
      }
    }

    return traversable
  }



});
