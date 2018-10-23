AFRAME.registerSystem('pac-maze', {

  init() {
    this.rowCount = 35;
    this.colCount = 38;
    this.initializeFrameArray();
  },

  initializeFrameArray() {
    this.frameArray = [];
    let y;
    let x;

    for(y = 0; y <= this.rowCount; y++) {
      this.frameArray[y] = this.frameArray[y] ? this.frameArray[y] : []
      for(x = 0; x <= this.colCount; x++) {
        const frame                 = {x: x, y: y};
        const posFromFrame          = this.positionFromFrame(frame);

        frame['position']     = posFromFrame;
        frame['traversable']  = this.checkTraversable(frame);
        frame['hasDot']       = this.checkDot(frame);
        this.frameArray[y][x] = frame;
      }
    }

    const originFrame = this.frameArray[17][11];
    const adjacentFrames = this.framesAtDistance(4, originFrame, true);
    const self = this;

    adjacentFrames.forEach(function(fr){ self.paintFrame(fr, 'green');  })
  },

  positionFromFrame(frame) {
    const zeroPoint    = -34;
    const scaleFactor  = 2;
    const increaseXBy  = frame.x * scaleFactor;
    const increaseYBy  = frame.y * scaleFactor;

    return {x: zeroPoint + increaseXBy, z: zeroPoint + increaseYBy, y: 0.5 }
  },

  nextFrameByDir(direction, frame) {
    const candidateFrames = this.framesWithinDistance(1, frame);
    let nextFrame         = null;

    switch(direction){
      case 'North':
        nextframe = candidateframes.filter(function(fr){
          return fr.x == frame.x && fr.y < frame.y
        })[0];
        break;
      case 'South':
        nextframe = candidateframes.filter(function(fr){
          return fr.x == frame.x && fr.y > frame.y
        })[0];
        break;
      case 'East':
        nextframe = candidateframes.filter(function(fr){
          return fr.x < frame.x && fr.y == frame.y
        })[0];
        break;
      case 'West':
        nextframe = candidateframes.filter(function(fr){
          return fr.x > frame.x && fr.y == frame.y
        })[0];
        break;
    }

    return nextFrame
  },

  framesWithinDistance(distance, frame, traversableOnly) {
    let frames = []
    let y;
    let x;

    for(y = 0; y <= this.rowCount; y++) {
      for(x = 0; x <= this.colCount; x++) {
        const candidate = this.frameArray[y][x];
        const frameDistance = this.frameDistanceBetween(frame, candidate)

        if(frameDistance <= distance && frameDistance != 0){
          if(traversableOnly) {
            if(candidate.traversable) frames.push(candidate);
          } else {
            frames.push(candidate);
          }
        }
      }
    }

    return frames;
  },

  framesAtDistance(distance, frame, traversableOnly) {
    let frames = []
    let y;
    let x;

    for(y = 0; y <= this.rowCount; y++) {
      for(x = 0; x <= this.colCount; x++) {
        const candidate = this.frameArray[y][x];

        if(this.frameDistanceBetween(frame, candidate) == distance){
          if(traversableOnly) {
            if(candidate.traversable) frames.push(candidate);
          } else {
            frames.push(candidate);
          }
        }
      }
    }

    return frames;
  },

  frameDistanceBetween(origin, destination) {
    const destinationX = destination.x
    const destinationY = destination.y;
    const originX = origin.x;
    const originY = origin.y;

    const xDistance = Math.abs(destinationX - originX);
    const yDistance = Math.abs(destinationY - originY);

    const result = xDistance + yDistance

    return result
  },


  paintFrames(onlyTraversable, onlyDot) {
    let y;
    let x;

    for(y = 0; y <= this.rowCount; y++) {
      for(x = 0; x <= this.colCount; x++) {
        let frame  = this.frameArray[y][x];

        if(onlyTraverseable) {
          if(frame.traverseable) this.paintFrame(frame);

        } else if(onlyDot) {
          if(frame.hasDot) this.paintFrame(frame);
        } else {
          this.paintFrame(frame)
        }
      }
    }
  },

  paintFrame(frame, color) {
    color = color ? color : 'red';

    const marker = document.createElement('a-cylinder');

    marker.setAttribute('height', 2);
    marker.setAttribute('radius', 0.5);
    marker.setAttribute('material', 'opacity: 0.5;');
    marker.setAttribute('color', color)
    marker.setAttribute('position', frame.position);
    marker.setAttribute('class', 'marker');

    document.querySelector('a-scene').appendChild(marker);
  },

  checkTraversable(frame) {
    const traversableKey = [
      [],
      [],
      [],
      [], // 3
      [20], // 4
      [5, 6, 7, 8, 11, 12, 13, 14, 20, 26, 27, 28, 29, 30, 31, 32, 33], // 5
      [5, 8, 11, 14, 20, 26, 29, 33], // 6
      [5, 8, 9, 10, 11, 14, 20, 26, 29, 33], // 7
      [5, 8, 14, 20, 26, 29, 33], // 8
      [5, 8, 14, 20, 26, 29, 33], // 9
      [5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], // 10
      [5, 11, 14, 20, 29, 33], // 11
      [5, 11, 14, 20, 29, 33], // 12
      [5, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28, 29, 33], //13
      [5, 8, 11, 14, 17, 23, 26, 29, 33], //14
      [5, 8, 11, 14, 17, 23, 26, 29, 33], // 15
      [5, 6, 7, 8, 11, 12, 13, 14, 17, 23, 24, 25, 26, 29, 30, 31, 32, 33], // 16
      [5, 11, 17, 23, 29], // 17
      [5, 11, 17, 23, 29], // 18
      [5, 6, 7, 8, 11, 12, 13, 14, 17, 23, 24, 25, 26, 29, 30, 31, 32, 33], // 19
      [5, 8, 11, 14, 17, 23, 26, 29, 33], // 20
      [5, 8, 11, 14, 17, 23, 26, 29, 33], // 21
      [5, 8, 9, 10, 11, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 26, 27, 28, 29, 33], // 22
      [5, 11, 14, 20, 29, 33], // 23
      [5, 11, 14, 20, 29, 33], // 24
      [5, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33], // 25
      [5, 8, 14, 20, 26, 29, 33], // 26
      [5, 8, 14, 20, 26, 29, 33], // 27
      [5, 8, 9, 10, 11, 14, 20, 26, 29, 33], // 28
      [5, 8, 11, 14, 20, 26, 29, 33], // 29
      [5, 6, 7, 8, 11, 12, 13, 14, 20, 26, 27, 28, 29, 30, 31, 32, 33], // 30
      [20], // 31
      [],
      [],
      [],
      []
    ];

    return traversableKey[frame.y].indexOf(frame.x) != -1;
  },

  checkSuperDot(frame) {
    const superDotFrames = [
      { x: 11, y: 6 },
      { x: 11, y: 30 },
      { x: 31, y: 4 },
      { x: 31, y: 30 }
    ]

    const self = this;
    return superDotFrames.filter(function(sf){ return self.sameFrame(frame, sf)  }).length == 1;
  },

  checkDot(frame) {
    const noDotFrames = [

      { x: 11, y: 17 },
      { x: 11, y: 18 },

      { x: 15, y: 13 },
      { x: 15, y: 22 },

      { x: 16, y: 13 },
      { x: 16, y: 22 },

      { x: 17, y: 13 },
      { x: 17, y: 14 },
      { x: 17, y: 15 },
      { x: 17, y: 16 },
      { x: 17, y: 17 },
      { x: 17, y: 18 },
      { x: 17, y: 19 },
      { x: 17, y: 20 },
      { x: 17, y: 21 },
      { x: 17, y: 22 },

      { x: 18, y: 13 },
      { x: 18, y: 22 },

      { x: 19, y: 13 },
      { x: 19, y: 15 },
      { x: 19, y: 16 },
      { x: 19, y: 17 },
      { x: 19, y: 18 },
      { x: 19, y: 19 },
      { x: 19, y: 20 },
      { x: 19, y: 22 },

      { x: 20,  y: 4 },
      { x: 20,  y: 5 },
      { x: 20,  y: 6 },
      { x: 20,  y: 7 },
      { x: 20,  y: 8 },
      { x: 20,  y: 9 },
      { x: 20,  y: 11 },
      { x: 20,  y: 12 },
      { x: 20,  y: 13 },
      { x: 20,  y: 15 },
      { x: 20,  y: 16 },
      { x: 20,  y: 17 },
      { x: 20,  y: 18 },
      { x: 20,  y: 19 },
      { x: 20,  y: 20 },
      { x: 20,  y: 22 },
      { x: 20,  y: 23 },
      { x: 20,  y: 24 },
      { x: 20,  y: 26 },
      { x: 20,  y: 27 },
      { x: 20,  y: 28 },
      { x: 20,  y: 29 },
      { x: 20,  y: 30 },
      { x: 20,  y: 31 },

      { x: 21, y: 13 },
      { x: 21, y: 15 },
      { x: 21, y: 16 },
      { x: 21, y: 17 },
      { x: 21, y: 18 },
      { x: 21, y: 21 },
      { x: 21, y: 20 },
      { x: 21, y: 22 },

      { x: 22, y: 13 },
      { x: 22, y: 17 },
      { x: 22, y: 18 },
      { x: 22, y: 22 },

      { x: 23, y: 13 },
      { x: 23, y: 14 },
      { x: 23, y: 15 },
      { x: 23, y: 16 },
      { x: 23, y: 17 },
      { x: 23, y: 18 },
      { x: 23, y: 19 },
      { x: 23, y: 20 },
      { x: 23, y: 21 },
      { x: 23, y: 22 },

      { x: 24, y: 16 },
      { x: 24, y: 19 },

      { x: 25, y: 16 },
      { x: 25, y: 19 },

    ]

    return frame.traversable && !this.frameInSet(frame, noDotFrames);
  },

  frameInSet(frame, frameSet) {
    const withX = frameSet.filter(function(fr){ return fr.x == frame.x });
    const withY = withX.filter(function(fr){ return fr.y == frame.y })[0];

    return withY ? true : false;
  },

  sameFrame(a, b) {
    // FIXME Replace with AFRAME Util
    const ax = a.x
    const bx = b.x
    const ay = a.y
    const by = b.y

    if(ax != bx) return false;
    if(ay != by) return false;

    return true;
  },

});
