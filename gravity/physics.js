/*jslint node: true */
'use strict';

window.game2d = window.game2d || {};

window.game2d.physics = window.game2d.physics || {};

window.game2d.physics.objects = [];

window.game2d.physics.handleUpdate = function(){
    if (window.game2d.physics.lastTick === undefined){
        window.game2d.physics.lastTick = Date.now();
    }
    var now = Date.now();
    var ellapsedSeconds = (now - window.game2d.physics.lastTick)/1000;
    window.game2d.physics.lastTick = now;
    var max = function(a,b){
        if (a > b){
            return a;
        }
        return b;
    }
    for (var i = 0 ; i < window.game2d.physics.objects.length ; i++){
        var curObj = window.game2d.physics.objects[i];
        curObj.yvel = curObj.yvel - 60 *ellapsedSeconds;
        curObj.ypos = curObj.ypos + curObj.yvel * 3 * ellapsedSeconds;
        if (curObj.ypos < 0){
            curObj.ypos = 0;
            if (curObj.yvel < -1){
                curObj.yvel = -curObj.yvel / 1.5  ;
            }
            else {
                curObj.yvel = 0;
            }
        }
    }
    requestAnimationFrame(window.game2d.physics.handleUpdate);
};

window.game2d.physics.addObject = function(whichObj){
    window.game2d.physics.objects.push(whichObj);
};

requestAnimationFrame(window.game2d.physics.handleUpdate);