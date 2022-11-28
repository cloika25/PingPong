import { Canvas } from './canvas';
import { IBall, Setting, Side } from './setting';

export class Printer {
  set: Setting;
  ball: IBall;
  canvas: Map<string, Canvas>
  /** Для упрощения */
  bgCan: Canvas;
  scoreCan: Canvas;
  supCan: Canvas;
  othCan: Canvas;
  txtCan: Canvas;
  gameCan: Canvas;

  ballDirectionAngle: number;

  constructor(setting: Setting) {
    this.set = setting;
    this.ball = setting.ball;

    this.canvas = new Map([
      /**  */
      ['background', new Canvas(this.set)],
      /** Слой для отрисовки счета игроков */
      ['score', new Canvas(this.set)],
      /** Слой для впомогательных функций */
      ['support', new Canvas(this.set)],
      /** Дополнительный слой для разных задач  */
      ['other', new Canvas(this.set)],
      /** Слой для текста, появляющегося на экране */
      ['text', new Canvas(this.set)],
      /** Для мяча и игроков */
      ['gamelayer', new Canvas(this.set)]
    ])

    this.bgCan = this.canvas.get('background')!;
    this.scoreCan = this.canvas.get('score')!;
    this.supCan = this.canvas.get('support')!;
    this.othCan = this.canvas.get('other')!;
    this.txtCan = this.canvas.get('text')!;
    this.gameCan = this.canvas.get('gamelayer')!;

    this.ballDirectionAngle = 0;
  }

  drawBackground() {
    /** Высота и ширина игрового поля и всех слоев канваса */
    const width = this.set.boxWidth;
    const height = this.set.boxHeight;
    /** Радиус закругления углов игрового поля */
    const boxRound = this.set.boxRound;
    /** Цвет заливки игрового поля */
    const boxColor = this.set.boxColor;
    /** Толщина и цвет линий */
    const lineW = this.set.lineWidth;
    const lineColor = this.set.lineColor;
    /** Пространство от центра платформы игрока до стенки за ним */
    const plSpace = this.set.playerSpace;
    /** Пространство от краев игрока до стенки сверху и снизу */
    const plBorder = this.set.playerBorder;

    /** Рисуем основной прямоугольник игрового поля с закруглениями */
    this.bgCan.drawRectangleRound(0, 0, width, height,
      boxRound, boxColor);

    /** Рисуем вертикальную линию посередине */
    this.bgCan.drawLine((width / 2), 0, (width / 2),
      height, lineW, lineColor);

    /** Рисуем круг посередине, с радиусом в 1/4 высоты поля  */
    this.bgCan.drawCircle((width / 2), (height / 2),
      (height / 4), boxColor);

    /** Рисуем 2 линии под игроками с отступами от края */
    this.bgCan.drawLine(plSpace, plBorder, plSpace,
      (height - plBorder), lineW, lineColor);
    this.bgCan.drawLine((width - plSpace), plBorder,
      (width - plSpace), (height - plBorder), lineW, lineColor);
  }

  drawBriefing() {
    /** Цвета левого и правого игроков */
    const plLColor = this.set.playerL.color;
    const plRColor = this.set.playerR.color;
    /** Координаты x и y для текста с инструкцией */
    const controlXL = (this.set.playerSpace * 2);
    const controlXR = this.set.boxWidth - (this.set.playerSpace * 2);
    const controlY = (this.set.boxHeight / 17);

    this.gameCan.drawText('keys:', controlXL, (controlY * 8),
      '15px', plLColor, 'left');
    this.gameCan.drawText('W and S', controlXL, (controlY * 9),
      '20px', plLColor, 'left');
    this.gameCan.drawText('keys:', controlXR, (controlY * 8),
      '15px', plRColor, 'right');
    this.gameCan.drawText('Arrows', controlXR, (controlY * 9),
      '20px', plRColor, 'right');
  }

  drawScore() {
    const plLColor = this.set.playerL.color;
    const plRColor = this.set.playerR.color;

    const plLScore = this.set.playerL.score;
    const plRScore = this.set.playerR.score;

    /** Координаты x и y для отбражения очков игроков */
    const scoreXL = (this.set.boxWidth / 9 * 4);
    const scoreXR = (this.set.boxWidth / 9 * 5);
    const scoreY = (this.set.boxHeight / 20);
    /** Рисуем текст счета. Для каждого игрока свой цвет */
    this.scoreCan.drawText(plLScore.toString(), scoreXL, scoreY, '40px',
      plLColor, 'right', 'top');
    this.scoreCan.drawText(plRScore.toString(), scoreXR, scoreY, '40px',
      plRColor, 'left', 'top');
  }

  drawBallDirection(int = 2) {
    /** значение 2 для таймера после гола и 4 для начального таймера */
    /**
     * Ось координат канваса начинается сверху слева, поэтому
     * если направление мячика по X больше 0, то он летит вправо,
     * если направление мячика по Y больше 0, то он летит вниз
     * следовательно здесь мячик летит по диагонали вправо вниз
     *  */
    if (this.ball.dx > 0 && this.ball.dy > 0) {
      this.ballDirectionAngle = 6.3
    }
    if (this.ball.dx < 0 && this.ball.dy > 0) {
      this.ballDirectionAngle = 6.8
    }
    if (this.ball.dx < 0 && this.ball.dy < 0) {
      this.ballDirectionAngle = 7.3
    }
    if (this.ball.dx > 0 && this.ball.dy < 0) {
      this.ballDirectionAngle = 7.8
    }
    this.loopBallDirection(this.ballDirectionAngle - int)
  }

  loopBallDirection(someAngle: number) {
    /** Функция представляет собой цикл, перерисовывающий бегунок  */
    const rad = (this.set.boxHeight / 4);
    /** Радиус окружности такой же, как радиус круга на игровом поле */
    let angle = someAngle;

    this.othCan.drawArc(rad, Math.PI * angle - 0.3, Math.PI * angle)
    setTimeout(() => {
      angle += 0.1
      if (angle <= this.ballDirectionAngle) {
        this.clear('other')
        this.loopBallDirection(angle)
      }
    }, 60)
  }

  centerText(text: string, fontSize = '90px', color = this.set.textColor) {
    /** Функция рисует текст в центре экрана, по умолчанию использует */
    /** Координаты центра игрового поля */
    const centerW = (this.set.boxWidth / 2)
    const centerH = (this.set.boxHeight / 2)

    this.txtCan.drawText(text, centerW, centerH, fontSize, color)
  }

  drawBallHit() {
    this.centerText(this.set.ballHitScore.toString(), '70px', this.set.lineColor)
  }

  drawGoal(x: number, color: string, align: Side) {
    /** Рисуем +1 */
    this.txtCan.drawText('+1', x, this.ball.y, '20px', color, align)
    /** Рисуем надпись "Goal" в центре. Цветом забившего игрока */
    this.centerText('Goal!', '50px', color)
    setTimeout(() => {
      this.clear('text')
    }, 800)
  }

  drawBall() {
    /** Рисует мячик */
    let ballX = this.ball.x
    let ballY = this.ball.y
    let radius = this.set.ballRadius
    let color = this.set.ballColor

    this.gameCan.drawCircle(ballX, ballY, radius, color, false)
  }

  drawPlayer(xS: number, yS: number, yF: number, lineWidth: number, color: string) {
    /** Рисует игрока */
    this.gameCan.drawLine(xS, yS, xS, yF, lineWidth, color)
  }

  drawShadowPlayer(xS: number, yS: number, yF: number) {
    /** Отрисовка для дебага */
    const color = this.set.supportColorYellow
    const plWidth = (this.set.playerRadius * 2)

    this.supCan.drawLine(xS, yS, xS, yF, plWidth, color)
  }

  drawYellowZone(x: number, yS: number, yF: number) {
    /** Отрисовка зоны отскока */
    const color = this.set.supportColorYellow
    const center = (this.set.boxWidth / 2)

    this.supCan.drawLine(x, yS, center, yS, 1, color)
    this.supCan.drawLine(x, yF, center, yF, 1, color)
  }

  drawAngleZone() {
    /** Все возможные варианты отскока */
    const color = this.set.supportColorRed
    const radius = (this.set.boxHeight / 4)

    this.supCan.drawArc(radius, Math.PI * 0.2, Math.PI * 0.3, color)
    this.supCan.drawArc(radius, Math.PI * 0.7, Math.PI * 0.8, color)
    this.supCan.drawArc(radius, Math.PI * 1.2, Math.PI * 1.3, color)
    this.supCan.drawArc(radius, Math.PI * 1.7, Math.PI * 1.8, color)
  }


  clear(canvas: string) {
    this.canvas.get(canvas)?.clear()
  }

}