/*jslint node: true */
'use strict';

window.game2d = window.game2d || {};

window.game2d.render = window.game2d.render || {};

window.game2d.render.playerSize = 30;
window.game2d.render.baseLevel = 90;
window.game2d.render.objects = [];

window.game2d.render.addObject = function(whichObj){
    window.game2d.render.objects.push(whichObj);
};

window.game2d.render.drawPlayer = function(canvasElement, player, playerSize){
    var centerX = canvasElement.width/2;
    var baseLevel = canvasElement.height/100 * window.game2d.render.baseLevel;
    // estoy mezclando coordenadas metidas en el player con tamanyos metidos en el renderer; 
    // todo lo que convierte a pixels deberia ir junto en render y player solo deberia tener
    // algo muy abstracto...
    // Pero lo que quiero hacer ahora es basicamente controlar el movimiento; lo arreglare mas tarde
    var playerPosY = baseLevel - player.ypos - playerSize;
    var context = canvasElement.getContext('2d');
    context.beginPath();
    context.arc(centerX, playerPosY, playerSize, 0, 2 * Math.PI, false);
    context.fillStyle = 'blue';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.stroke();
    return 0;
};

window.game2d.render.drawTerrain = function(canvasElement){
    var context = canvasElement.getContext('2d');
    context.beginPath();
    context.clearRect(0,0,canvasElement.width,canvasElement.height);
    context.fillStyle = 'red';
    context.rect(0, canvasElement.height/100 * window.game2d.render.baseLevel, 
        canvasElement.width, canvasElement.height);
    context.fill();
    return 0;
};

window.game2d.render.redrawGame = function() {
    var canvasElement = document.getElementById('gameCanvas');
    window.game2d.render.drawTerrain(canvasElement);
    for (let i = 0; i < window.game2d.render.objects.length ; i++){
        window.game2d.render.drawPlayer(canvasElement, window.game2d.render.objects[i], window.game2d.render.playerSize);
    }
    requestAnimationFrame(window.game2d.render.redrawGame);
}
requestAnimationFrame(window.game2d.render.redrawGame);

