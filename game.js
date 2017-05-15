/*jslint node: true */
'use strict';

window.game2d = window.game2d || {};

// MODEL PARTS
window.game2d.model = window.game2d.model || {};
window.game2d.model.terrain = 
[
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,2,2,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,2,2,0,0,0,0,1,1,0,1,1,1,1,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,0,1],
[1,1,1,0,1,1,1,1,1,1,1,0,1,1,1,1,0,0,0,0,0,0,0,1,0,0,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,2,2,2,0,0,0,1,0,0,0,0,0,1,0,1,1,1,1],
[1,1,1,1,1,1,1,0,0,2,3,2,0,0,0,1,1,1,0,1,1,1,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,2,2,2,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
[1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

window.game2d.model.player = { pos: {x:1.0, y:8.0}, vtr: {x:0, y:0}, speed: 2};

// CONTROLLER PARTS
window.game2d.controller = window.game2d.controller || {};
window.game2d.controller.decreaseAbsValueByAmount = function(quantity, amount){
    // Assuming amount is positive 
    if (quantity < 0) {
        return quantity + amount;
    } else {
        return quantity - amount;
    }
};

window.game2d.controller.getUpdatedVector = function(playerVector, keyStatus, speed) {
    var x = playerVector.x; 
    var y = playerVector.y;
    var capAbsValue = function(value, cap){
        var valueAbs = Math.abs(value);
        if (valueAbs > cap){
            return cap * valueAbs/value; 
        }
        return value;
    };
    if (keyStatus.isDown(keyStatus.UP)){
        y -= 1;
    }
    if (keyStatus.isDown(keyStatus.DOWN)){
        y += 1;
    }
    if (keyStatus.isDown(keyStatus.RIGHT)){
        x += 1;
    }
    if (keyStatus.isDown(keyStatus.LEFT)){
        x -= 1;
    }
    // reduce the movement by the speed for this iteration
    x = x - x * speed;
    y = y - y * speed;
    return {x: capAbsValue(x, 1), y: capAbsValue(y, 1)};
};

window.game2d.controller.getUpdatedPosition= function(pos, vtr, terrain, speed){
    var maintainWithinBounds = function(value, minBound, maxBound){
        if (value < minBound){
            return minBound;
        }
        if (value > maxBound){
            return maxBound;
        }
        return value;
    };
    var x = pos.x + vtr.x * speed;
    var y = pos.y + vtr.y * speed;
    if (terrain[Math.floor(y)][Math.floor(x+0.5)] == 1){
        x = Math.floor(x) +0.5;
    }
    if (terrain[Math.floor(y)][Math.floor(x-0.5)] == 1){
        x = Math.floor(x) +0.5;
    }
    if (terrain[Math.floor(y+0.5)][Math.floor(x)] == 1){
        y = Math.floor(y) + 0.5;
    }
    if (terrain[Math.floor(y-0.5)][Math.floor(x)] == 1){
        y = Math.floor(y) + 0.5;
    }
    return {x: maintainWithinBounds(x, 0, terrain[0].length), y: maintainWithinBounds(y, 0, terrain.length)};
};

window.game2d.controller.moveStuff = function(){
    if (window.game2d.controller.lastTick === undefined){
        window.game2d.controller.lastTick = Date.now();
    }
    var now = Date.now();
    var ellapsedSeconds = (now - window.game2d.controller.lastTick)/1000;
    var playerData = window.game2d.model.player;
    var keyStatus = window.game2d.controller.keyStatus;
    var speed = playerData.speed * ellapsedSeconds;
    playerData.vtr = window.game2d.controller.getUpdatedVector(playerData.vtr, keyStatus, speed);
    playerData.pos = window.game2d.controller.getUpdatedPosition(playerData.pos, playerData.vtr, window.game2d.model.terrain, speed);
    window.game2d.controller.lastTick = now;
    requestAnimationFrame(window.game2d.controller.moveStuff); 
};
requestAnimationFrame(window.game2d.controller.moveStuff);

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

// RENDER PARTS
window.game2d.render = window.game2d.render || {};

window.game2d.render.playerSize = 40;
window.game2d.render.tileData = {
    size : 90,
    colours : [
    '#4d1a00',
    '#f5f5d6',
    '#00ccff',
    '#9933ff'
]};

window.game2d.render.drawPlayer = function(canvasElement, player, playerSize){
    var centerX = canvasElement.width/2;
    var centerY = canvasElement.height/2;
    var context = canvasElement.getContext('2d');
    context.beginPath();
    context.arc(centerX, centerY, playerSize, 0, 2 * Math.PI, false);
    context.fillStyle = 'blue';
    context.fill();
    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.stroke();
    return 0;
};

window.game2d.render.drawTerrain = function(canvasElement, playerPos, tileData, terrain){
    var centerX = canvasElement.width/2;
    var centerY = canvasElement.height/2;
    var context = canvasElement.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0,0,canvasElement.width, canvasElement.height);
    var firstTileX = Math.floor(Math.max(playerPos.x - 6, 0));
    var lastTileX = Math.floor(Math.min(playerPos.x + 7, terrain[0].length));
    var firstTileY = Math.floor(Math.max(playerPos.y - 4, 0));
    var lastTileY = Math.floor(Math.min(playerPos.y + 5, terrain.length));
    for ( var idxY = firstTileY ; idxY < lastTileY ; idxY++ ) {
        var tileYposition = centerY - ((playerPos.y - idxY) * tileData.size) - tileData.size/2;
        for ( var idxX = firstTileX ; idxX < lastTileX ; idxX++ ) {
            context.fillStyle = tileData.colours[terrain[idxY][idxX]];
            var tileXposition = centerX - ((playerPos.x - idxX) * tileData.size) - tileData.size/2;
            context.fillRect(tileXposition, tileYposition, tileData.size, tileData.size);
        }
    }
    return 0;
};

window.game2d.render.redrawGame = function() {
    var canvasElement = document.getElementById('gameCanvas');
    window.game2d.render.drawTerrain(canvasElement, window.game2d.model.player.pos, window.game2d.render.tileData, window.game2d.model.terrain);
    window.game2d.render.drawPlayer(canvasElement, window.game2d.model.player, window.game2d.render.playerSize);
    requestAnimationFrame(window.game2d.render.redrawGame);
}

requestAnimationFrame(window.game2d.render.redrawGame);