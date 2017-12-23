/*jslint node: true */
'use strict';

var player = {
    xpos: 0,
    ypos: 0,
    xvel: 0,
    yvel: 0,

}

window.game2d.physics.addObject(player);
window.game2d.controller.bindPlayerToControls(player);
window.game2d.render.addObject(player);