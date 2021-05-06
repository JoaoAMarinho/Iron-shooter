export default class Mouse {
    constructor(width, height){

        //Mouse Attributes
        this.width = width;
        this.height = height;

        this.position = {
            x:0,
            y:0
        };

        this.mouseSprite = new Image();
        this.mouseSprite.src = "/images/MouseCrosshair.png";
    }
    update(newPosition){
        this.position.x=newPosition.x;
        this.position.y=newPosition.y;
    }
    draw(ctx){
        ctx.drawImage(this.mouseSprite,0,0,this.width, this.height, this.position.x-this.width/2, this.position.y-this.height/2, this.width, this.height);
    }
}