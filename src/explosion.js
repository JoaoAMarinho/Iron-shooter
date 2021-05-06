export default class Explosion {

    constructor(x, y) {
        
        //Explosion attributes
        this.width = 94;
        this.height = 69;

        this.position = {
            x : x,
            y : y
        };

        this.explosionSprite = new Image();
        this.explosionSprite.src = "./images/sprites/DeathSprites.png";

        this.spritePosition = {
            x: 0
        };
    }

    draw(ctx) {
        ctx.drawImage(this.explosionSprite, this.width*this.spritePosition.x, 0, this.width, this.height, this.position.x-this.width/2, this.position.y-this.height/2, this.width, this.height);
        this.spritePosition.x++;
    }
}