export class Ball {
    constructor(ctx, position) {
        this.color = '#ddd';
        this.ctx = ctx;
        this.boardPos = position;
        this.width = 30;
        this.speed = 6;
        this.pos = {
            x: this.boardPos.x - this.width / 2,
            y: this.boardPos.y - this.width / 2
        };
        this.vel = {
            x: randomVel(),
            y: randomVel()
        };
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.boardPos.x, this.boardPos.y, this.width / 2, 0, 2 * Math.PI, false);
        this.ctx.fill();
    }
}

function randomVel() {
    let possibility = [1, -1];
    let random = Math.floor(Math.random() * possibility.length);
    return possibility[random];
}