let canvas, ctx, container;
canvas = document.createElement('canvas');
ctx = canvas.getContext("2d");
let ball;

// Velocity
let vx = (Math.random() * 25) + -5;
let vy;

let gravity = 0.5;
let bounce = 0.7;
let xFriction = 0.1;

function init() {
    setupCanvas();
    vy = (Math.random() * -25) + -5;
    ball = {x:canvas.width / 2, y:canvas.height / 4, radius:25, status: 0, color:"magenta"};
}

function draw() {
    ctx.clearRect(0,0,canvas.width, canvas.height);

    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2, false);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();

    ballMovement();
}

setInterval(draw, 600/35);

function ballMovement() {
    ball.x += vx;
    ball.y += vy;
    vy += gravity;

    // If wall is hit, change direction on x axis
    if (ball.x + ball.radius > canvas.width || ball.x - ball.radius < 0) {
        vx *= -1;
    }
    // Ball hits floor
    if(ball.y + ball.radius > canvas.height) {
        ball.y = canvas.height - ball.radius;
        vy *= -bounce;
        if(vy < 0 && vy > -2.1) 
            vy = 0;
        if(Math.abs(vx) < 1.1) 
            vx = 0;
        xF();
    }    
}

function xF() {
    if(vx > 0) 
        vx = vx - xFriction;
    if(vx < 0) 
        vx = vx + xFriction;
}

function setupCanvas() {
    container = document.createElement( 'div' );
    container.className = "container";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild( container );
    container.appendChild(canvas);

    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 2;
}