AFRAME.registerComponent('scoreboard', {

  init: function() {
    this.registerEventListeners = this.registerEventListeners.bind(this);

    this.registerEventListeners();
  },

  registerEventListeners: function() {
    this.el.addEventListener('addPoints', function(e){
      scoreEl    = document.querySelector('#score')
      scoreAttr  = scoreEl.getAttribute('text')
      scoreValue = parseInt(scoreAttr.value)

      scoreEl.setAttribute('text', { value: scoreValue + e.detail.points })
    });
  }

});
