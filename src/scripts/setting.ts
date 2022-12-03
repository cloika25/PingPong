export type Side = 'left' | 'right';

export interface IPlayer {
  score: number;
  goalPointX: number;
  align: Side;
  x: number;
  y: number;
  yDefault: number;
  color: string;
  keys: [number, string][];
}

export interface IBall {
  /**  */
  x: number;
  y: number;
  /**  */
  dx: number;
  dy: number;
  /**  */
  speed: number;
}

export class Setting {
  /** Ширина поля */
  boxWidth = 800;
  boxHeight = 500;
  /** Радиуса закругления игрового поля */
  boxRound = 20;
  /** */
  boxColor = '#333333';
  lineWidth = 6;
  /**  */
  lineColor = '#232323';
  /**  */
  textColor = '#EBEBEB';
  /**  */
  supportColorRed = '#FA0556';
  /**  */
  supportColorYellow = '#FAC405';
  /**  */
  ballSpeed = 7;
  /** */
  ballRadius = 8;
  /**  */
  ballXDefault = this.boxWidth / 2;
  ballYDefault = this.boxHeight / 2;
  /**  */
  ballColor = '#EBEBEB';
  /**  */
  ballHitScore = 0;
  /**  */
  ball: IBall;
  /** playerThickness */
  playerRadius = 7;
  playerHeight = 80;
  playerSpeed = 8;
  /**  */
  playerBorder = this.playerRadius * 3;
  playerSpace = this.playerRadius * 6;
  /**  */
  playerYDefault = (this.boxHeight / 2) - (this.playerHeight / 2);
  /**  */
  playerL: IPlayer;
  /**  */
  playerR: IPlayer;

  drawYellow: boolean;

  constructor() {
    this.ball = {
      x: this.ballXDefault,
      y: this.ballYDefault,
      dy: 0,
      dx: 0,
      speed: this.ballSpeed
    }
    this.playerL = {
      score: 0,
      goalPointX: this.boxWidth - this.playerSpace * 2,
      align: 'left',
      x: this.playerSpace,
      y: this.playerYDefault,
      yDefault: (this.boxHeight / 2) - (this.playerHeight / 2),
      color: '#A55F02',
      keys: [[87, 'up'], [83, 'down']],
    };
    this.playerR = {
      score: 0,
      goalPointX: this.playerSpace * 2,
      align: 'left',
      x: this.boxWidth - (this.playerSpace),
      y: this.playerYDefault,
      yDefault: (this.boxHeight / 2) - (this.playerHeight / 2),
      color: '#38887A',
      keys: [[38, 'up'], [40, 'down']],
    }
    this.drawYellow = false
  }
}