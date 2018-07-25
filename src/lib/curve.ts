import Point from './point';
import Line from './line';

export default class Curve {
  start: Point;
  end: Point;
  startControlPoint: Point;
  endControlPoint: Point;
  startControlGuide: Line;
  endControlGuide: Line;
  taperStartOffset: number;
  taperEndOffset: number;

  constructor({
    start,
    end,
    startControlPoint,
    endControlPoint,
    startControlGuide,
    endControlGuide,
    taperStartOffset,
    taperEndOffset
  }) {
    Object.assign(this, {
      start,
      end,
      startControlPoint,
      endControlPoint,
      startControlGuide,
      endControlGuide,
      taperStartOffset,
      taperEndOffset
    });
  }

  get baseLine() {
    return new Line({
      start: this.start,
      end: this.end
    });
  }

  get curvePath() {
    return `M${this.start.svg} C ${this.startControlPoint.svg} ${
      this.endControlPoint.svg
    } ${this.end.svg}`;
  }

  get reverseCurvePath() {
    return `L ${this.end.svg} C ${this.endControlPoint.svg} ${
      this.startControlPoint.svg
    } ${this.start.svg}`;
  }

  taper({ taperStartOffset, taperEndOffset }) {
    const taperStart = this.startControlGuide.perpendicularPoint(
      this.start,
      taperStartOffset
    );
    const taperEnd = this.endControlGuide.perpendicularPoint(
      this.end,
      taperEndOffset
    );

    const taperStartControl = this.startControlGuide.perpendicularPoint(
      this.startControlPoint,
      taperStartOffset
    );
    const taperEndControl = this.endControlGuide.perpendicularPoint(
      this.endControlPoint,
      taperEndOffset
    );

    return new Curve({
      start: taperStart,
      end: taperEnd,
      startControlPoint: taperStartControl,
      endControlPoint: taperEndControl,
      startControlGuide: this.startControlGuide,
      endControlGuide: this.endControlGuide,
      taperStartOffset: 0,
      taperEndOffset: 0
    });
  }

  get taperBottom() {
    const taperStartOffset = this.taperStartOffset;
    const taperEndOffset = -this.taperEndOffset;
    return this.taper({ taperStartOffset, taperEndOffset });
  }

  get taperTop() {
    const taperStartOffset = -this.taperStartOffset;
    const taperEndOffset = this.taperEndOffset;
    return this.taper({ taperStartOffset, taperEndOffset });
  }

  get taperedPath() {
    return `${this.taperTop.curvePath} ${this.taperBottom.reverseCurvePath} Z`;
  }
}
