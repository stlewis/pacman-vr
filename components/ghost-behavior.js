AFRAME.registerComponent('ghost-behavior', {
  schema: {
    ghostName: { default: '' },
    dotCount: { default: 0 }
  },

  init() {
    this.targetFrame      = null;
    this.destinationFrame = null;
    this.currentFrame     = null;
    this.previousFrame    = null;
    this.pacMaze          = this.el.sceneEl.systems['pac-maze'];
  },

  tick() {
    this.setTargetFrame();

    if(this.pacMaze) {
      let marker = document.querySelector('.marker');
      if(marker) document.querySelector('a-scene').removeChild(marker);
      this.pacMaze.paintFrame(this.targetFrame, 'yellow');
    }


  },

  setDestinationFrame() {

  },

  setTargetFrame() {
    if(!this.pacMaze) return null;

    this.targetFrame = this.pacMaze.frameArray[17][11];
  }


});
