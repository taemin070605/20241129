// JavaScript
const themeSelection = document.getElementById('theme-selection');
const gameCanvas = document.getElementById('gameCanvas');
const endScreen = document.getElementById('end-screen');
const restartButton = document.getElementById('restart-button');
const highScoresElement = document.createElement('div');
endScreen.appendChild(highScoresElement);
const ctx = gameCanvas.getContext('2d');

let snake = [{ x: 200, y: 200 }];
let direction = { x: 20, y: 0 };
let food = { x: 300, y: 300 };
let theme = '';
let gameInterval;
let backgroundImage = new Image();
let score = 0;
let highScores = [];

// Handle theme selection
document.querySelectorAll('.theme-button').forEach(button => {
    const imgElement = document.createElement('img');
    switch (button.dataset.theme) {
        case 'theme1':
            imgElement.src = 'picture.jpeg';
            break;
        case 'theme2':
            imgElement.src = 'picture1.jpeg';
            break;
        case 'theme3':
            imgElement.src = 'picture2.jpeg';
            break;
    }
    imgElement.style.width = '100px';
    imgElement.style.height = '100px';
    imgElement.style.display = 'block';
    imgElement.style.margin = '10px auto';
    button.appendChild(imgElement);

    button.addEventListener('click', () => {
        theme = button.dataset.theme;
        backgroundImage.src = imgElement.src;
        backgroundImage.onload = () => {
            themeSelection.style.display = 'none';
            gameCanvas.style.display = 'block';
            startGame();
        };
    });
});

// Start the game
function startGame() {
    snake = [{ x: 200, y: 200 }];
    direction = { x: 20, y: 0 };
    score = 0;
    placeFood();
    gameInterval = setInterval(updateGame, 150);
}

// Update game state
function updateGame() {
    // Move snake
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(head);

    // Check if snake eats food
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        placeFood();
    } else {
        snake.pop();
    }

    // Check for collisions
    if (head.x < 0 || head.y < 0 || head.x >= gameCanvas.width || head.y >= gameCanvas.height || snakeCollision(head)) {
        gameOver();
        return;
    }

    // Draw everything
    drawGame();
}

// Draw the game elements
function drawGame() {
    // Draw background image
    ctx.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    ctx.drawImage(backgroundImage, 0, 0, gameCanvas.width, gameCanvas.height);
    
    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x, part.y, 20, 20));

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, 20, 20);

    // Draw score
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
}

// Place food at a random location
function placeFood() {
    food.x = Math.floor(Math.random() * (gameCanvas.width / 20)) * 20;
    food.y = Math.floor(Math.random() * (gameCanvas.height / 20)) * 20;
}

// Check if snake collides with itself
function snakeCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

// End the game
function gameOver() {
    clearInterval(gameInterval);
    gameCanvas.style.display = 'none';
    endScreen.style.display = 'block';
    updateHighScores(score);
    displayHighScores();
}

// Restart the game
restartButton.addEventListener('click', () => {
    endScreen.style.display = 'none';
    themeSelection.style.display = 'block';
});

// Handle keyboard input
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction.y === 0) direction = { x: 0, y: -20 };
            break;
        case 'ArrowDown':
            if (direction.y === 0) direction = { x: 0, y: 20 };
            break;
        case 'ArrowLeft':
            if (direction.x === 0) direction = { x: -20, y: 0 };
            break;
        case 'ArrowRight':
            if (direction.x === 0) direction = { x: 20, y: 0 };
            break;
    }
});

// Update high scores
function updateHighScores(score) {
    highScores.push(score);
    highScores.sort((a, b) => b - a);
    if (highScores.length > 3) {
        highScores = highScores.slice(0, 3);
    }
}

// Display high scores
function displayHighScores() {
    highScoresElement.innerHTML = '<h3>Top 3 High Scores</h3>';
    highScores.forEach((score, index) => {
        highScoresElement.innerHTML += `<p>${index + 1}. ${score} points</p>`;
    });
}
