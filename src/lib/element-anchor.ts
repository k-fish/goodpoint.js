import Point from './point';

export default class ElementAnchor extends Point {
  x: number;
  y: number;
  threshold: number;

  constructor(y, x, threshold = 0) {
    super({ x, y });
    Object.assign(this, { threshold });
  }
}