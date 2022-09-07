export class Paddle {
    constructor(ctx, position) {
        this.color = '#ddd';
        this.ctx = ctx;
        this.pos = position;
        this.size = {
            width: 20,
            height: 100
        };
        this.velocityY = 0;
        this.speed = 5;
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.fillRect(this.pos.x, this.pos.y, this.size.width, this.size.height);
    }
}