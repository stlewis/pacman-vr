AFRAME.registerSystem('pac-maze', {

  init: function() {
    //this.el.addEventListener('model-loaded', this.initializeFrameArray());
  },

  update: function() {
    this.initializeFrameArray();
  },

  initializeFrameArray: function() {
    var self        = this;
    this.frameArray = []
    var lastX       = -58

    for(j = 0; j <= 33; j++){
      var xPos     = lastX + 2
      lastX        = xPos
      var frameRow = [ {position: {x: xPos, y: 0, z: 28 } } ];

      for(i = 1; i < 28; i++){
        lastZ = frameRow[i - 1].position.z
        thisZ = lastZ - 2

        thisPosition = { x: xPos, y: 1, z: thisZ }
        navAgent = this.el.systems.nav

        vec3Pos = new THREE.Vector3(thisPosition.x, thisPosition.y, thisPosition.z)
        group = navAgent.getGroup(vec3Pos);

        console.log("Group:", group)

        isTraversable = false
        path = navAgent.getPath(thisPosition, thisPosition, group) || [];
        frameRow.push({ position: thisPosition, traversable: isTraversable })
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

        distance = this.distanceBetween({x: j, y: i}, {x: centerFrame.x, y: centerFrame.y})

        if(distance <= targetDistance) frames.push(targetFrame);
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

    return xDistance + yDistance
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
  }



});
