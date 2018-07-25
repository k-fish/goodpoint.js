import Line from './line';

export default class Point {
  x: number;
  y: number;

  constructor({ x, y } = { x: 0, y: 0 }) {
    Object.assign(this, { x, y });
  }

  get top() {
    return this.y;
  }

  get left() {
    return this.x;
  }

  static distanceBetween(start, end) {
    return new Line({ start, end }).distance;
  }

  clone() {
    return new Point({
      x: this.x,
      y: this.y
    });
  }

  get svg() {
    return `${this.x} ${this.y}`;
  }

  get toStyle() {
    return `top: ${this.top}px; left: ${this.left}px;`;
  }
}
