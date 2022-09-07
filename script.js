import { Paddle } from './paddle.js';
import { Ball } from './ball.js';




const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let cw = window.innerWidth;
let ch = window.innerHeight;
canvas.width = cw;
canvas.height = ch;

window.addEventListener('resize', () => {
    cw = window.innerWidth;
    ch = window.innerHeight;
    canvas.width = cw;
    canvas.height = ch;
});

let margeOfError = 8;
let paddles = [];
let marge = 100;
let lastKey;
let lastKeyArrow;
let keys = {
    'z': { isPressed: false },
    's': { isPressed: false },
    'ArrowUp': { isPressed: false },
    'ArrowDown': { isPressed: false }
};
let ball;
let animation = '';
let score = 0;
let level = 1;
let gameIsOver = false;

window.onload = function main() {
    // localStorage
    if (localStorage.getItem('pong-high-score') === null) {
        localStorage.setItem('pong-high-score', 0);
        console.log('created a high score');
    }

    paddles.push(new Paddle(
        ctx,
        // position
        {
            x: marge,
            y: Math.floor(ch / 2) - 50
        }
    ));
    paddles.push(new Paddle(
        ctx,
        // position 
        {
            x: cw - marge - 20,
            y: Math.floor(ch / 2) - 50
        }
    ));

    ball = new Ball(
        ctx,
        // position 
        {
            x: Math.floor(cw / 2),
            y: Math.floor(ch / 2),
        }
    );

    animate();
};

function animate() {
    update();
    draw();

    animation = requestAnimationFrame(animate);
    if (gameIsOver) { window.cancelAnimationFrame(animation); }
}

function update() {
    // level 
    level = Math.floor(score / 10) + 1;
    ball.speed = 5 + level;

    // paddles
    paddles[0].velocityY = 0;
    paddles[1].velocityY = 0;

    if (keys.z.isPressed && lastKey === 'z') {
        paddles[0].velocityY = -1;
    } else if (keys.s.isPressed && lastKey === 's') {
        paddles[0].velocityY = 1;
    }

    if (keys.ArrowUp.isPressed && lastKeyArrow === 'ArrowUp') {
        paddles[1].velocityY = -1;
    } else if (keys.ArrowDown.isPressed && lastKeyArrow === 'ArrowDown') {
        paddles[1].velocityY = 1;
    }

    paddles.forEach(paddle => {
        if (paddle.velocityY === -1) {
            if (paddle.pos.y - paddle.speed <= 0) {
                return paddle.pos.y = 0;
            }
            paddle.pos.y += -paddle.speed;
        } else if (paddle.velocityY === 1) {
            if (paddle.pos.y + paddle.speed + paddle.size.height > ch) {
                return paddle.pos.y = ch - paddle.size.height;
            }
            paddle.pos.y += paddle.speed;
        }
    });

    // ball
    if (ball.vel.x === 1) {
        if (ball.pos.x + ball.speed + ball.width > cw) {
            endGame();
        }
        ball.boardPos.x += ball.speed;
        ball.pos.x += ball.speed;
    } else if (ball.vel.x === -1) {
        if (ball.pos.x - ball.speed < 0) {
            endGame();
        }
        ball.boardPos.x += -ball.speed;
        ball.pos.x += -ball.speed;
    }

    if (ball.vel.y === 1) {
        if (ball.pos.y + ball.speed + ball.width > ch) {
            ball.vel.y *= -1;
        }
        ball.boardPos.y += ball.speed;
        ball.pos.y += ball.speed;
    } else if (ball.vel.y === -1) {
        if (ball.pos.y - ball.speed < 0) {
            ball.vel.y *= -1;
        }
        ball.boardPos.y += -ball.speed;
        ball.pos.y += -ball.speed;
    }

    // collision with paddle
    // left paddle 
    let margeCollisions = ball.speed - 1;
    if (ball.boardPos.x - ball.width / 2 < paddles[0].pos.x + paddles[0].size.width &&
        ball.boardPos.x - ball.width / 2 >= paddles[0].pos.x + paddles[0].size.width - margeCollisions &&
        ball.boardPos.y > paddles[0].pos.y - margeOfError &&
        ball.boardPos.y < paddles[0].pos.y + paddles[0].size.height + margeOfError) {
        ball.pos.x = paddles[0].pos.x + paddles[0].size.width;
        ball.vel.x *= -1;
        score += 1;
    }
    // right paddle 
    if (ball.boardPos.x + ball.width / 2 > paddles[1].pos.x &&
        ball.boardPos.x + ball.width / 2 <= paddles[1].pos.x + margeCollisions &&
        ball.boardPos.y > paddles[1].pos.y - margeOfError &&
        ball.boardPos.y < paddles[1].pos.y + paddles[1].size.height + margeOfError) {
        ball.pos.x = paddles[1].pos.x;
        ball.vel.x *= -1;
        score += 1;
    }

}

function draw() {
    // bg 
    ctx.fillStyle = '#2F2F2F';
    ctx.fillRect(0, 0, cw, ch);

    // paddles
    paddles.forEach(paddle => {
        paddle.draw();
    });

    // ball
    ball.draw();

    // score
    ctx.font = '20px Poppins';
    ctx.fillText(`Score : ${score}`, 5, 25);
    ctx.fillText(`Level : ${level}`, 5, 45);
    ctx.fillText(`High-Score : ${localStorage.getItem('pong-high-score')}`, 5, 65);
}


window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') {
        lastKeyArrow = 'ArrowUp';
        keys.ArrowUp.isPressed = true;
    } else if (e.key === 'ArrowDown') {
        lastKeyArrow = 'ArrowDown';
        keys.ArrowDown.isPressed = true;
    } else if (e.key.toLocaleLowerCase() === 'z') {
        lastKey = 'z';
        keys.z.isPressed = true;
    } else if (e.key.toLocaleLowerCase() === 's') {
        lastKey = 's';
        keys.s.isPressed = true;
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowUp') {
        keys.ArrowUp.isPressed = false;
    } else if (e.key === 'ArrowDown') {
        keys.ArrowDown.isPressed = false;
    } else if (e.key.toLocaleLowerCase() === 'z') {
        keys.z.isPressed = false;
    } else if (e.key.toLocaleLowerCase() === 's') {
        keys.s.isPressed = false;
    }
});


function endGame() {
    if (gameIsOver) return;
    gameIsOver = true;

    ball.boardPos.x = Math.floor(cw / 2);
    ball.boardPos.y = Math.floor(ch / 2);
    if (score > localStorage.getItem('pong-high-score')) {
        localStorage.setItem('pong-high-score', score);
    }
    alert('Game is Over Noob.' +
        `\n${score} points.`);
    let restart = confirm('Restart ?');
    if (restart) {
        window.location.reload();
    }
}