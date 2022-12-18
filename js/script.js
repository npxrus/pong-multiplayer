const socket = io('http://localhost:3000');

// Canvas
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');
let paddleIndex = 0;

let width = 500;
let height = 700;

// Ракетка
let paddleHeight = 10;
let paddleWidth = 50;
let paddleDiff = 25;
let paddleX = [225, 225];
let trajectoryX = [0, 0];
let playerMoved = false;

// Мяч
let ballX = 250;
let ballY = 350;
let ballRadius = 5;
let ballDirection = 1;

// Скорость
let speedY = 2;
let speedX = 0;
let computerSpeed = 4;

// Счёт
let score = [0, 0];

// Создаём Canvas
function createCanvas() {
  canvas.id = 'canvas';
  canvas.width = width;
  canvas.height = height;
  document.body.appendChild(canvas);
  renderCanvas();
}

// Ожидаем соперника
// function renderIntro() {
//   // Фон Canvas
//   context.fillStyle = 'black';
//   context.fillRect(0, 0, width, height);

//   // Текст
//   context.fillStyle = 'white';
//   context.font = "32px Courier New";
//   context.fillText("Ждём соперника...", 20, (canvas.height / 2) - 30);
// }

// Отрисовываем Canvas
function renderCanvas() {
  // Фон Canvas
  context.fillStyle = 'black';
  context.fillRect(0, 0, width, height);

  // Цвет ракетки
  context.fillStyle = 'white';

  // Нижняя ракетка
  context.fillRect(paddleX[0], height - 20, paddleWidth, paddleHeight);

  // Верхняя ракетка
  context.fillRect(paddleX[1], 10, paddleWidth, paddleHeight);

  // Центральная линия
  context.beginPath();
  context.setLineDash([4]);
  context.moveTo(0, 350);
  context.lineTo(500, 350);
  context.strokeStyle = 'grey';
  context.stroke();

  // Мяч
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 2 * Math.PI, false);
  context.fillStyle = 'white';
  context.fill();

  // Счёт
  context.font = '32px Courier New';
  context.fillText(score[0], 20, canvas.height / 2 + 50);
  context.fillText(score[1], 20, canvas.height / 2 - 30);
}

// Сброс мяча
function ballReset() {
  ballX = width / 2;
  ballY = height / 2;
  speedY = 3;
}

// Двигаем мяч
function ballMove() {
  // Скорость по вертикали
  ballY += speedY * ballDirection;
  // Скорость по горизонтали
  if (playerMoved) {
    ballX += speedX;
  }
}

// Определяем отскок мяча
function ballBoundaries() {
  // Отскок от левой стороны
  if (ballX < 0 && speedX < 0) {
    speedX = -speedX;
  }
  // Отскок от правой стороны
  if (ballX > width && speedX > 0) {
    speedX = -speedX;
  }
  // Отскок от нижней ракетки
  if (ballY > height - paddleDiff) {
    if (ballX >= paddleX[0] && ballX <= paddleX[0] + paddleWidth) {
      // Увеличение скорости
      if (playerMoved) {
        speedY += 1;
        // Максимальная скорость
        if (speedY > 5) {
          speedY = 5;
        }
      }
      ballDirection = -ballDirection;
      trajectoryX[0] = ballX - (paddleX[0] + paddleDiff);
      speedX = trajectoryX[0] * 0.3;
    } else {
      // Сброс мяча
      ballReset();
      score[1]++;
    }
  }
  // Отскок от верхней ракетки
  if (ballY < paddleDiff) {
    if (ballX >= paddleX[1] && ballX <= paddleX[1] + paddleWidth) {
      // Увеличение скорости
      if (playerMoved) {
        speedY += 1;
        // Максимальная скорость
        if (speedY > 5) {
          speedY = 5;
        }
      }
      ballDirection = -ballDirection;
      trajectoryX[1] = ballX - (paddleX[1] + paddleDiff);
      speedX = trajectoryX[1] * 0.3;
    } else {
      // Сброс мяча
      if (computerSpeed < 6) {
        computerSpeed += 0.5;
      }
      ballReset();
      score[0]++;
    }
  }
}

// AI компьютера
function computerAI() {
  if (playerMoved) {
    if (paddleX[1] + paddleDiff < ballX) {
      paddleX[1] += computerSpeed;
    } else {
      paddleX[1] -= computerSpeed;
    }
    if (paddleX[1] < 0) {
      paddleX[1] = 0;
    } else if (paddleX[1] > width - paddleWidth) {
      paddleX[1] = width - paddleWidth;
    }
  }
}

// Анимация каждого кадра
function animate() {
  computerAI();
  ballMove();
  renderCanvas();
  ballBoundaries();
  window.requestAnimationFrame(animate);
}

// Старт игры и общий сброс
function startGame() {
  createCanvas();
  // renderIntro();

  paddleIndex = 0;
  window.requestAnimationFrame(animate);
  canvas.addEventListener('mousemove', (e) => {
    playerMoved = true;
    paddleX[paddleIndex] = e.offsetX;
    if (paddleX[paddleIndex] < 0) {
      paddleX[paddleIndex] = 0;
    }
    if (paddleX[paddleIndex] > width - paddleWidth) {
      paddleX[paddleIndex] = width - paddleWidth;
    }
    // Прячем курсор
    canvas.style.cursor = 'none';
  });
}

// Загрузка страницы
startGame();
