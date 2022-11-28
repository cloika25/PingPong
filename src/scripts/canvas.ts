import { Setting } from "./setting";

type TDrawText = (text: string, x: number, y: number, fontSize: string, color?: string, align?: CanvasTextAlign, baseLine?: CanvasTextBaseline) => void;

export class Canvas {
  /** Настройки */
  set: Setting;
  /** Элемент канвас */
  canvas: HTMLCanvasElement;
  /** контекст для рисования фигур */
  ctx: CanvasRenderingContext2D | null;
  constructor(setting: Setting) {
    this.set = setting;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.canvas.width = this.set.boxWidth;
    this.canvas.height = this.set.boxHeight;
    document.querySelector('#game')?.appendChild(this.canvas)
  }

  drawText: TDrawText = (text, x, y, fontSize, color = this.set.textColor, align = "center", baseline = 'middle') => {
    if (this.ctx) {
      /** Указываем цвет заливки  */
      this.ctx.fillStyle = color
      /** Указываем шрифт и атрибуты */
      this.ctx.font = `bold ${fontSize} 'Fira Mono', monospace`
      /** Указываем выравнивание по краю */
      this.ctx.textAlign = align
      /** Указываем выравнивание по базовой линии */
      this.ctx.textBaseline = baseline;
      /** Пишем текст, передаем туда строку с текстом и ккординаты начальной точки */
      this.ctx.fillText(text, x, y);
    }
  }

  drawLine(xS: number, yS: number, xF: number, yF: number, lineWidth: number, color: string) {
    if (this.ctx) {
      /** Указываем, что линия будет с закруглениями на концах */
      this.ctx.lineCap = 'round'
      /** beginPath() начинает вектор */
      this.ctx.beginPath()
      /** Аргументами указываем координаты начальной точки линии */
      this.ctx.moveTo(xS, yS)
      /** Аргументами  указываем координаты конечной точки линии */
      this.ctx.lineTo(xF, yF)
      /** Указываем толщину линии, ее мы также передаем аргументом */
      this.ctx.lineWidth = lineWidth
      /** Указываем цвет обводки */
      this.ctx.strokeStyle = color
      /** Рисуем обводку (линию) */
      this.ctx.stroke()
      /** Завершем создание вектора */
      this.ctx.closePath()
    }
  }

  drawRectangleRound(x: number, y: number, width: number, height: number, radius: number, color: string) {
    if (this.ctx) {
      /** beginPath() начинает вектор */
      this.ctx.beginPath()
      /** Указываем координаты начальной точки линии */
      this.ctx.moveTo(x + radius, y)
      /** Указываем координаты следующей точки линии */
      this.ctx.lineTo(x + width - radius, y)
      /** Указываем координаты точки, до куда будет идти закругление */
      this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      /** Указываем координаты следующей точки линии и т.д. */
      this.ctx.lineTo(x + width, y + height - radius)
      this.ctx.quadraticCurveTo(x + width, y + height,
        x + width - radius, y + height)
      this.ctx.lineTo(x + radius, y + height)
      this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      this.ctx.lineTo(x, y + radius)
      this.ctx.quadraticCurveTo(x, y, x + radius, y)
      /** Завершем создание вектора */
      this.ctx.closePath()
      /** Указываем цвет заливки */
      this.ctx.fillStyle = color
      /** Создаем заливку */
      this.ctx.fill()
    }
  }

  drawCircle(x: number, y: number, radius: number, fillColor: string, stroke = true) {
    if (this.ctx) {
      this.ctx.beginPath()
      /** 
       *  Создаем арку. Агругументами выступают координаты 
       *  центра окружности, радиус, начальный угол в радианах
       *  и конечный угол в радианах.
       *  Math.PI*2 это число Пи умноженное на 2, дает замкнутый круг.       * 
       *  */
      this.ctx.arc(x, y, radius, 0, Math.PI * 2)
      /** Указываем цвет заливки  */
      this.ctx.fillStyle = fillColor
      /** Создаем заливку */
      this.ctx.fill()
      if (stroke) {
        /** 
         * Если нам не нужна обводка, то аргументам мы передаем false,
         * а по умолчанию обводка есть 
         * */
        /** Указываем толщину линии */
        this.ctx.lineWidth = 6
        /** Указываем цвет обводки */
        this.ctx.strokeStyle = this.set.lineColor
        /** Рисуем обводку */
        this.ctx.stroke()
      }
      this.ctx.closePath()
    }
  }

  drawArc(radius: number, sAngle: number, eAngle: number, color = this.set.textColor) {
    const centerW = (this.set.boxWidth / 2)
    const centerH = (this.set.boxHeight / 2)
    if (this.ctx) {
      this.ctx.lineCap = 'round'
      this.ctx.beginPath()
      this.ctx.arc(centerW, centerH, radius, sAngle, eAngle)
      this.ctx.lineWidth = 6
      this.ctx.strokeStyle = color
      this.ctx.stroke()
      this.ctx.closePath()
    }
  }

  clear() {
    this.ctx?.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

}