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

window.game2d.controller.moveStuff = function(){
    if (window.game2d.controller.lastTick === undefined){
        window.game2d.controller.lastTick = Date.now();
    }
    var now = Date.now();
    var ellapsedSeconds = (now - window.game2d.controller.lastTick)/1000;
    window.game2d.controller.lastTick = now;
    var playerData = window.game2d.model.player;
    var speed = playerData.speed * ellapsedSeconds;
    playerData.pos.x = playerData.pos.x + playerData.vtr.x * speed;
    playerData.pos.y = playerData.pos.y + playerData.vtr.y * speed;
    playerData.vtr.x = playerData.vtr.x - playerData.vtr.x * speed;
    playerData.vtr.y = playerData.vtr.y - playerData.vtr.y * speed;
    if (Math.abs(playerData.vtr.x) < 0.001) {
        playerData.vtr.x = 0; 
    } 
    if (Math.abs(playerData.vtr.y) < 0.001) {
        playerData.vtr.y = 0;
    }
    requestAnimationFrame(window.game2d.controller.moveStuff); 
};
requestAnimationFrame(window.game2d.controller.moveStuff);

window.game2d.controller.processKeyInput = function(event){
    console.log('Look ma, key event');
    var interestingKeyCodes = {
        left: 37, up: 38, right: 39, down: 40 
    };
    var playerData = window.game2d.model.player;
    if (Math.abs(playerData.vtr.x) > 0.2 || Math.abs(playerData.vtr.y) > 0.2) {
        console.log('moving; ignore input');
        return 0;
    }
    var worldData = window.game2d.model.terrain;
    var keyCode = event.keyCode;
    switch (keyCode){
        case interestingKeyCodes.left:
            console.log('left');
            if (worldData[Math.floor(playerData.pos.y)][Math.floor(playerData.pos.x-1)] != 0){
                console.log('block');
                return;
            }
            playerData.vtr.x -= 1;
            break;
        case interestingKeyCodes.right:
            console.log('right');
            if (worldData[Math.floor(playerData.pos.y)][Math.floor(playerData.pos.x+1)] != 0){
                console.log('block');
                return;
            }
            playerData.vtr.x += 1;
            break;
        case interestingKeyCodes.up:
            console.log('up!');
            if (worldData[Math.floor(playerData.pos.y-1)][Math.floor(playerData.pos.x)] != 0){
                console.log('block');
                return;
            }
            playerData.vtr.y -= 1;
            break;
        case interestingKeyCodes.down:
            console.log('down');
            if (worldData[Math.floor(playerData.pos.y+1)][Math.floor(playerData.pos.x)] != 0){
                console.log('block');
                return;
            }
            playerData.vtr.y += 1;
            break;
    }
};
window.addEventListener('keydown', window.game2d.controller.processKeyInput, true);

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
    var lastTileX = Math.floor(Math.min(playerPos.x + 6, terrain[0].length));
    var firstTileY = Math.floor(Math.max(playerPos.y - 4, 0));
    var lastTileY = Math.floor(Math.min(playerPos.y + 4, terrain.length));
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