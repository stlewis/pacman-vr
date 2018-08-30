AFRAME.registerComponent('camera-lock', {

  init: function() {
    var self = this;

    window.onload = function(e) {
      var positionString = window.localStorage.getItem('cameraPosition');
      var rotationString = window.localStorage.getItem('cameraRotation');

      var storedPosition = positionString ? JSON.parse(positionString) : null

      if(storedPosition) self.el.setAttribute('position', storedPosition)
    }

    window.onbeforeunload = function(e){
      var currentPosition = self.el.getAttribute('position');
      window.localStorage.setItem('cameraPosition', JSON.stringify(currentPosition))
    }
  },

});
