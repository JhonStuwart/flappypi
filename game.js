const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

/* =========================
   RESPONSIVIDADE REAL
========================= */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let WIDTH = canvas.width;
let HEIGHT = canvas.height;

/* =========================
   FÍSICA
========================= */
const GRAVITY = 0.35;
const FLAP = -7.5;

/* =========================
   CANOS
========================= */
let pipeSpeed = 2.2;
const SPEED_INCREASE = 0.0005;
const PIPE_GAP = 150;
const PIPE_WIDTH = 52;

/* =========================
   ESTADOS
========================= */
let state = "MENU"; // MENU | READY | PLAYING | GAME_OVER
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;
let backgroundType = "day";

/* =========================
   IMAGENS
========================= */
const bgDay = new Image();
bgDay.src = "assets/sprites/background-day.png";

const bgNight = new Image();
bgNight.src = "assets/sprites/background-night.png";

const baseImg = new Image();
baseImg.src = "assets/sprites/base.png";

const pipeImg = new Image();
pipeImg.src = "assets/sprites/pipe-red.png";

const gameOverImg = new Image();
gameOverImg.src = "assets/sprites/gameover.png";

const birdFrames = [
    "assets/sprites/bluebird-upflap.png",
    "assets/sprites/bluebird-midflap.png",
    "assets/sprites/bluebird-downflap.png"
].map(src => {
    const img = new Image();
    img.src = src;
    return img;
});

/* =========================
   CLASSES
========================= */
class Bird {
    constructor() {
        this.x = WIDTH * 0.25;
        this.y = HEIGHT / 2;
        this.vel = 0;
        this.frame = 0;
        this.radius = 12;
    }

    flap() {
        this.vel = FLAP;
        audio.wing.currentTime = 0;
        audio.wing.play();
    }

    update() {
        if (state === "PLAYING") {
            this.vel += GRAVITY;
            this.y += this.vel;
        }

        this.frame = (this.frame + 1) % birdFrames.length;

        if (
            state === "PLAYING" &&
            (this.y + this.radius >= HEIGHT - 100 || this.y - this.radius <= 0)
        ) {
            endGame();
        }
    }

    draw() {
        ctx.drawImage(
            birdFrames[this.frame],
            this.x - 12,
            this.y - 12
        );
    }
}

class Pipe {
    constructor(x) {
        this.x = x;
        this.top = Math.random() * (HEIGHT * 0.4) + 40;
        this.bottom = this.top + PIPE_GAP;
        this.passed = false;
    }

    update() {
        this.x -= pipeSpeed;

        if (!this.passed && this.x + PIPE_WIDTH < bird.x) {
            this.passed = true;
            score++;
            audio.point.play();
        }

        if (this.collide()) endGame();
    }

    collide() {
        return (
            bird.x + bird.radius > this.x &&
            bird.x - bird.radius < this.x + PIPE_WIDTH &&
            (
                bird.y - bird.radius < this.top ||
                bird.y + bird.radius > this.bottom
            )
        );
    }

    draw() {
        ctx.save();
        ctx.translate(this.x + PIPE_WIDTH / 2, this.top);
        ctx.scale(1, -1);
        ctx.drawImage(pipeImg, -PIPE_WIDTH / 2, 0, PIPE_WIDTH, HEIGHT);
        ctx.restore();

        ctx.drawImage(pipeImg, this.x, this.bottom, PIPE_WIDTH, HEIGHT);
    }
}

/* =========================
   VARIÁVEIS
========================= */
let bird = new Bird();
let pipes = [];

/* =========================
   FUNÇÕES
========================= */
function startGame(bg) {
    backgroundType = bg;
    state = "READY";
    score = 0;
    pipeSpeed = 2.2;

    bird = new Bird();
    pipes = [
        new Pipe(WIDTH + 200),
        new Pipe(WIDTH + 400)
    ];

    document.getElementById("menu").style.display = "none";
    document.getElementById("gameOver").style.display = "none";

    audio.menu.pause();
    audio.swoosh.play();
}

function endGame() {
    if (state !== "GAME_OVER") {
        audio.hit.play();
        setTimeout(() => audio.die.play(), 200);
    }

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    state = "GAME_OVER";
    document.getElementById("gameOver").style.display = "flex";
}

/* =========================
   DESENHO
========================= */
function draw() {
    WIDTH = canvas.width;
    HEIGHT = canvas.height;

    const bg = backgroundType === "day" ? bgDay : bgNight;
    ctx.drawImage(bg, 0, 0, WIDTH, HEIGHT);

    if (state !== "MENU") {
        bird.update();
        bird.draw();
    }

    pipes.forEach(p => {
        if (state === "PLAYING") p.update();
        p.draw();
    });

    if (state === "PLAYING") {
        pipeSpeed += SPEED_INCREASE;

        if (pipes[0].x < -PIPE_WIDTH) {
            pipes.shift();
            pipes.push(new Pipe(WIDTH + 200));
        }
    }

    if (state !== "MENU") {
        ctx.fillStyle = "white";
        ctx.font = "28px Arial";
        ctx.fillText(score, WIDTH / 2 - 10, 50);
    }

    ctx.drawImage(baseImg, 0, HEIGHT - 100, WIDTH, 100);

    if (state === "READY") {
        ctx.fillStyle = "white";
        ctx.font = "20px Arial";
        ctx.fillText(
            "Toque ou pressione ESPAÇO",
            WIDTH / 2 - 130,
            HEIGHT / 2 - 80
        );
    }

    if (state === "GAME_OVER") {
        const imgWidth = WIDTH * 0.6;
        const imgHeight = imgWidth * 0.3;

        ctx.drawImage(
            gameOverImg,
            (WIDTH - imgWidth) / 2,
            HEIGHT * 0.25,
            imgWidth,
            imgHeight
        );

        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.font = "26px Arial";
        ctx.fillText("Score: " + score, WIDTH / 2, HEIGHT * 0.55);
        ctx.font = "22px Arial";
        ctx.fillText("High Score: " + highScore, WIDTH / 2, HEIGHT * 0.62);
        ctx.font = "18px Arial";
        ctx.fillText("Toque ou ESPAÇO", WIDTH / 2, HEIGHT * 0.7);
        ctx.textAlign = "left";
    }
}

/* =========================
   LOOP
========================= */
function loop() {
    draw();
    requestAnimationFrame(loop);
}

/* =========================
   INPUT SEM DELAY
========================= */
function handleInput() {
    if (state === "READY") {
        state = "PLAYING";
        bird.flap();
    } else if (state === "PLAYING") {
        bird.flap();
    }
}

canvas.addEventListener("pointerdown", e => {
    e.preventDefault();
    handleInput();
});

document.addEventListener("keydown", e => {
    if (e.code === "Space") handleInput();
});

/* =========================
   MENU
========================= */
function updateHighScoreText() {
    const el = document.getElementById("highScoreText");
    if (el) el.textContent = "High Score: " + highScore;
}

document.getElementById("playBtn").onclick = () => {
    const bg = document.getElementById("bgSelect").value;
    startGame(bg);
};

document.getElementById("restartBtn").onclick = () => {
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("menu").style.display = "flex";
    state = "MENU";
    updateHighScoreText();
    audio.menu.play();
};

/* =========================
   DESBLOQUEIO DE ÁUDIO
========================= */
function unlockAudio() {
    for (let key in audio) {
        audio[key].play().then(() => {
            audio[key].pause();
            audio[key].currentTime = 0;
        }).catch(() => {});
    }
}
canvas.addEventListener("pointerdown", unlockAudio, { once: true });

/* START */
updateHighScoreText();
audio.menu.play();
loop();
