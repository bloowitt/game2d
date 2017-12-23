/*jslint node: true */
'use strict';

window.game2d = window.game2d || {};

window.game2d.controller = window.game2d.controller || {};

window.game2d.controller.player = {};

window.game2d.controller.bindPlayerToControls = function(whichObj){
    window.game2d.controller.player = whichObj;
};

window.game2d.controller.keyStatus = {
    _pressed: {},
  
    LEFT: 37,
    UP: 38,
    RIGHT: 39,
    DOWN: 40,
    
    isDown: function(keyCode) {
      return this._pressed[keyCode];
    },
    
    onKeydown: function(event) {
      this._pressed[event.keyCode] = true;
    },
    
    onKeyup: function(event) {
      delete this._pressed[event.keyCode];
    }
};

window.addEventListener('keyup', function(event) { window.game2d.controller.keyStatus.onKeyup(event); }, false);
window.addEventListener('keydown', function(event) { window.game2d.controller.keyStatus.onKeydown(event); }, false);

window.game2d.controller.updatePlayer = function(){
    let player = window.game2d.controller.player;
    if (window.game2d.controller.keyStatus.isDown(window.game2d.controller.keyStatus.UP)){
        if (player.ypos < 30) {
            if (player.yvel >= -1){
                player.yvel = 60;
            }
        }
    }
    requestAnimationFrame(window.game2d.controller.updatePlayer);
}
requestAnimationFrame(window.game2d.controller.updatePlayer);