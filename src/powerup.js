export default class PowerUp {
    constructor(x, y){

        //PowerUp attributes
        this.width = 20;
        this.height = 20;

        this.position = {
            x : x,
            y : y
        };

        //Animation started
        this.animation=false;
        //Life time (3 sec)
        this.lifeTime=3000;
        
        this.powerUpSprite = new Image();
        this.powerUpSprite.src = "/images/sprites/HeartSprites.png";

        this.spritePosition = {
            x: 0,
            y: 0
        };
    }
    animate(){
        setTimeout(() => {
            this.spritePosition.x=(this.spritePosition.x+1)%5;
            this.animate();
        }, 50);
    }
    setPos(x ,y){
        this.position.x = x;
        this.position.y = y;
    }
    draw(ctx){
        ctx.drawImage(this.powerUpSprite,this.width*this.spritePosition.x,this.height*this.spritePosition.y,this.width, this.height, this.position.x, this.position.y, this.width, this.height);
    }

}