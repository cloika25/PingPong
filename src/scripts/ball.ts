import { Game } from './game'
import { Printer } from './printer';
import { IBall, IPlayer, Setting, Side } from './setting';

export class Ball {
  game: Game;
  set: Setting;
  ball: IBall;
  print: Printer;

  constructor(game: Game) {
    this.game = game;
    this.set = game.set;
    this.ball = game.set.ball;
    this.print = game.print;
  }

  getRandom() {
    /** Генерируем рандомное направление */
    return Math.random() * (1 - 0.8) + 0.8
  }

  getRandomDirection() {
    /** Из рандомного значения получаемся рандомное направление(-/+) */
    if (Boolean(Math.round(Math.random()))) {
      return this.getRandom()
    } else {
      return -this.getRandom()
    }
  }

  dropBall(player?: Side) {
    /** Определяем какой игрок забил гол */
    /** Генерируем рандомные значения для мяча */
    this.ball.dx = this.getRandomDirection()
    this.ball.dy = this.getRandomDirection()
    switch (player) {
      case 'left':
        /** Исключаем возможность полета налево */
        this.ball.dx = Math.abs(this.ball.dx)
        break
      case 'right':
        /** Исключаем возможность полета направо */
        this.ball.dx = -Math.abs(this.ball.dx)
        break
    }
  }

  move() {
    /** Двигаем мяч в пространстве */
    this.ball.x += (this.ball.dx * this.ball.speed)
    this.ball.y += (this.ball.dy * this.ball.speed)
  }

  checkCollisionWithWalls() {
    /** Будущие координаты мяча */
    let ballX = (this.ball.x + this.ball.dx)
    let ballY = (this.ball.y + this.ball.dy)
    /** Кооридината правой стены */
    const rightWall = (this.set.boxWidth - this.set.ballRadius)
    /** Координата левой стены */
    const leftWall = this.set.ballRadius
    /** Координата верхней стены  (0 + this.set.ballRadius)*/
    const TopWall = this.set.ballRadius
    /** Координата нижней стены */
    const BottomWall = (this.set.boxHeight - this.set.ballRadius)

    if (ballX >= rightWall) {
      /** Гол направо */
      this.ball.dx = this.reverseBall(this.ball.dx);
      this.goalProcess(this.set.playerL);
    }
    if (ballX <= leftWall) {
      /** Гол налево */
      this.ball.dx = this.reverseBall(this.ball.dx);
      this.goalProcess(this.set.playerR);
    }
    if (ballY >= BottomWall || ballY <= TopWall) {
      /** Отскок мяча */
      this.ball.dy = this.reverseBall(this.ball.dy)
    }
  }

  reverseBall(dir: number) {
    if (dir > 0) {
      return -this.getRandom()
    } else {
      return this.getRandom()
    }
  }

  goalProcess(winner: IPlayer) {
    /** Процесс завершения раунда */
    winner.score++;
    this.print.clear('score');
    this.print.drawScore();
    this.print.clear('text');
    this.set.ballHitScore = 0;
    this.print.drawGoal(winner.goalPointX, winner.color, winner.align);
    this.game.reStart(winner.align);
  }

  speedМagnifier() {
    /** Ускорение  */
    this.ball.speed += 0.1
    this.set.ballHitScore++
    this.print.clear('text')
    this.print.drawBallHit()
  }

  defaultSet() {
    /** Сброс скорости и координат */
    this.ball.x = this.set.ballXDefault
    this.ball.y = this.set.ballYDefault
    this.ball.speed = this.set.ballSpeed
  }

  draw() {
    this.print.drawBall()
  }

  update() {
    /** Проверка удара, передвижение и отрисовка */
    this.checkCollisionWithWalls()
    this.move()
    this.draw()
  }

}