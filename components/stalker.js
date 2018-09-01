
AFRAME.registerComponent('stalker', {

  schema: {
    targetEntity: { type: 'string', default: '' }
  },

  init: function () {
    console.log("Ready to stalk!")
    this.target = document.querySelector(this.data.targetEntity);
  },

  tick: function() {
    var targetLocation = this.target.object3D.position;
    this.el.setAttribute('nav-agent', { active: true, destination: targetLocation })
  }

});
