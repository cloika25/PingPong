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

  constructor() {
    this.set = new Setting();
    this.print = new Printer(this.set);
    this.ball = new Ball(this);
    this.playerL = new Player(this, this.set.playerL);
    this.playerR = new Player(this, this.set.playerR);

    this.reqId = true;

    this.firstLaunch();
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

  timeLoop: FrameRequestCallback = (t) => {
    this.print.clear('gamelayer')
    // Отчищаем игровой слой, это нужно чтоб игроки и мяч
    // не оставляли за собой след из предыдущих отрисовок

    this.ball.update()
    this.playerL.update()
    this.playerR.update()
    // Функции обновления мячика и игроков, они, в свою очередь, 
    // вызывают все нужные функции внутри своих классов

    this.support()
    // Вспомогательные функции. Вызвав ее здесь, мы увидим
    // границы желтых зон, от которых зависит направление
    // в котором отбивается мячик от платформы

    this.start(this.reqId)
    // Снова вызываем start() вызывая зацикленность анимации.
    // В качестве значения передаем requestId, он содержит
    // метод requestAnimationFrame() и выдаст true
  }

  reStart(align: Side) {
    this.reqId = false
    // присваиваем reqId значение false, это останавливает анимацию  

    setTimeout(() => {
      // Делаем задержку в 0.8 секунд, и выполняем следующее:
      this.print.clear('gamelayer')
      // Отчищаем игровой слой            

      this.playerL.defaultSet()
      this.playerR.defaultSet()
      this.ball.defaultSet()
      // Возвращаем игрокам и мячику значения позиций по умолчанию   

      this.playerL.draw()
      this.playerR.draw()
      this.ball.draw()
      // Снова рисуем игроков и мячик, уже в стартовых позициях   

      this.support()
      // Вспомогательные функции. Вызвав ее здесь, мы увидим
      // 4 возможных направления для полета мячика

      this.ball.dropBall(align)
      // dropBall() выбирает рандомное направление для мячика 
      // Значение align укажет направление броска в забившего
      // предыдущий гол. Рандомость будет заключатся только в 
      // напрвлении вверх или вниз

      this.print.drawBallDirection()
      // Функция запускает белый бегунок по направлению,
      // определенному выше в dropBall()

    }, 800)
    setTimeout(() => {
      // Следующие действия произойдут уже через 1.6 секунды
      this.print.clear('other')
      // Отчищаем слой other, это удалит белый бегунок с экрана
      this.reqId = true
      this.start(this.reqId)
      // Снова присваиваем reqId значение true
      // и перезапускаем игровой цикл
      // Эти действия произойдут уже через 1.6 секунды,
      // после предыдущего setTimeout()
    }, 2400)
  }

  support() {
    // Функция вызывается в firstLaunch(), timeLoop() и reStart() 
    // и запускает отрисовку всех вспомогательных функций
    this.print.clear('support')
    // Отчищает свой слой канваса
    this.playerL.support()
    this.playerR.support()
    // Рисует желтые зоны игроков
    this.print.drawAngleZone()
    // Рисует 4 направления для мяча
  }
}

window.onload = () => {
  // Функция создает объект Game после того как все файлы
  // будут подгружены браузером  
  const game = new Game()
}