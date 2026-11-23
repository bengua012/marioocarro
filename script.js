const mario = document.querySelector('.mario');
const pipe = document.querySelector('.pipe');
const clouds = document.querySelector('.clouds');

const startButton = document.querySelector('#start-button');
const startScreen = document.querySelector('#start-screen');

const scoreElement = document.querySelector('#score');
const message = document.querySelector('#message');

let score = 0;
let gameStarted = false;
let gameOver = false;
let animationLoop;
let pipeCounted = false;
let previousPipeRight = 0;

function jump() {

    if (!gameStarted || gameOver) return;

    if (mario.classList.contains('jump')) return;

    mario.classList.add('jump');

    setTimeout(() => {
        mario.classList.remove('jump');
    }, 700);
}

function startGame() {

    score = 0;
    gameStarted = true;
    gameOver = false;
    pipeCounted = false;

    scoreElement.textContent = score;

    mario.src = 'imagem/personagem correndo.gif';
    mario.style.width = '200px';
    mario.style.marginLeft = '0';
    mario.style.bottom = '0';
    mario.style.animation = '';

    mario.classList.remove('jump');

    pipe.style.animation = 'none';
    pipe.style.left = '';
    pipe.style.right = '';

    clouds.style.animation = 'none';
    clouds.style.animationPlayState = 'running';

    void pipe.offsetWidth;
    void clouds.offsetWidth;

    pipe.style.animation = 'pipe-animation 2s infinite linear';
    clouds.style.animation = 'clouds-animation 20s infinite linear';

    // Registrar posição inicial do carro
    previousPipeRight = pipe.getBoundingClientRect().right;

    startScreen.classList.add('hidden');
    message.classList.add('hidden');

    if (animationLoop) {
        clearInterval(animationLoop);
    }

    animationLoop = setInterval(checkGame, 10);
}

function checkGame() {

    if (!gameStarted || gameOver) return;

    const marioRect = mario.getBoundingClientRect();
    const pipeRect = pipe.getBoundingClientRect();

    // CONTAGEM DE PONTOS
    if (
        previousPipeRight >= marioRect.left &&
        pipeRect.right < marioRect.left &&
        !pipeCounted
    ) {

        score++;

        scoreElement.textContent = score;

        pipeCounted = true;
    }

    // Detectar quando o carro reinicia
    if (pipeRect.left > previousPipeRight) {

        pipeCounted = false;
    }

    previousPipeRight = pipeRect.right;

    // ÁREA DE COLISÃO DO MARIO
    const marioHitbox = {
        left: marioRect.left + 40,
        right: marioRect.right - 40,
        top: marioRect.top + 35,
        bottom: marioRect.bottom - 20
    };

    // ÁREA DE COLISÃO DO CARRO
    const pipeHitbox = {
        left: pipeRect.left + 20,
        right: pipeRect.right - 20,
        top: pipeRect.top + 15,
        bottom: pipeRect.bottom - 10
    };

    const collision =
        marioHitbox.right > pipeHitbox.left &&
        marioHitbox.left < pipeHitbox.right &&
        marioHitbox.bottom > pipeHitbox.top &&
        marioHitbox.top < pipeHitbox.bottom;

    if (collision) {
        endGame();
    }
}

function endGame() {

    gameOver = true;
    gameStarted = false;

    clearInterval(animationLoop);

    const pipePosition = pipe.getBoundingClientRect().left;

    const marioPosition = Number.parseInt(
        window.getComputedStyle(mario).bottom
    );

    pipe.style.animation = 'none';
    pipe.style.left = `${pipePosition}px`;
    pipe.style.right = 'auto';

    mario.style.animation = 'none';
    mario.style.bottom = `${marioPosition}px`;

    mario.src = 'imagem/game-over.gif';

    mario.style.width = '300px';
    mario.style.marginLeft = '50px';

    clouds.style.animationPlayState = 'paused';

    message.textContent =
        `GAME OVER! Sua pontuação: ${score}`;

    message.classList.remove('hidden');

    startScreen.classList.remove('hidden');

    startButton.textContent = 'JOGAR NOVAMENTE';
}

// BOTÃO INICIAR
startButton.addEventListener('click', startGame);

// PULO PELO TECLADO
document.addEventListener('keydown', (event) => {

    if (
        event.code === 'Space' ||
        event.code === 'ArrowUp'
    ) {
        event.preventDefault();
        jump();
    }

});