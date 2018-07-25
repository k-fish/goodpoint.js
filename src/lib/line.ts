import Point from './point';

export default class Line {
  start: Point;
  end: Point;

  constructor({ start, end }) {
    Object.assign(this, { start, end });
  }

  get dx() {
    return this.end.x - this.start.x;
  }

  get dy() {
    return this.end.y - this.start.y;
  }

  get slope() {
    return this.dy / this.dx;
  }

  get angle() {
    return Math.atan2(this.dx, this.dy);
  }

  get perpendicularAngle() {
    return this.angle + Math.PI / 2;
  }

  get distance() {
    return Math.sqrt(this.dx * this.dx + this.dy * this.dy);
  }

  get midpoint() {
    return new Point({
      x: (this.start.x + this.end.x) / 2,
      y: (this.start.y + this.end.y) / 2
    });
  }

  extrapolatePoint({ x, y }, distance = 0, angle = this.angle) {
    return new Point({
      x: x + Math.sin(angle) * distance,
      y: y + Math.cos(angle) * distance
    });
  }

  perpendicularPoint(point, distance = 0) {
    const angle = this.perpendicularAngle;
    return this.extrapolatePoint(point, distance, angle);
  }

  offset(offset) {
    const offsetX = offset.x || offset;
    const offsetY = offset.y || offset;
    return new Line({
      start: new Point({
        x: this.start.x + offsetX,
        y: this.start.y + offsetY
      }),
      end: new Point({
        x: this.end.x + offsetX,
        y: this.end.y + offsetY
      })
    });
  }

  get linePath() {
    return `M${this.start.svg}  ${this.end.svg}`;
  }
}
