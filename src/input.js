import Bullet from "./bullet.js";

export class KBDInputHandler {
    constructor(){
        this.activeKeys = {};

        document.addEventListener('keydown', event => {
            this.activeKeys[event.code]=true;
        });

        document.addEventListener('keyup', event => {
            this.activeKeys[event.code]=false;
        });
    }

    isKeyPressed(key){
        return this.activeKeys[key];
    }

    checkKeys(game){
        if(this.isKeyPressed("KeyW")){
            game.player.moveUp(game);
        }
        if(this.isKeyPressed("KeyA")){
            game.player.moveLeft(game);
        }
        if(this.isKeyPressed("KeyS")){
            game.player.moveDown(game);
        }
        if(this.isKeyPressed("KeyD")){
            game.player.moveRight(game);
        }
    }
}

export class MInputHandler {
    constructor(game){
        this.game = game;

        document.addEventListener('mousemove', event => {
            this.moveEvent = event;
        });
        document.addEventListener('click', ()=>{this.clickEvent();} );
    }
    getPosition(element) {
        var xPosition = 0;
        var yPosition = 0;

        while(element){
            xPosition += (element.offsetLeft - element.scrollLeft + element.clientLeft);
            yPosition +=(element.offsetTop - element.scrollTop + element.clientTop);
            element = element.offsetParent;
        }
        return {
            x: xPosition,
            y: yPosition
        };
    }
    getMousePosition(){
        return {
            x: this.moveEvent.x-this.getPosition(this.game.canvas).x+(this.game.canvas.width/2),
            y: this.moveEvent.y-this.getPosition(this.game.canvas).y+(this.game.canvas.height/2)
        };
    }
    checkMovement(mouse){
        if(!this.moveEvent) return;
        mouse.update(this.getMousePosition());
    }
    clickEvent(){
        if(this.game.end) return;
        if(this.game.sounds[this.game.soundIndexes.background].currentTime==0)
            this.game.sounds[this.game.soundIndexes.background].play();

    
        let bullet = new Bullet(6,11, this.game.player);
        let newPos = this.getMousePosition();
        newPos.x -= bullet.width/2;
        newPos.y -= bullet.height/2;
        bullet.setVelocity(Math.atan2(newPos.y-bullet.position.y,newPos.x-bullet.position.x));
        this.game.bullets.push(bullet);
        
        let soundArray = this.game.sounds[this.game.soundIndexes.laser];
        for (let index = 0; index < this.game.sounds[this.game.soundIndexes.laser].length; index++) {
            if(soundArray[index].currentTime==0){
                soundArray[index].play();
                break;
            }
            if(soundArray[index].currentTime==soundArray[index].duration){
                soundArray[index].play();
                soundArray[index].currentTime=0;
                break;
            }
        }
        
    }
}