document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("themeToggle");

  function applyAutoTheme() {
    const now = new Date();
    const hour = now.getHours();
    const month = now.getMonth(); // 0 = январь

    const isSummer = month >= 4 && month <= 8; // май–сентябрь
    const eveningStart = isSummer ? 21 : 18;

    if (hour >= eveningStart || hour <= 6) {
      document.body.classList.add("dark");
      toggleBtn.textContent = "☀️";
    } else {
      toggleBtn.textContent = "🌙";
    }
  }

  function toggleTheme() {
    document.body.classList.toggle("dark");
    toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  }

  toggleBtn.addEventListener("click", toggleTheme);
  applyAutoTheme();
});

// --- Игра "Змейка" ---

// Инициализация элементов игры
const canvas = document.getElementById('gameCanvas');
if (canvas) { // Проверяем, существует ли canvas
  const ctx = canvas.getContext('2d');
  const scoreElement = document.getElementById('score');
  const startBtn = document.getElementById('startBtn');
  const pauseBtn = document.getElementById('pauseBtn');

  const gridSize = 15;
  const tileCount = canvas.width / gridSize;

  let snake = [];
  let apple = {};
  let grenade = {};
  let dx = 0;
  let dy = 0;
  let score = 0;
  let gameRunning = false;
  let gameLoop;

  function initGame() {
    snake = [
      {x: 10, y: 10},
      {x: 9, y: 10},
      {x: 8, y: 10}
    ];
    dx = 1;
    dy = 0;
    score = 0;
    scoreElement.textContent = score;
    randomizeApple();
    randomizeGrenade();
  }

  function randomizeApple() {
    apple = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount)
    };
  }

  function randomizeGrenade() {
    do {
      grenade = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    } while (isOnSnake(grenade));
  }

  function isOnSnake(pos) {
    return snake.some(segment => segment.x === pos.x && segment.y === pos.y);
  }

  function drawSnake() {
    ctx.fillStyle = '#4CAF50';
    for (let segment of snake) {
      ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
      ctx.strokeStyle = '#388E3C';
      ctx.strokeRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    }
  }

  function drawApple() {
    ctx.fillStyle = '#FF5722';
    ctx.beginPath();
    ctx.arc(
      apple.x * gridSize + gridSize / 2,
      apple.y * gridSize + gridSize / 2,
      gridSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  function drawGrenade() {
    ctx.fillStyle = '#795548';
    ctx.beginPath();
    ctx.arc(
      grenade.x * gridSize + gridSize / 2,
      grenade.y * gridSize + gridSize / 2,
      gridSize / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 1.5;
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const startX = grenade.x * gridSize + gridSize / 2 + Math.cos(angle) * (gridSize / 3);
      const startY = grenade.y * gridSize + gridSize / 2 + Math.sin(angle) * (gridSize / 3);
      const endX = grenade.x * gridSize + gridSize / 2 + Math.cos(angle) * (gridSize / 2);
      const endY = grenade.y * gridSize + gridSize / 2 + Math.sin(angle) * (gridSize / 2);
      ctx.beginPath();
      ctx.moveTo(startX, startY);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }
  }

  function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};

    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
      gameOver();
      return;
    }

    if (isOnSnake(head)) {
      gameOver();
      return;
    }

    snake.unshift(head);

    if (head.x === apple.x && head.y === apple.y) {
      score++;
      scoreElement.textContent = score;
      randomizeApple();
    } else {
      snake.pop();
    }

    if (head.x === grenade.x && head.y === grenade.y) {
      if (snake.length > 3) {
        snake.pop();
        score = Math.max(0, score - 1);
        scoreElement.textContent = score;
      }
      randomizeGrenade();
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawApple();
    drawGrenade();
  }

  function gameStep() {
    moveSnake();
    draw();
  }

  function gameOver() {
    clearInterval(gameLoop);
    gameRunning = false;
    alert(`Игра окончена! Счёт: ${score}`);
  }

  function startGame() {
    if (gameRunning) return;
    initGame();
    gameRunning = true;
    gameLoop = setInterval(gameStep, 150);
  }

  function pauseGame() {
    if (!gameRunning) return;
    clearInterval(gameLoop);
    gameRunning = false;
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' && dy === 0) {
      dx = 0;
      dy = -1;
    } else if (e.key === 'ArrowDown' && dy === 0) {
      dx = 0;
      dy = 1;
    } else if (e.key === 'ArrowLeft' && dx === 0) {
      dx = -1;
      dy = 0;
    } else if (e.key === 'ArrowRight' && dx === 0) {
      dx = 1;
      dy = 0;
    }
  });

  startBtn?.addEventListener('click', startGame);
  pauseBtn?.addEventListener('click', pauseGame);
}
