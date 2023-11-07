const score = document.querySelector('.score');
const highest = document.querySelector('.highest');
const gameScreen = document.querySelector('.gameScreen');

const controls = document.querySelectorAll('.control');

let clock = 100;
let acceleration = 1.1;
let foodX, foodY;
let snakeX = 4, snakeY = 4;
let velocityX = 0, velocityY = 0;
let points = 0;
let snakeBody = [];
let gameOver = false;
let intervalId;

let highestScore = localStorage.getItem('highest') || 0;
highest.innerText = `Highest Score: ${highestScore}`;

controls.forEach( arrow => {
    arrow.addEventListener("click", (e) => {
        if(e.target.classList.contains('top') && velocityY != 1) {
            velocityX = 0;
            velocityY = -1;
        } else if (e.target.classList.contains('down') && velocityY != -1) {
            velocityX = 0;
            velocityY = 1;
        } else if (e.target.classList.contains('left') && velocityX != 1) {
            velocityX = -1;
            velocityY = 0;
        } else if (e.target.classList.contains('right') && velocityX != -1) {
            velocityX = 1;
            velocityY = 0;
        }
    });
});

const accelerate = () => {
    clock = clock / acceleration;
    clearInterval(intervalId);
    intervalId = setInterval(start, clock);
}

const handleGameOver = () => {
    clearInterval(intervalId);
    alert(`Congrats!!! You got ${points} points, fell free to try again!`);
    location.reload();
}

const randomFoodCoordinates = () => {
    foodX = Math.floor(Math.random() * 20) + 1;
    foodY = Math.floor(Math.random() * 20) + 1;
}

const keyControls = (e) => {
    if(e.key === "ArrowUp" && velocityY != 1) {
        velocityX = 0;
        velocityY = -1;
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        velocityX = 0;
        velocityY = 1;
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        velocityX = -1;
        velocityY = 0;
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        velocityX = 1;
        velocityY = 0;
    }
}

document.addEventListener("keydown", keyControls);

const start = () => {
    if(gameOver) return handleGameOver();
    
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    if(snakeX === foodX && snakeY === foodY) {
        accelerate();
        randomFoodCoordinates();
        snakeBody.push([foodY, foodX]);
        points++;
        highestScore = points >= highestScore ? points : highestScore;

        localStorage.setItem("highest", highestScore);
        score.innerText = `Score: ${points}`;
        highest.innerText = `Highest Score: ${highestScore}`;        
    }

    snakeX += velocityX;
    snakeY += velocityY;

    for(let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }

    snakeBody[0] = [snakeX, snakeY];

    if(snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    for(let i = 0; i < snakeBody.length; i++) {
        html += `<div class="snake" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }

    gameScreen.innerHTML = html;
}

randomFoodCoordinates();
intervalId = setInterval(start, clock);
