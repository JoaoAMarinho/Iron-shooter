//Import
import Player from './player.js';
import {KBDInputHandler, MInputHandler} from './input.js';
import Mouse from './mouse.js';
import Object from './object.js';
import Enemy from './enemy.js';
import Explosion from './explosion.js';
import PowerUp from './powerup.js';
import { deleteGame } from './script.js';

export default class Game {
    constructor(canvas){

        //Canvas
        this.canvas = canvas;
        //Canvas Context
        this.ctx = this.canvas.getContext('2d');

        //Frame Number
        this.frameID;

        //Player
        this.player = new Player(this.canvas.width, this.canvas.height, 3);

        //Mouse
        this.mouse = new Mouse(18,18);

        //Enemies
        this.enemies=[];

        //Bullets
        this.bullets=[];

        //Objects
        this.objects=[];

        //Explosions
        this.explosions=[];

        //PowerUps
        this.powerUps=[];

        //Sound Effects
        this.sounds=[];
        this.soundIndexes={};

        //Score
        this.gameScore = document.getElementById("scoreVal");
        this.gameScore.innerHTML=0;
        //Health
        this.gameHealth = document.getElementById("healthVal");
        this.gameHealth.innerHTML="❤❤❤";

        this.background = new Image();
        this.background.src = "./images/gameBackground.png";

        this.createObjects();
        this.loadSounds();
    }

    setupFrames(fps){
        this.fps=fps;
        this.fpsInterval = 1000/this.fps;
        this.then = Date.now();
        this.startTime = this.then;
    }

    //Main Drawer
    gameViewer(){
        //Clear screen
        this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

        //Draw Background
        this.ctx.drawImage(this.background,0,0,this.canvas.width, this.canvas.height, 0, 0, this.canvas.width, this.canvas.height);

        //Draw Objects
        this.objects.forEach( object => { object.draw(this.ctx); });

        //Draw Enemies
        this.enemies.forEach( (enemy, index) => { this.enemyHandler(enemy, index); });

        //Draw Explosions
        this.explosions.forEach ((explosion, index)=>{ this.explosionHandler(explosion, index); });

        //Draw PowerUps
        this.powerUps.forEach ((powerUp, index)=>{ this.powerUpHandler(powerUp, index);});
        
        //Check Keyboard Input
        this.keyboardInputHandler.checkKeys(this);
    
        //Check Mouse Input
        this.mouseInputHandler.checkMovement(this.mouse);
    
        //Update and Draw Player
        this.player.draw(this.ctx);
        
        //Draw Mouse
        this.mouse.draw(this.ctx);

        //Draw Bullets
        this.bullets.forEach((bullet, index) => { this.bulletHandler(bullet, index); });
    }

    //Game Loop
    gameLoop() {
        this.frameID=requestAnimationFrame(()=>{this.gameLoop();});
        
        this.now=Date.now();
        this.elapsed = this.now - this.then;
    
        if(this.elapsed > this.fpsInterval){
            this.then = this.now - (this.elapsed%this.fpsInterval);
            
            //Draw Game
            this.gameViewer();
        }
        if(this.gameEnd) return new Game(this.canvas);
        else return this;
    }
    
    //Start Game
    startGame(fps){
        
        //Setup Frames
        this.setupFrames(fps);

        //Keyboard Input Handler
        this.keyboardInputHandler = new KBDInputHandler();

        //Mouse Input Handler
        this.mouseInputHandler = new MInputHandler(this);

        //Game Animation
        this.gameLoop();

        //Setup Enemy Spawning
        setTimeout(this.spawnEnemies(2, 6000), 6000);

        //Setup PowerUps Spawning
        setTimeout(this.spawnPowerUps(4000), 4000);
    }
     //End Game
    endGame(){
    
        cancelAnimationFrame(this.frameID);
        this.end=true;
        document.getElementById("value").innerHTML=this.player.score;

        this.resetValues();

        deleteGame();
    }
    //Reset Game
    resetValues(){
        //Stop timeouts
        clearTimeout(this.enemiesTimeout);
        clearTimeout(this.powerupsTimeout);

        this.enemies.splice(0, this.enemies.length);
        this.bullets.splice(0, this.bullets.length);
        this.explosions.splice(0, this.explosions.length);
        this.powerUps.splice(0, this.powerUps.length);
        this.sounds[this.soundIndexes.background].pause();
        this.player.score=0;
        this.player.energy=this.player.maxEnergy;
    }

    //Handlers
    bulletHandler(bullet, index){
        bullet.draw(this.ctx);
        bullet.move();
        this.objects.forEach( (obj) => {
            if( this.detectCollision(bullet.position.x, bullet.position.y, bullet.width, bullet.height, obj.position.x, obj.position.y, obj.width, obj.height) ){
                setTimeout(() => {
                    this.bullets.splice(index, 1);
                }, 0);
            }
        });
        if(bullet.position.x > this.canvas.width || bullet.position.x < 0) this.bullets.splice(index, 1);
        else if (bullet.position.y > this.canvas.height || bullet.position.y < 0) this.bullets.splice(index, 1);
    }
    enemyHandler(enemy, index){
        enemy.draw(this.ctx);
        enemy.setVelocity( Math.atan2(this.player.position.y+this.player.height/2 - (enemy.position.y+enemy.height/2), this.player.position.x+this.player.width/2 - (enemy.position.x+enemy.width/2)) );
        enemy.move();
        if(!enemy.animation){
            enemy.animate();
            enemy.animation=true;
        }
        if(this.detectCollision(enemy.position.x, enemy.position.y, enemy.width, enemy.height, this.player.position.x, this.player.position.y, this.player.width, this.player.height) ){
            //Player collision
            if((--this.player.energy) == 0){
                this.endGame();
            }

            //Change health HTML element
            let str="";
            for (let index = 0; index < this.player.energy; index++) {
                str+="❤";
            }
            this.gameHealth.innerHTML=str;

            setTimeout(() => {
                this.enemies.splice(index, 1);
            }, 0);
        }
        this.bullets.forEach( (b, i) => {
            //Bullet collision
            if(this.detectCollision(enemy.position.x, enemy.position.y, enemy.width, enemy.height, b.position.x, b.position.y, b.width, b.height) ){
                this.player.increaseScore();
                this.gameScore.innerHTML=this.player.score;
                this.explosions.push(new Explosion(enemy.position.x+enemy.width/2, enemy.position.y+enemy.height/2));
                setTimeout(() => {
                    this.enemies.splice(index, 1);
                    this.bullets.splice(i, 1);
                }, 0);
            }
        });
        this.enemies.forEach( (e, i) => {
            //Enemy collision
            if(index!=i && this.detectCollision(enemy.position.x, enemy.position.y, enemy.width, enemy.height, e.position.x, e.position.y, e.width, e.height) ){
                enemy.undoMove();
            }
        });
    }
    explosionHandler(explosion, index){
        explosion.draw(this.ctx);
        if(explosion.spritePosition.x==6){
            setTimeout(() => {
                this.explosions.splice(index, 1);
            }, 0);
        }
    }
    powerUpHandler(powerUp, index){
        if(powerUp.lifeTime==0)
            setTimeout(()=>{this.powerUps.splice(index,1);});

        powerUp.draw(this.ctx);
        if(!powerUp.animation){
            powerUp.animate();
            powerUp.animation=true;
        }
        if(this.detectCollision(this.player.position.x, this.player.position.y, this.player.width, this.player.height, powerUp.position.x, powerUp.position.y, powerUp.width, powerUp.height) ){
            setTimeout(()=>{
                this.powerUps.splice(index,1);
            }, 0);
            this.player.increaseEnergy();
            //Change health HTML element
            let str="";
            for (let index = 0; index < this.player.energy; index++) {
                str+="❤";
            }
            this.gameHealth.innerHTML=str;
        }
    }

    //Collision detection between two rectangles
    detectCollision(x1, y1, width1, height1, x2, y2, width2, height2){
        if(x1 < x2 + width2 && x1 +width1 > x2 && y1 < y2 + height2 && y1 + height1 > y2)
            return true;
        else return false;
    }

    //Creation
    spawnEnemies(n, interval){
        this.enemiesTimeout=setTimeout( ()=> {
        this.createEnemy(n);
        if(n<10)
            n+=2;
        else interval = interval <= 1000 ? interval : interval-500;
        this.spawnEnemies(n, interval); }, interval);
    }
    spawnPowerUps(interval){
        this.powerupsTimeout=setTimeout( ()=> {
            if(this.player.energy<this.player.maxEnergy && this.powerUps.length<this.player.maxEnergy)
                this.createPowerUp(this.player.maxEnergy-this.player.energy);
            if(this.enemies.length>4)
                interval = interval <= 1500 ? interval : interval-500;
            this.spawnPowerUps(interval); }, interval);
    }
    createObjects(){
        this.objects.push( new Object(148, 123, 435, 0, "./images/sprites/objects/bigHouse.png") );
        this.objects.push( new Object(59, 96, 590, 16, "./images/sprites/objects/smallHouse.png") );
        this.objects.push( new Object(59, 96, 649, 16, "./images/sprites/objects/smallHouse.png") );
        this.objects.push( new Object(59, 96, 707, 16, "./images/sprites/objects/smallHouse.png") );
        this.objects.push( new Object(124, 116, 32, 402, "./images/sprites/objects/stadium.png") );
        this.objects.push( new Object(40, 70, 139, 500, "./images/sprites/objects/dragonStatue.png") );
        this.objects.push( new Object(40, 70, 3, 500, "./images/sprites/objects/dragonStatue.png") );
        this.objects.push( new Object(113, 132, 684, 465, "./images/sprites/objects/plane.png") );
    }
    createEnemy(n){
        for (let index = 0; index < n; index++) {
            const enemy = new Enemy(1, 1);
            let x;
            let y;
            let invalid = true;
            while(invalid){
                invalid=false;
                if(Math.random() < 0.5){
                    x = Math.random() < 0.5 ? 0-enemy.width/2 : this.canvas.width+enemy.width/2;
                    y = Math.random() * this.canvas.height;
                    
                }
                else {
                    x = Math.random() * this.canvas.width; 
                    y = Math.random() < 0.5 ? 0-enemy.height/2 : this.canvas.height+enemy.height/2;
                }
                for (let index = 0; index < this.enemies.length; index++) {
                    const e = this.enemies[index];
                    if(this.detectCollision(e.position.x, e.position.y, e.width, e.height, x, y, e.width, e.height) ){
                        invalid=true;
                        break;
                    }
                }
            }
            enemy.setPos(x,y);
            enemy.setVelocity( Math.atan2(this.player.position.y+this.player.height/2 - (enemy.position.y+enemy.height/2), this.player.position.x+this.player.width/2 - (enemy.position.x+enemy.width/2)) );
            this.enemies.push(enemy);
        }
    }
    createPowerUp(n){
        for (let index = 0; index < n; index++) {
            const powerup = new PowerUp(1, 1);
            let x;
            let y;
            let invalid = true;
            while(invalid){
                invalid=false;
                x = Math.random() * (this.canvas.width-2*powerup.width)+powerup.width;
                y = Math.random() * (this.canvas.height-2*powerup.height)+powerup.height;
                for (let index = 0; index < this.objects.length; index++) {
                    const obj = this.objects[index];
                    if(this.detectCollision(obj.position.x, obj.position.y, obj.width, obj.height, x, y, powerup.width, powerup.height) ){
                        invalid=true;
                        break;
                    }
                }
            }
            powerup.setPos(x,y);
            this.powerUps.push(powerup);
            setTimeout(()=>{
                powerup.lifeTime=0;
            }, powerup.lifeTime);
        }
    }
    loadSounds(){
        //Background Music
        let s;
        s = new Audio("./sounds/background.mp3");
        s.loop=true;
        s.volume = 0.05;
        this.soundIndexes.background = this.sounds.length;
        this.sounds.push(s);

        //Shooting Effects
        let a = [];
        for (let index = 0; index < 3; index++) {
            s = new Audio("./sounds/laser.mp3");
            s.volume = 0.1;
            a.push(s);
        }
        this.soundIndexes.laser = this.sounds.length;
        this.sounds.push(a);
    }
}