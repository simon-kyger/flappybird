//globals and dom crap
document.addEventListener("DOMContentLoaded", function(event) {
    document.body.append(canvas);
    document.body.append(score);
    document.body.style.height = `100%`;
    document.body.style.overflow = `hidden`;
    document.body.style.margin = `0`;
    document.body.style.padding = `0`;
    document.body.style.backgroundColor = 'black';
});
let canvas = document.createElement('canvas');
canvas.id = 'game';
let scorenum = 0;
let score = document.createElement('div');
score.id = 'score';
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
score.width = 200;
score.height = 100;
score.innerHTML = 'Score: 0';
score.style.position = 'absolute';
score.style.top = 0;
score.style.left = 0;
score.style.color = 'white';
let ctx = canvas.getContext('2d');

//classes / utility
let flappybird = function(x, y, velocity){
    this.x = canvas.width/8;
    this.y = canvas.height/2;
    this.width = 40;
    this.velocity = 0;
    this.gravity = 2.2;
    this.jumpingpower = 30;
    this.update = function(){
        this.velocity += this.gravity;
        this.y += this.velocity;
        if(this.y>=canvas.height-this.width){
            this.y = canvas.height-this.width;
            this.velocity = 0;
        }
        if (this.y <= this.width) {
            console.log('set y to 0');
            this.y = this.width;
            this.velocity = 0;
        }
    }
    this.jump = function(){
        //this.velocity -= this.jumpingpower;
        
        this.velocity *= 0.1;
        this.velocity -= this.jumpingpower;
    }
    this.render = function(){
        ctx.beginPath();
        ctx.fillStyle = 'blue';
        ctx.arc(this.x, this.y, this.width, 0, Math.PI * 360);
        ctx.fill();
    }
}

let wall = function(){
    this.top = Math.random() * canvas.height/2;
    this.bot = Math.random() * canvas.height/2;
    this.x = canvas.width;
    this.w = 100;
    this.speed = Math.floor((Math.random()*10)+10);
    this.update = function(){
        this.x-=this.speed;
        //reset
        if (this.x+this.w < 0){
            collision = false;
            scorenum++;
            score.innerHTML = 'Score: ' + scorenum;
            this.x = canvas.width;
            this.speed = Math.floor((Math.random()*10)+10)
            this.top = Math.random() * canvas.height/2;
            this.bot = Math.random() * canvas.height/2;
        }
    }
    this.render = function(){
        ctx.fillStyle = 'white';
        if (collision)
            ctx.fillStyle = 'red';
        //need 2x fill rects one for the top half other for bottom half
        ctx.fillRect(this.x, 0, this.w, this.top);
        ctx.fillRect(this.x, canvas.height-this.bot, this.w, this.bot);
    }
};
let player = new flappybird();
let walls = new wall();
let collision = false;
function checkCollision(){
    if ((player.y < walls.top) || (player.y > canvas.height-walls.bot)){
        if ((player.x > walls.x) && (player.x < walls.x+walls.w)){
            collision = true;
            scorenum = -1;
        }
    }
}

//events
document.addEventListener('keydown', function(e) {
    if(e.which == 32) { 
        player.jump();
    }
}, false);

let fps = 60;
let lastTime = new Date().getTime();
let currentTime = 0;

//gameloop
function gameLoop() {
    window.requestAnimationFrame(gameLoop);
    currentTime = (new Date()).getTime();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    walls.update();
    walls.render();
    player.update();
    player.render();
    checkCollision();
    lastTime = currentTime;
}
gameLoop();