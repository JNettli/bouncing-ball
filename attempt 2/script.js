var width = 1200;
var height = 700;
var canvas = ctx = false;
var fps = 1/40; // Seconds
var frameDelay = fps * 1000; // In ms
var loopTimer = false;

var ball = {
    position: {x: width/2, y: 0},
    velocity: {x: 10, y: 0},
    mass: 0.1, // kg
    radius: 15, // 1px = 1cm
    restitution: -0.7 // bouncyness value
};


// Mathematical Constants
var Cd = 0.47; // Dimensionless
var rho = 1.22; // kg / m^3  --  This can be changed by the fluid density of I.E water to make the ball act as if in water
var A = Math.PI * ball.radius * ball.radius / (10000);
var ag = 9.81;
var mouse = {x: 0, y: 0, isDown: false};

function getMousePosition(e) {
    mouse.x = e.pageX - canvas.offsetLeft;
    mouse.y = e.pageY - canvas.offsetTop;
}
var mouseDown = function(e) {
    if (e.which == 1) {
        getMousePosition(e);
        mouse.isDown = true;
        ball.position.x = mouse.x;
        ball.position.y = mouse.y;
    }
}
var mouseUp = function(e) {
    if (e.which == 1) {
        mouse.isDown = false;
        ball.velocity.y = (ball.position.y - mouse.y) / 10;
        ball.velocity.x = (ball.position.x - mouse.x) / 10;
    }
}

var setup = function() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    canvas.onmousemove = getMousePosition;
    canvas.onmousedown = mouseDown;
    canvas.onmouseup = mouseUp;

    ctx.fillstyle = '#ff0000';
    ctx.strokeStyle = '#666666';
    loopTimer = setInterval(loop, frameDelay);
}

var loop = function() {
    if(!mouse.isDown) {
        //Physics time
        // Drag force: Fd = -1/2 * Cd * A * rho * v * v
        var Fx = -0.5 * Cd * A * rho * ball.velocity.x * ball.velocity.x * ball.velocity.x / Math.abs(ball.velocity.x);
        var Fy = -0.5 * Cd * A * rho * ball.velocity.y * ball.velocity.y * ball.velocity.y / Math.abs(ball.velocity.y);
        
        Fx = (isNaN(Fx) ? 0 : Fx);
        Fy = (isNaN(Fy) ? 0 : Fy);
        
        // Calculate acceleration ( F = ma )
        var ax = Fx / ball.mass;
        var ay = ag + (Fy / ball.mass);
        
        // Integrate to get velocity
        ball.velocity.x += ax*fps;
        ball.velocity.y += ay*fps;
        
        // Integrate to get position
        ball.position.x += ball.velocity.x*fps*100;
        ball.position.y += ball.velocity.y*fps*100;
    }
    // Handle collisions
    if(ball.position.y > height - ball.radius) {
        ball.velocity.y *= ball.restitution;
        ball.position.y = height - ball.radius;
    }
    if(ball.position.x > width - ball.radius) {
        ball.velocity.x *= ball.restitution;
        ball.position.x = width - ball.radius;
    }
    if(ball.position.x < ball.radius) {
        ball.velocity.x *= ball.restitution;
        ball.position.x = ball.radius;
    }

    // Draw the ball

    ctx.clearRect(0, 0, width, height);

    ctx.save();

    ctx.translate(ball.position.x, ball.position.y);
    ctx.beginPath();
    ctx.arc(0, 0, ball.radius, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();

    ctx.restore();


    // Mouse Slingshot
    if(mouse.isDown) {
        ctx.beginPath();
        ctx.moveTo(ball.position.x, ball.position.y);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.stroke();
        ctx.closePath();
    }
}

setup();
