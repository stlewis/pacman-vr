AFRAME.registerComponent('scoreboard', {

  init: function() {
    this.registerEventListeners = this.registerEventListeners.bind(this);

    this.registerEventListeners();
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
    var player = document.querySelector('a-entity[pac-man]').parentNode
    console.log(player)
    player.object3D.position.set(0, 0, 0)

    this.resetDots() // Restore all dots.
  },

  resetDots: function() {
    var baseAtts = {
      material: {color: '#FFFFFF', metalness: 0.75, roughness: 0.7},
      radius: 0.25,
      dot: true
    }

    var positions = [
      {x: 0, y: 1, z: -5},
      {x: 0, y: 1, z: -10},
      {x: 0, y: 1, z: -15},
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
