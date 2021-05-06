export default class Player {

    constructor(gameWidth, gameHeight, energy) {

        //Player attributes
        this.width = 32;
        this.height = 48;

        this.position = {
            x : gameWidth - 150 - this.width/2,
            y : gameHeight - 100 - this.height/2
        };

        this.animation=false;

        this.maxSpeed = 4;

        this.energy = energy;
        this.maxEnergy = energy;

        this.playerSprite = new Image();
        this.playerSprite.src = "/images/sprites/IronManSprites.png";

        this.spritePosition = {
            x: 0,
            y: 3
        };

        this.score=0;
    }

    //Movement
    moveUp(game){
        this.spritePosition.y=3;
        this.spritePosition.x=(this.spritePosition.x+1)%4;
        let canMove = true;
        for (let index = 0; index < game.objects.length; index++) {
            let obj = game.objects[index];
            if(game.detectCollision(this.position.x, this.position.y-this.maxSpeed, this.width, this.height, obj.position.x, obj.position.y, obj.width, obj.height) ){
                canMove = false;
                break;
            }
        }
        if(canMove)
            this.position.y = this.position.y-this.maxSpeed > 0 ? this.position.y-this.maxSpeed : 0; 
        
    }
    moveDown(game){
        this.spritePosition.y=0;
        this.spritePosition.x=(this.spritePosition.x+1)%4;
        let canMove = true;
        for (let index = 0; index < game.objects.length; index++) {
            let obj = game.objects[index];
            if(game.detectCollision(this.position.x, this.position.y+this.maxSpeed, this.width, this.height, obj.position.x, obj.position.y, obj.width, obj.height) ){
                canMove = false;
                break;
            }
        }
        if(canMove)
            this.position.y = this.position.y+this.maxSpeed < game.canvas.height-this.height ? this.position.y+this.maxSpeed : game.canvas.height-this.height; 
    }
    moveRight(game){
        this.spritePosition.y=2;
        this.spritePosition.x=(this.spritePosition.x+1)%4;
        let canMove = true;
        for (let index = 0; index < game.objects.length; index++) {
            let obj = game.objects[index];
            if(game.detectCollision(this.position.x+this.maxSpeed, this.position.y, this.width, this.height, obj.position.x, obj.position.y, obj.width, obj.height) ){
                canMove = false;
                break;
            }
        }
        if(canMove)
            this.position.x = this.position.x+this.maxSpeed < game.canvas.width-this.width ? this.position.x+this.maxSpeed : game.canvas.width-this.width; 
    }
    moveLeft(game){
        this.spritePosition.y=1;
        this.spritePosition.x=(this.spritePosition.x+1)%4;
        let canMove = true;
        for (let index = 0; index < game.objects.length; index++) {
            let obj = game.objects[index];
            if(game.detectCollision(this.position.x-this.maxSpeed, this.position.y, this.width, this.height, obj.position.x, obj.position.y, obj.width, obj.height) ){
                canMove = false;
                break;
            }
        }
        if(canMove)
            this.position.x = this.position.x-this.maxSpeed > 0 ? this.position.x-this.maxSpeed : 0; 
    }
    increaseScore(){
        this.score++;
    }
    increaseEnergy(){
        this.energy++;
    }

    draw(ctx) {
        ctx.drawImage(this.playerSprite,this.width*this.spritePosition.x,this.height*this.spritePosition.y,this.width, this.height, this.position.x, this.position.y, this.width, this.height);
    }
}