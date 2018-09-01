AFRAME.registerComponent('pac-man', {
  init: function(){
  },

  tick: function() {
    if(this.el.is("collided")){
      this.el.emit("dead");
    }
  }

});
