export default class Enemy {

    constructor(x, y) {

        //Enemy attributes
        this.width = 24;
        this.height = 35;

        this.position = {
            x : x,
            y : y
        };

        this.velocity = {
            x: 0,
            y: 0
        };

        this.animation=false;

        this.maxSpeed = 3;

        this.enemySprite = new Image();
        this.enemySprite.src = "/images/sprites/RocketSprites.png";

        this.spritePosition = {
            x: 0,
            y: 0
        };
    }

    //Movement
    move(){
        if(this.velocity.x >= 0){
            this.spritePosition.y=2;
        }
        else {
            this.spritePosition.y=1;
        }
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    animate(){
        setTimeout(() => {
            this.spritePosition.x=(this.spritePosition.x+1)%4;
            this.animate();
        }, 100);
    }
    setPos(x ,y){
        this.position.x = x;
        this.position.y = y;
    }
    undoMove(){
        this.position.x -= this.velocity.x;
        this.position.y -= this.velocity.y;
    }
    setVelocity(degree){
        this.degree = degree;
        if(this.velocity.x >= 0 && Math.cos(this.degree) < 0){
            this.spritePosition.x=0;
        }
        this.velocity = {
            x: this.maxSpeed*Math.cos(this.degree),
            y: this.maxSpeed*Math.sin(this.degree)
        };
    }

    draw(ctx) {
        ctx.drawImage(this.enemySprite,this.width*this.spritePosition.x,this.height*this.spritePosition.y,this.width, this.height, this.position.x, this.position.y, this.width, this.height);
    }
}