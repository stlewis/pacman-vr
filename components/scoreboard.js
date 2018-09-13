AFRAME.registerComponent('scoreboard', {

  init: function() {
    this.registerEventListeners = this.registerEventListeners.bind(this);

    this.registerEventListeners();
    this.resetDots()

    this.globalDotCounter = 0;
  },

  registerEventListeners: function() {
    this.el.addEventListener('addPoints', this.addPoints.bind(this));
    this.el.addEventListener('dotEaten', this.handleDotEaten.bind(this));
    this.el.addEventListener('boardClear', this.boardClear.bind(this));
    this.el.addEventListener("dead", this.handleDeath.bind(this));
    this.el.addEventListener('trackpaddown', this.showScore.bind(this));
    this.el.addEventListener('trackpadup', this.hideScore.bind(this));
  },

  showScore: function(){
    document.querySelector('#score-wrapper').setAttribute('visible', true);
  },

  hideScore: function() {
    document.querySelector('#score-wrapper').setAttribute('visible', false);
  },

  handleDotEaten: function(e){
    this.globalDotCounter += 1;
    // When the global counter hits certain milestones, release a ghost
    // by activating their nav agent
  },

  addPoints: function(e){
    scoreEl    = document.querySelector('#score')
    panelEls   = document.querySelectorAll('.scorevalue')
    scoreAttr  = scoreEl.getAttribute('text')
    scoreValue = parseInt(scoreAttr.value)

    scoreEl.setAttribute('text', { value: scoreValue + e.detail.points })

    for(i = 0; i < panelEls.length; i++){
      panel = panelEls[i];

      panel.setAttribute('text', {value: scoreValue + e.detail.points })
    }
  },

  handleDeath: function(e){
    var player = document.querySelector('a-entity[teleportable]')
    var blinky = document.querySelector('#blinky-ghost');
    var pinky  = document.querySelector('#pinky-ghost');
    var inky   = document.querySelector('#inky-ghost');
    var clyde  = document.querySelector('#clyde-ghost');

    var blinkyStart = new THREE.Vector3;
    var pinkyStart  = new THREE.Vector3;
    var inkyStart   = new THREE.Vector3;
    var clydeStart  = new THREE.Vector3;

    blinkyCoords = blinky.getAttribute('starting-position').split(' ');
    pinkyCoords  = pinky.getAttribute('starting-position').split(' ');
    inkyCoords   = inky.getAttribute('starting-position').split(' ');
    clydeCoords  = clyde.getAttribute('starting-position').split(' ');

    blinkyStart.x = blinkyCoords[0]
    blinkyStart.y = blinkyCoords[1]
    blinkyStart.z = blinkyCoords[2]

    pinkyStart.x = pinkyCoords[0]
    pinkyStart.y = pinkyCoords[1]
    pinkyStart.z = pinkyCoords[2]

    inkyStart.x = inkyCoords[0]
    inkyStart.y = inkyCoords[1]
    inkyStart.z = inkyCoords[2]

    clydeStart.x = clydeCoords[0]
    clydeStart.y = clydeCoords[1]
    clydeStart.z = clydeCoords[2]


    blinky.setAttribute('position', blinkyStart);
    blinky.setAttribute('nav-agent', {active: false})

    pinky.setAttribute('position', pinkyStart);
    pinky.setAttribute('nav-agent', {active: false})

    inky.setAttribute('position', inkyStart);
    inky.setAttribute('nav-agent', {active: false})

    clyde.setAttribute('position', clydeStart);
    clyde.setAttribute('nav-agent', {active: false})


    player.object3D.position.set(-23.9, 0, 0.739)
  },

  boardClear: function(e){
    this.handleDeath(); // Fundamentally the same as a death as far as the board goes. Later we tweak difficulty here.
    this.resetDots();
    this.globalDotCounter = 0;
  },

  resetDots: function() {
    var baseAtts = {
      material: {color: '#FFFFFF', metalness: 0.75, roughness: 0.7},
      radius: 0.25,
      dot: true
    }

    var superAtts = {
      material: {color: '#FFFFFF', metalness: 0.75, roughness: 0.7},
      dot: true,
      geometry: "primitive: sphere; radius: 0.75",
      pointvalue: 50,
      grantsinvulnerability: true
    }

    var positions = [
      {x: -2, y: 1, z: 26},
      {x: -4, y: 1, z: 26},
      {x: -6, y: 1, z: 26},

      {x: -6, y: 1, z: 24},
      {x: -6, y: 1, z: 22},

      {x: -8, y: 1, z: 22},
      {x: -10, y: 1, z: 22},

      {x: -12, y: 1, z: 22},

      {x: -12, y: 1, z: 24},
      {x: -12, y: 1, z: 26, superDot: true},

      {x: -14, y: 1, z: 26},
      {x: -16, y: 1, z: 26},


      {x: -18, y: 1, z: 26},
      {x: -18, y: 1, z: 24},
      {x: -18, y: 1, z: 22},
      {x: -18, y: 1, z: 20},
      {x: -18, y: 1, z: 18},

      {x: -18, y: 1, z: 16},
      {x: -20, y: 1, z: 16},
      {x: -22, y: 1, z: 16},
      {x: -24, y: 1, z: 16},
      {x: -26, y: 1, z: 16},
      {x: -28, y: 1, z: 16},
      {x: -30, y: 1, z: 16},
      {x: -32, y: 1, z: 16},
      {x: -34, y: 1, z: 16},
      {x: -36, y: 1, z: 16},
      {x: -38, y: 1, z: 16},
      {x: -40, y: 1, z: 16},
      {x: -42, y: 1, z: 16},
      {x: -44, y: 1, z: 16},
      {x: -46, y: 1, z: 16},




      {x: -48, y: 1, z: -24},
      {x: -48, y: 1, z: -22},
      {x: -48, y: 1, z: -20},
      {x: -48, y: 1, z: -18},
      {x: -48, y: 1, z: -16},
      {x: -48, y: 1, z: -12},
      {x: -48, y: 1, z: -10},
      {x: -48, y: 1, z: -8},
      {x: -48, y: 1, z: -6},
      {x: -48, y: 1, z: -4},
      {x: -48, y: 1, z: -2},
      {x: -48, y: 1, z: 0},
      {x: -48, y: 1, z: 2},
      {x: -48, y: 1, z: 4},
      {x: -48, y: 1, z: 6},
      {x: -48, y: 1, z: 8},
      {x: -48, y: 1, z: 10},
      {x: -48, y: 1, z: 12},
      {x: -48, y: 1, z: 14},
      {x: -48, y: 1, z: 16},
      {x: -48, y: 1, z: 18},
      {x: -48, y: 1, z: 20},
      {x: -48, y: 1, z: 22},
      {x: -48, y: 1, z: 24},
      {x: -48, y: 1, z: 26},



      {x: -50, y: 1, z: 16},
      {x: -52, y: 1, z: 16},
      {x: -54, y: 1, z: 16},
      {x: -56, y: 1, z: 16},

      {x: -18, y: 1, z: 14},
      {x: -18, y: 1, z: 12},
      {x: -18, y: 1, z: 10},
      {x: -18, y: 1, z: 8},
      {x: -18, y: 1, z: 6},

      {x: -6, y: 1, z: 20},
      {x: -6, y: 1, z: 18},

      {x: -6, y: 1, z: 16},
      {x: -8, y: 1, z: 16},
      {x: -10, y: 1, z: 16},

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

      {x: -2, y: 1, z: 4},
      {x: -4, y: 1, z: 4},

      {x: -6, y: 1, z: 4},

      {x: -6, y: 1, z: 6},
      {x: -6, y: 1, z: 6},
      {x: -6, y: 1, z: 8},
      {x: -6, y: 1, z: 10},

      {x: -8, y: 1, z: 10},
      {x: -10, y: 1, z: 10},


      {x: -12, y: 1, z: 16},
      {x: -14, y: 1, z: 16},
      {x: -16, y: 1, z: 16},



      {x: -12, y: 1, z: 16},
      {x: -12, y: 1, z: 14},
      {x: -12, y: 1, z: 12},
      {x: -12, y: 1, z: 10},
      {x: -12, y: 1, z: 8},
      {x: -12, y: 1, z: 6},

      {x: -12, y: 1, z: 4},
      {x: -14, y: 1, z: 4},
      {x: -16, y: 1, z: 4},
      {x: -18, y: 1, z: 4},

      {x: -12, y: 1, z: -2},

      {x: -14, y: 1, z: -2},
      {x: -16, y: 1, z: -2},
      {x: -18, y: 1, z: -2},

      {x: -12, y: 1, z: -4},
      {x: -12, y: 1, z: -6},


      {x: 0, y: 1, z: 2},
      {x: 0, y: 1, z: 0},
      {x: 0, y: 1, z: -2},

      {x: -2, y: 1, z: -2},
      {x: -4, y: 1, z: -2},
      {x: -6, y: 1, z: -2},

      {x: -6, y: 1, z: -4},
      {x: -6, y: 1, z: -6},
      {x: -6, y: 1, z: -8},


      {x: -8, y: 1, z: -8},
      {x: -10, y: 1, z: -8},

      {x: -12, y: 1, z: -8},
      {x: -12, y: 1, z: -10},
      {x: -12, y: 1, z: -12},


      {x: -12, y: 1, z: -14},
      {x: -14, y: 1, z: -14},
      {x: -16, y: 1, z: -14},

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
      {x: -2, y: 1, z: -24},
      {x: -4, y: 1, z: -24},
      {x: -6, y: 1, z: -24},


      {x: -6, y: 1, z: -22},


      {x: -6, y: 1, z: -20},

      {x: -8, y: 1, z: -20},
      {x: -10, y: 1, z: -20},

      {x: -12, y: 1, z: -20},
      {x: -12, y: 1, z: -22},
      {x: -12, y: 1, z: -24, superDot: true},

      {x: -14, y: 1, z: -24},
      {x: -16, y: 1, z: -24},

      {x: -18, y: 1, z: -24},
      {x: -18, y: 1, z: -22},
      {x: -18, y: 1, z: -20},
      {x: -18, y: 1, z: -18},
      {x: -18, y: 1, z: -16},

      {x: -18, y: 1, z: -14},
      {x: -20, y: 1, z: -14},
      {x: -22, y: 1, z: -14},
      {x: -24, y: 1, z: -14},
      {x: -26, y: 1, z: -14},
      {x: -28, y: 1, z: -14},
      {x: -30, y: 1, z: -14},
      {x: -32, y: 1, z: -14},
      {x: -34, y: 1, z: -14},
      {x: -36, y: 1, z: -14},
      {x: -38, y: 1, z: -14},
      {x: -40, y: 1, z: -14},
      {x: -42, y: 1, z: -14},
      {x: -44, y: 1, z: -14},
      {x: -46, y: 1, z: -14},
      {x: -48, y: 1, z: -14},
      {x: -50, y: 1, z: -14},
      {x: -52, y: 1, z: -14},
      {x: -54, y: 1, z: -14},
      {x: -56, y: 1, z: -14},



      {x: -18, y: 1, z: -12},
      {x: -18, y: 1, z: -10},
      {x: -18, y: 1, z: -8},
      {x: -18, y: 1, z: -6},
      {x: -18, y: 1, z: -4},



      {x: -6, y: 1, z: -18},
      {x: -6, y: 1, z: -16},
      {x: -6, y: 1, z: -14},
      {x: -8, y: 1, z: -14},
      {x: -10, y: 1, z: -14},


      {x: -46, y: 1, z: 10},
      {x: -44, y: 1, z: 10},
      {x: -42, y: 1, z: 10},

      {x: -46, y: 1, z: -8},
      {x: -44, y: 1, z: -8},
      {x: -42, y: 1, z: -8},
      {x: -42, y: 1, z: -6},
      {x: -42, y: 1, z: -4},
      {x: -42, y: 1, z: -2},

      {x: -42, y: 1, z: 8},
      {x: -42, y: 1, z: 6},
      {x: -42, y: 1, z: 4},

      {x: -42, y: 1, z: 18},
      {x: -42, y: 1, z: 20},
      {x: -42, y: 1, z: 22},
      {x: -42, y: 1, z: 24},
      {x: -42, y: 1, z: 26},

      {x: -42, y: 1, z: -14},
      {x: -42, y: 1, z: -16},
      {x: -42, y: 1, z: -18},
      {x: -42, y: 1, z: -20},
      {x: -42, y: 1, z: -22},
      {x: -42, y: 1, z: -24},

      {x: -44, y: 1, z: 26},
      {x: -46, y: 1, z: 26},
      {x: -50, y: 1, z: 26},
      {x: -52, y: 1, z: 26, superDot: true},
      {x: -54, y: 1, z: 26},
      {x: -56, y: 1, z: 26},


      {x: -44, y: 1, z: -24},
      {x: -46, y: 1, z: -24},
      {x: -50, y: 1, z: -24},
      {x: -52, y: 1, z: -24, superDot: true},
      {x: -54, y: 1, z: -24},
      {x: -56, y: 1, z: -24},

      {x: -48, y: 1, z: 4},
      {x: -50, y: 1, z: 4},
      {x: -52, y: 1, z: 4},
      {x: -54, y: 1, z: 4},
      {x: -56, y: 1, z: 4},

      {x: -50, y: 1, z: -2},
      {x: -52, y: 1, z: -2},
      {x: -54, y: 1, z: -2},
      {x: -56, y: 1, z: -2},

      {x: -56, y: 1, z: 26},
      {x: -56, y: 1, z: 24},
      {x: -56, y: 1, z: 22},
      {x: -56, y: 1, z: 20},
      {x: -56, y: 1, z: 18},
      {x: -56, y: 1, z: 14},
      {x: -56, y: 1, z: 12},
      {x: -56, y: 1, z: 10},
      {x: -56, y: 1, z: 8},
      {x: -56, y: 1, z: 6},


      {x: -56, y: 1, z: -4},
      {x: -56, y: 1, z: -6},
      {x: -56, y: 1, z: -8},
      {x: -56, y: 1, z: -10},
      {x: -56, y: 1, z: -12},
      {x: -56, y: 1, z: -16},
      {x: -56, y: 1, z: -18},
      {x: -56, y: 1, z: -20},
      {x: -56, y: 1, z: -22}

    ]

    for(i=0; i < positions.length; i++){
      var thisDot = document.createElement('a-pac-dot')

      for(attrName in baseAtts){
        thisDot.setAttribute(attrName, baseAtts[attrName])
      }

      if(positions[i].color){
        thisDot.setAttribute('color', positions[i].color)
      }

      if(positions[i].superDot){
        for(attrName in superAtts){
          thisDot.setAttribute(attrName, superAtts[attrName])
        }
      }else{
        for(attrName in baseAtts){
          thisDot.setAttribute(attrName, baseAtts[attrName])
        }
      }

      thisDot.setAttribute('position', positions[i])

      document.querySelector("a-scene").appendChild(thisDot);
    }

  }

});
