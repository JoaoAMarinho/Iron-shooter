export default class Object {

    constructor(width, height, x, y, imageUrl) {

        //Object attributes
        this.width = width;
        this.height = height;

        this.position = {
            x : x,
            y : y
        };

        this.maxSpeed = 5;

        this.objectSprite = new Image();
        this.objectSprite.src = imageUrl;
    }

    draw(ctx) {
        ctx.drawImage(this.objectSprite, 0, 0,this.width, this.height, this.position.x, this.position.y, this.width, this.height);
    }
}