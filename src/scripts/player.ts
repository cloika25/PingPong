import { Ball } from "./ball";
import { Game } from "./game";
import { Printer } from "./printer";
import { IBall, IPlayer, Setting } from "./setting";

export class Player {
  set: Setting;
  game: Game;
  player: IPlayer;

  ball: IBall;
  classBall: Ball;

  print: Printer;

  keyMap: Map<number, string>;

  shadowUp: number;
  shadowDown: number;

  yellowZone: boolean;
  ballReversStatus: boolean;

  up: boolean;
  down: boolean;

  constructor(game: Game, player: IPlayer) {
    this.game = game;
    this.player = player;
    this.set = game.set;

    this.ball = game.set.ball;
    this.classBall = game.ball;
    this.print = game.print;

    this.keyMap = new Map(player.keys);

    document.addEventListener('keydown',
      (e) => this.keyController(e, true));
    document.addEventListener('keyup',
      (e) => this.keyController(e, false));

    this.shadowUp = 0;
    this.shadowDown = 0;

    this.yellowZone = true;
    this.ballReversStatus = true;

  }

  keyController(e, state) {
    if (this.keyMap.has(e.keyCode)) {
      this[this.keyMap.get(e.keyCode)!] = state
    }
  }

  move() {
    const plHeight = this.set.playerHeight
    const plSpeed = this.set.playerSpeed
    /** Расстояние от стены до центра игрока */
    const plBorder = this.set.playerBorder
    const boxHeight = this.set.boxHeight

    if (this.up) {
      /** Если up === true, значит нажата клавиша Вверх */
      if (this.player.y > plBorder) {
        this.player.y -= plSpeed
      } else {
        this.player.y = plBorder
      }
      this.shadowUp = (plSpeed * 2)
    }
    else if (this.down) {
      /** Если down === true, т.е. клавиша 'вниз' нажата  */
      if ((this.player.y + plHeight + plBorder) < boxHeight) {
        this.player.y += plSpeed
      } else {
        this.player.y = (boxHeight - plHeight - plBorder)
      }
      this.shadowDown = (plSpeed * 2)
    } else {
      /** Если клавиши не нажаты, возвращаем "тень" в ноль  */
      this.shadowUp = 0
      this.shadowDown = 0
    }
  }

  checkYellowZone() {
    const plHeight = this.set.playerHeight

    if (this.ball.y > (this.player.y - this.shadowUp)
      && this.ball.y < (this.player.y + plHeight + this.shadowDown)) {
      this.yellowZone = true
    } else {
      this.yellowZone = false
    }
  }

  checkCollisionWithBall() {
    const plHeight = this.set.playerHeight

    /** Расстояние от мяча до игрока */
    let dx = this.ball.x - this.player.x
    let dy = this.ball.y - (this.player.y - this.shadowUp)

    /** Разница с тенью */
    let dyF = this.ball.y - (this.player.y + plHeight + this.shadowDown)
    /** Сумма радиусов мячика и платформы */
    let radSum = this.set.ballRadius + this.set.playerRadius

    /** Растояние от центра мячика, до края платформы. */
    let dY = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
    /** Растояние от центра мячика, до нижнего края платформы. */
    let dYF = Math.sqrt(Math.pow(dx, 2) + Math.pow(dyF, 2))
    let dX = Math.sqrt(Math.pow(dx, 2))

    if (dX <= radSum) {
      /** Произошел удар */
      if (this.yellowZone && this.ballReversStatus) {
        this.hitBall(this.ball.dx);
      }
    }
    if (this.ball.dy > 0) {
      if (dY <= radSum) {
        if (!this.yellowZone) {
          this.hitBall(this.ball.dx, this.ball.dy)
        }
      }
    }
    if (this.ball.dy < 0) {
      if (dYF <= radSum) {
        if (!this.yellowZone) {
          this.hitBall(this.ball.dx, this.ball.dy)
        }
      }
    }
  }

  hitBall: (dx: number, dy?: number) => void = (dx, dy) => {
    this.ball.dx = this.classBall.reverseBall(dx)
    if (dy) {
      /** Случай удара об ребро платформы */
      this.ball.dy = this.classBall.reverseBall(dy)
    }
    this.classBall.speedМagnifier()
    /** Нужно чтобы мяч не застрял в платформе */
    this.ballReversStatus = false;
    setTimeout(() => {
      this.ballReversStatus = true
    }, 500);
  }

  defaultSet() {
    this.player.y = this.set.playerYDefault
  }

  draw() {
    let x = this.player.x
    let yStart = this.player.y
    let yFinish = (this.player.y + this.set.playerHeight)
    const plColor = this.player.color
    const plWidth = (this.set.playerRadius * 2)

    this.print.drawPlayer(x, yStart, yFinish, plWidth, plColor)
  }

  update() {
    this.checkYellowZone()
    this.checkCollisionWithBall()
    this.move()
    this.draw()
  }

  support() {
    let x = this.player.x
    let yS = this.player.y - this.shadowUp
    let yF = this.player.y + this.set.playerHeight + this.shadowDown

    this.print.drawShadowPlayer(x, yS, yF)
    this.print.drawYellowZone(x, yS, yF)
  }


}