import Point from './point';
import Line from './line';
import Curve from './curve';

export default class Connection {
  start: Point;
  end: Point;
  controlRatio: number;
  controlOffset: number;
  viewboxOffset: number;
  insetDistance: number;
  taperStartOffset: number;
  taperEndOffset: number;
  startControlRatio: number;
  endControlRatio: number;

  constructor(
    {
      start,
      end,
      viewboxOffset = 100,
      insetDistance = 20,
      taperStartOffset = 1,
      taperEndOffset = 2,
      startControlRatio = 0.5,
      endControlRatio = 0.75,
      controlRatio = 0.25,
      controlOffset = 0
    } = { start: null, end: null }
  ) {
    Object.assign(this, {
      start,
      end,
      viewboxOffset,
      insetDistance,
      taperStartOffset,
      taperEndOffset,
      startControlRatio,
      endControlRatio,
      controlOffset,
      controlRatio
    });
  }

  get defaultControlLength() {
    return this.controlRatio * this.lineDefinition.distance;
  }

  get controlLength() {
    return this.controlOffset || this.defaultControlLength;
  }

  get lineDefinition() {
    const { start, end } = this;
    return new Line({ start, end });
  }

  get line() {
    const { width, height } = this.boundingBox;
    const { dx, dy } = this.lineDefinition;
    const y1 = dy < 0 ? height : 0;
    const x1 = dx < 0 ? width : 0;

    const y2 = dy < 0 ? 0 : height;
    const x2 = dx < 0 ? 0 : width;
    return new Line({
      start: new Point({ x: x1, y: y1 }),
      end: new Point({ x: x2, y: y2 })
    }).offset({
      x: this.viewboxOffset,
      y: this.viewboxOffset
    });
  }

  get curve() {
    const start = this.startInsetLine.end;
    const end = this.endInsetLine.end;
    const {
      startControlAnchor,
      endControlAnchor,
      startControlGuide,
      endControlGuide,
      taperStartOffset,
      taperEndOffset
    } = this;
    return new Curve({
      start,
      end,
      startControlPoint: startControlAnchor,
      endControlPoint: endControlAnchor,
      startControlGuide,
      endControlGuide,
      taperStartOffset,
      taperEndOffset
    });
  }

  get startInsetAnchor() {
    const inset = this.insetDistance;
    return this.line.extrapolatePoint(this.line.start, inset);
  }

  get endInsetAnchor() {
    const inset = this.insetDistance;
    return this.line.extrapolatePoint(this.line.end, -inset);
  }

  get startInsetLine() {
    const inset = this.insetDistance;
    const midpointDistance = this.line.distance / 2;
    const ratio = inset / midpointDistance;
    const insetDistance = ratio * this.controlLength;
    const insetEndpoint = this.line.perpendicularPoint(
      this.startInsetAnchor,
      insetDistance
    );
    return new Line({
      start: this.startInsetAnchor,
      end: insetEndpoint
    });
  }

  get endInsetLine() {
    const inset = this.insetDistance;
    const midpointDistance = this.line.distance / 2;
    const ratio = inset / midpointDistance;
    const insetDistance = ratio * this.controlLength;
    const insetEndpoint = this.line.perpendicularPoint(
      this.endInsetAnchor,
      insetDistance
    );
    return new Line({
      start: this.endInsetAnchor,
      end: insetEndpoint
    });
  }

  get controlAnchor() {
    return this.line.perpendicularPoint(this.line.midpoint, this.controlLength);
  }

  get controlAnchorLine() {
    return new Line({
      start: this.line.midpoint,
      end: this.controlAnchor
    });
  }

  get startControlGuide() {
    return new Line({
      start: this.line.start,
      end: this.controlAnchor
    });
  }

  get endControlGuide() {
    return new Line({
      start: this.line.end,
      end: this.controlAnchor
    });
  }

  get startControlOffset() {
    return this.startControlGuide.distance * this.startControlRatio;
  }

  get endControlOffset() {
    return this.endControlGuide.distance * this.endControlRatio;
  }

  get startControlAnchor() {
    return this.startControlGuide.extrapolatePoint(
      this.startControlGuide.start,
      this.startControlOffset
    );
  }

  get endControlAnchor() {
    return this.endControlGuide.extrapolatePoint(
      this.endControlGuide.start,
      this.endControlOffset
    );
  }

  get startControlLine() {
    return new Line({
      start: this.line.start,
      end: this.startControlAnchor
    });
  }

  get endControlLine() {
    return new Line({
      start: this.line.end,
      end: this.endControlAnchor
    });
  }

  get boundingBox() {
    return {
      top: Math.min(this.end.y, this.start.y),
      left: Math.min(this.end.x, this.start.x),
      width: Math.abs(this.lineDefinition.dx),
      height: Math.abs(this.lineDefinition.dy)
    };
  }

  get offsetBoundingBox() {
    const offset = this.viewboxOffset;
    const boundingBox = this.boundingBox;
    return {
      top: boundingBox.top - offset,
      left: boundingBox.left - offset,
      width: boundingBox.width + 2 * offset,
      height: boundingBox.height + 2 * offset
    };
  }

  get simpleArrow() {
    return `<defs>
        <marker id="Triangle" viewBox="0 0 10 10" refX="3" refY="5" markerWidth="6" markerHeight="6" orient="auto">
          <path d="M 0 0 L 10 5 L 0 10 z" />
        </marker>
      </defs>
      <path d="${
        this.curve.curvePath
      }" fill="none" stroke="#000000" stroke-width = "2"
      marker-end="url(#Triangle)"/>
      <path d="${
        this.curve.taperedPath
      }" fill="#000000" stroke="#000000" stroke-width = "1"/>
    `;
  }

  get simpleSVG() {
    return `
      <svg 
      style="pointer-events: none; position: absolute; top: ${
        this.offsetBoundingBox.top
      }px; left: ${this.offsetBoundingBox.left}px;" width="${
      this.offsetBoundingBox.width
    }" height="${this.offsetBoundingBox.height}" 
      viewBox = "0 0 ${this.offsetBoundingBox.width} ${
      this.offsetBoundingBox.height
    }" version = "1.1">
      ${this.simpleArrow}
    </svg>
    `;
  }
}