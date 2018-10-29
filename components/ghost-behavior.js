AFRAME.registerComponent('ghost-behavior', {
  schema: {
    ghostName: { default: '' },
    dotCount: { default: 0 }
  },

  init: function() {
    this.targetFrame      = null;
    this.destinationFrame = null;
    this.currentFrame     = null;
    this.previousFrame    = null;
  },

  tick: function() {
    this.pacMaze = document.querySelector('a-entity[pac-maze]').components['pac-maze'];
    this.setTargetFrame();

    if(this.pacMaze) {
      marker = document.querySelector('.marker');
      if(marker) document.querySelector('a-scene').removeChild(marker);
      this.pacMaze.paintFrame(this.targetFrame, 'yellow');
    }


  },

  setDestinationFrame: function() {

  }

  setTargetFrame: function() {
    this.pacMaze = document.querySelector('a-entity[pac-maze]').components['pac-maze'];
    if(!this.pacMaze) return null;

    this.targetFrame = this.pacMaze.frameArray[17][11];
  },


});
