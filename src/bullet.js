export default class Bullet {

    constructor(width, height, shooter) {
        
        //Bullet attributes
        this.width = width;
        this.height = height;

        this.position = {
            x : shooter.position.x + shooter.width/2 - this.width/2,
            y : shooter.position.y + shooter.height/2 - this.height/2
        };

        this.maxSpeed = 12;

        this.bulletSprite = new Image();
        this.bulletSprite.src = "/images/sprites/LaserSprite.png";
    }

    //Movement
    move(){
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
    }
    setVelocity(degree){
        this.degree = degree;
        this.velocity = {
            x: this.maxSpeed*Math.cos(this.degree),
            y: this.maxSpeed*Math.sin(this.degree)
        };
    }
    draw(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.degree+90*Math.PI/180);
        ctx.translate(-this.position.x,-this.position.y);
        ctx.drawImage(this.bulletSprite, 0, 0, this.width, this.height, this.position.x, this.position.y, this.width, this.height);
        ctx.restore();
    }
}