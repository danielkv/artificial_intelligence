class Game {
    constructor () {
        

        //CANVAS
        Game.background = '#000';
        Game.canvasWidth = 900;
        Game.canvasHeight = 600;
        Game.frameRate = 80;

        //DEBUG
        Game.debug = false;
        Game.debugRate = 30;
        
        //racket
        Game.racketColor = '#fff';
        Game.racketWidth = 150;
        Game.racketHeight = 20;
        Game.racketPositionX = (Game.canvasWidth / 2) - (Game.racketWidth / 2);
        Game.racketPositionY = Game.canvasHeight - 30 - Game.racketHeight;
        Game.racketSpeed = 25;
        Game.racketActualSpeed = 0;

        //ball
        Game.ballColor = '#fff';
        Game.ballWidth = 20;
        Game.ballHeight = 20;
        Game.ballSpeed = 10;
        
        //GAME
        Game.resetGame();

        //INIT
        Game.init();
    }

    static resetGame () {
        Game.hits = 0;
        Game.misses = 0;
        Game.seconds = 0;
        Game.countFrame = 0;
        Game.resetBall();
        Game.resetStatus();
    }

    static resetStatus() {
        Game.status = 'playing';
    }

    static setListeners () {
        document.body.onkeydown = Game.keyDown;
        document.body.onkeyup = Game.keyUp;
    }

    static forceInput (key) {
        if (key == 'left') {
            Game.racketActualSpeed = -Game.racketSpeed;
        } else if (key == 'right') {
            Game.racketActualSpeed = Game.racketSpeed;
        } else {
            Game.racketActualSpeed = 0;
        }
    }

    static keyDown (event) {
        var key = event.keyCode || event.which;
        //var keychar = String.fromCharCode(key);
        
        if (key == 37) {
            Game.racketActualSpeed = -Game.racketSpeed;
        } else if (key == 39) {
            Game.racketActualSpeed = Game.racketSpeed;
        } else {
            Game.racketActualSpeed = 0;
        }
    }
    
    static keyUp (event) {
        Game.racketActualSpeed = 0;
    }

    static init() {
        Game.canvas = Game.createCanvas(Game.canvasWidth, Game.canvasHeight);
       
        if (Game.canvas.getContext) {
            Game.ctx = Game.canvas.getContext("2d");
            Game.setListeners();
            Game.animate();
        } else {
            console.error('Canvas sem contexto');
        }
    }

    static clearCanvas () {
        Game.ctx.clearRect(0, 0, Game.canvasWidth, Game.canvasHeight);
    }

    static draw() {
        Game.clearCanvas();
        Game.setBackground(Game.background);
        Game.touchRacketVerify();
        Game.drawBall();
        Game.moveRacket();
        Game.drawRacket();
        Game.drawInfo();
        Game.countTime();
    }

    static createCanvas(width, height) {
        var canvas = document.createElement("canvas");
        canvas.id = "mycanvas_game";
        canvas.width = width;
        canvas.height = height;
        document.body.appendChild(canvas);
        return canvas;
    }

    static drawInfo () {
        Game.ctx.font = '18px sans-serif';
        Game.ctx.fillStyle = '#0c0';
        Game.ctx.textAlign = 'left';
        Game.ctx.textBaseline = 'hanging';

        Game.ctx.fillText('Hits:' , Game.canvasWidth - 140, Game.canvasHeight - 110);
        Game.ctx.fillText('Misses:' , Game.canvasWidth - 140, Game.canvasHeight - 80);
        Game.ctx.fillText('Time:' , Game.canvasWidth - 140, Game.canvasHeight - 50);

        Game.ctx.textAlign = 'right';
        Game.ctx.fillStyle = '#ff0';

        Game.ctx.fillText(Game.hits , Game.canvasWidth - 40, Game.canvasHeight - 110);
        Game.ctx.fillText(Game.misses , Game.canvasWidth - 40, Game.canvasHeight - 80);
        Game.ctx.fillText(Game.seconds , Game.canvasWidth - 40, Game.canvasHeight - 50);
    }

    static setBackground(background) {
        Game.ctx.fillStyle = background;
        Game.ctx.fillRect (0, 0, Game.canvas.width, Game.canvas.height);
    }

    static resetBall () {
        Game.ballPositionX = Math.floor(Math.random() * (Game.canvasWidth-Game.ballHeight));
        Game.ballPositionY = -Game.ballHeight;
        
        document.dispatchEvent(new CustomEvent('onResetBall', {detail : Game.getInfo()}));
    }

    static touchRacketVerify () {
        if (Game.ballPositionY+Game.ballHeight >= Game.racketPositionY) {
            if (Game.ballPositionX+Game.ballWidth > Game.racketPositionX && Game.ballPositionX < Game.racketPositionX + Game.racketWidth) {
                Game.resetBall();
                Game.racketColor = "rgb("+(Math.floor(Math.random()*255)+20)+", "+(Math.floor(Math.random()*255)+20)+", "+(Math.floor(Math.random()*255)+20)+")";
                Game.hits++;
                Game.status = 'hit';
            }
        }

        Game.ballPositionY += Game.ballSpeed;
        if (Game.ballPositionY >= Game.canvasHeight) {
            Game.resetBall();
            Game.misses++;
            Game.status = 'miss';
        }
    }

    static drawBall () {
        Game.ctx.fillStyle = Game.ballColor;
        Game.ctx.fillRect (Game.ballPositionX, Game.ballPositionY, Game.ballWidth, Game.ballHeight);
    }

    static moveRacket () {
        Game.racketPositionX += Game.racketActualSpeed;

        if (Game.racketPositionX+Game.racketWidth > Game.canvasWidth) {
            Game.racketPositionX = Game.canvasWidth - Game.racketWidth;
        }

        if (Game.racketPositionX < 0) {
            Game.racketPositionX = 0;
        }
    }

    static drawRacket () {
        Game.ctx.fillStyle = Game.racketColor;
        Game.ctx.fillRect (Game.racketPositionX, Game.racketPositionY, Game.racketWidth, Game.racketHeight);
    }

    static animate() {
        setInterval(Game.draw, 1000/Game.frameRate);
    }

    static countTime () {
        Game.countFrame++;
        if (Game.countFrame > Game.debugRate) {
            Game.seconds++;
            Game.countFrame=0;
            Game.consoleDebug();
        }

        document.dispatchEvent(new CustomEvent('onFrame', {detail : Game.getInfo()}));

        Game.resetStatus();
    }

    static getInfo () {
        var info = {
            'hits'              : Game.hits, 
            'misses'            : Game.misses,
            'seconds'           : Game.seconds,
            'status'            : Game.status,
            
            'racketWidth'       : Game.racketWidth,
            'racketHeight'      : Game.racketHeight,
            'racketPositionX'   : Game.racketPositionX,
            'racketPositionY'   : Game.racketPositionY,
    
            'ballWidth'         : Game.ballWidth,
            'ballHeight'        : Game.ballHeight,
            'ballPositionX'     : Game.ballPositionX,
            'ballPositionY'     : Game.ballPositionY
        }
        return info;
    }

    static consoleDebug () {
        if (Game.debug) {
            console.log(Game.getInfo());
        }
    }
}