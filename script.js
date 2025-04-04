document.addEventListener('DOMContentLoaded', () => {
    const gameArena = document.getElementById('game-arena');
    const startButton = document.querySelector('.start-button');
    const scoreBoard = document.getElementById('score-board');
    const gameOverModal = document.getElementById('game-over-modal');
    const finalScore = document.getElementById('final-score');
    const restartButton = document.getElementById('restart-button');

    const CELL_SIZE = 20;
    const ARENA_SIZE = 500;
    let snake = [];
    let food = {};
    let dx = CELL_SIZE;
    let dy = 0;
    let score = 0;
    let gameSpeed = 200;
    let gameInterval = null;

    // Initialize game
    function initGame() {
        snake = [
            {x: 240, y: 240},
            {x: 220, y: 240},
            {x: 200, y: 240}
        ];
        food = generateFood();
        dx = CELL_SIZE;
        dy = 0;
        score = 0;
        gameSpeed = 200;
        scoreBoard.textContent = `Score: ${score}`;
    }

    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * (ARENA_SIZE/CELL_SIZE)) * CELL_SIZE,
                y: Math.floor(Math.random() * (ARENA_SIZE/CELL_SIZE)) * CELL_SIZE
            };
        } while(snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        return newFood;
    }

    function gameLoop() {
        moveSnake();
        if(checkCollision()) {
            endGame();
            return;
        }
        draw();
    }

    function moveSnake() {
        const head = {x: snake[0].x + dx, y: snake[0].y + dy};
        snake.unshift(head);

        if(head.x === food.x && head.y === food.y) {
            score += 10;
            scoreBoard.textContent = `Score: ${score}`;
            food = generateFood();
            if(gameSpeed > 50) gameSpeed -= 5;
        } else {
            snake.pop();
        }
    }

    function checkCollision() {
        const head = snake[0];
        return head.x < 0 || head.x >= ARENA_SIZE ||
               head.y < 0 || head.y >= ARENA_SIZE ||
               snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y);
    }

    function draw() {
        gameArena.innerHTML = '';
        
        snake.forEach(segment => {
            const snakeElement = document.createElement('div');
            snakeElement.className = 'snake';
            snakeElement.style.left = `${segment.x}px`;
            snakeElement.style.top = `${segment.y}px`;
            gameArena.appendChild(snakeElement);
        });

        const foodElement = document.createElement('div');
        foodElement.className = 'food';
        foodElement.style.left = `${food.x}px`;
        foodElement.style.top = `${food.y}px`;
        gameArena.appendChild(foodElement);
    }

    function handleKeyPress(e) {
        e.preventDefault();
        const key = e.key;
        const goingUp = dy === -CELL_SIZE;
        const goingDown = dy === CELL_SIZE;
        const goingLeft = dx === -CELL_SIZE;
        const goingRight = dx === CELL_SIZE;

        if(key === 'ArrowUp' && !goingDown) {
            dx = 0;
            dy = -CELL_SIZE;
        } else if(key === 'ArrowDown' && !goingUp) {
            dx = 0;
            dy = CELL_SIZE;
        } else if(key === 'ArrowLeft' && !goingRight) {
            dx = -CELL_SIZE;
            dy = 0;
        } else if(key === 'ArrowRight' && !goingLeft) {
            dx = CELL_SIZE;
            dy = 0;
        }
    }

    function startGame() {
        startButton.classList.add('hidden');
        gameOverModal.style.display = 'none';
        initGame();
        document.addEventListener('keydown', handleKeyPress);
        clearInterval(gameInterval);
        gameInterval = setInterval(gameLoop, gameSpeed);
    }

    function endGame() {
        clearInterval(gameInterval);
        gameInterval = null;
        document.removeEventListener('keydown', handleKeyPress);
        finalScore.textContent = score;
        gameOverModal.style.display = 'block';
    }

    function restartGame() {
        // Full reset of game state
        clearInterval(gameInterval);
        gameInterval = null;
        document.removeEventListener('keydown', handleKeyPress);
        gameOverModal.style.display = 'none';
        startButton.classList.remove('hidden');
        gameArena.innerHTML = '';
        initGame();
        
    }

    // Event listeners
    startButton.addEventListener('click', startGame);
    restartButton.addEventListener('click', (e) => {
        e.preventDefault();
        restartGame();
    });
    document.getElementById('exit-button').addEventListener('click', () => window.close());
});