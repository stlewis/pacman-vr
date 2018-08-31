AFRAME.registerComponent('scoreboard', {

  init: function() {
    this.registerEventListeners = this.registerEventListeners.bind(this);

    this.registerEventListeners();
    this.resetDots()
  },

  registerEventListeners: function() {
    this.el.addEventListener('addPoints', this.addPoints.bind(this));
    this.el.addEventListener('boardClear', this.boardClear.bind(this));
  },

  addPoints: function(e){
    scoreEl    = document.querySelector('#score')
    scoreAttr  = scoreEl.getAttribute('text')
    scoreValue = parseInt(scoreAttr.value)

    scoreEl.setAttribute('text', { value: scoreValue + e.detail.points })
  },

  boardClear: function(e){
    var player = document.querySelector('a-entity[pac-man]')
    console.log(player)
    player.object3D.position.set(-23.9, 0, 0.739)

    this.resetDots() // Restore all dots.
  },

  resetDots: function() {
    var baseAtts = {
      material: {color: '#FFFFFF', metalness: 0.75, roughness: 0.7},
      radius: 0.25,
      dot: true
    }

    var positions = [
      {x: 0, y: 1, z: 26},
      {x: 0, y: 1, z: 24},
      {x: 0, y: 1, z: 22},
      {x: 0, y: 1, z: 20},
      {x: 0, y: 1, z: 18},
      {x: 0, y: 1, z: 16},
      {x: 0, y: 1, z: 14},
      {x: 0, y: 1, z: 12},
      {x: 0, y: 1, z: 10},
      {x: 0, y: 1, z: 8},
      {x: 0, y: 1, z: 6},
      {x: 0, y: 1, z: 4},
      {x: 0, y: 1, z: 2},
      {x: 0, y: 1, z: 0},
      {x: 0, y: 1, z: -2},
      {x: 0, y: 1, z: -4},
      {x: 0, y: 1, z: -6},
      {x: 0, y: 1, z: -8},
      {x: 0, y: 1, z: -10},
      {x: 0, y: 1, z: -12},
      {x: 0, y: 1, z: -14},
      {x: 0, y: 1, z: -16},
      {x: 0, y: 1, z: -18},
      {x: 0, y: 1, z: -20},
      {x: 0, y: 1, z: -22},
      {x: 0, y: 1, z: -24},

    ]

    for(i=0; i < positions.length; i++){
      var thisDot = document.createElement('a-pac-dot')

      for(attrName in baseAtts){
        thisDot.setAttribute(attrName, baseAtts[attrName])
      }

      thisDot.setAttribute('position', positions[i])

      document.querySelector("a-scene").appendChild(thisDot);
    }

  }

});
