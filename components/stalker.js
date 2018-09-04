
AFRAME.registerComponent('stalker', {

  schema: {
    targetEntity: { type: 'string', default: '' },
    initializationDotCount: {type: 'number', default: 0 }
  },

  init: function () {
    this.target = document.querySelector(this.data.targetEntity);
    this.el.addEventListener('hit', this.handleCollision.bind(this));
  },

  handleCollision: function(e){
    var detail = e.detail
    if(detail.el) console.log(detail)
  },

  tick: function() {
    if(!this.target) return;
    var targetLocation  = this.target.object3D.position;
    var sceneEl         = this.el.sceneEl;
    var currentDotCount = sceneEl.components.scoreboard.globalDotCounter;

    var isActive = currentDotCount >= this.data.initializationDotCount;

    this.el.setAttribute('nav-agent', { active: isActive, destination: targetLocation })
  }

});
