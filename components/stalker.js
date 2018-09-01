
AFRAME.registerComponent('stalker', {

  schema: {
    targetEntity: { type: 'string', default: '' }
  },

  init: function () {
    console.log("Ready to stalk!")
    this.target = document.querySelector(this.data.targetEntity);
    this.el.addEventListener('hit', this.handleCollision.bind(this));
  },

  handleCollision: function(e){
    var detail = e.detail
    if(detail.el) console.log(detail)
  },

  tick: function() {
    var targetLocation = this.target.object3D.position;
    this.el.setAttribute('nav-agent', { active: true, destination: targetLocation })
  }

});
