import { Setting, Side } from './setting';
import { Ball } from './ball';
import { Player } from './player';
import { Printer } from './printer';

export class Game {
  set: Setting;
  print: Printer;
  ball: Ball;
  playerL: Player;
  playerR: Player;
  reqId: boolean;
  openPause: boolean;

  constructor() {
    this.set = new Setting();
    this.print = new Printer(this.set);
    this.ball = new Ball(this);
    this.playerL = new Player(this, this.set.playerL);
    this.playerR = new Player(this, this.set.playerR);

    this.reqId = true;

    this.firstLaunch();
    this.openPause = false;
  }

  firstLaunch() {
    /** Рисуем игровое поле */
    this.print.drawBackground();

    /** Вспомогательные функции. */
    this.support();

    /** Рисуем игроков */
    this.playerL.draw();
    this.playerR.draw();

    /** Рисуем цифры счета */
    this.print.drawScore();

    this.print.drawBriefing();

    this.ball.dropBall();

    this.print.drawBallDirection(4);

    this.print.centerText('3');

    setTimeout(() => {
      this.print.clear('text'),
        this.print.centerText('2')
    }, 800);

    setTimeout(() => {
      this.print.clear('text'),
        this.print.centerText('1')
    }, 1600);

    setTimeout(() => {
      this.print.clear('text'),
        this.print.centerText('Go')
    }, 2400);

    setTimeout(() => {
      this.print.clear('text'),
        this.print.clear('other')
      this.start(this.reqId)
    }, 3200);
  }

  start: (reqId?: boolean) => void = (reqId) => {
    if (reqId) {
      this.reqId = !!requestAnimationFrame((t) => this.timeLoop(t))
    }
  }

  timeLoop: FrameRequestCallback = () => {
    if (!this.openPause) {
      this.print.clear('gamelayer');

      /** Обновление мяча и игроков */
      this.ball.update()
      this.playerL.update()
      this.playerR.update()

      this.support()
      this.start(this.reqId)
    }
  }

  reStart(align: Side) {
    /** перезапуск  */
    this.reqId = false

    setTimeout(() => {
      this.print.clear('gamelayer');
      this.playerL.defaultSet();
      this.playerR.defaultSet();
      this.ball.defaultSet();

      this.playerL.draw();
      this.playerR.draw();
      this.ball.draw();

      this.support();
      this.ball.dropBall(align);
      this.print.drawBallDirection();
    }, 800)

    setTimeout(() => {
      this.print.clear('other');
      this.reqId = true;
      this.start(this.reqId);
    }, 2400)
  }

  continue() {
    this.start(this.reqId);
  }

  pauseToggle() {
    this.openPause = !this.openPause
    if (!this.openPause) {
      this.continue()
    }
  }

  support() {
    this.print.clear('support');
    this.playerL.support();
    this.playerR.support();
    this.print.drawAngleZone();
  }
}

