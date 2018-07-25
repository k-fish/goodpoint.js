import ElementAnchor from './element-anchor';
import Point from './point';

export default class ElementWrapper {
  private element: Element;
  private customAnchors: any;

  constructor({ element, customAnchors = () => undefined }) {
    Object.assign(this, { element, customAnchors });
  }

  get scrollAdjustedBoundingRectangle() {
    const { scrollX, scrollY } = window;
    const {
      top: clientTop,
      left: clientLeft,
      bottom: clientBottom,
      right: clientRight
    } = this.element.getBoundingClientRect();

    const top = clientTop + scrollY;
    const bottom = clientBottom + scrollY;
    const left = clientLeft + scrollX;
    const right = clientRight + scrollX;

    return {
      top,
      bottom,
      left,
      right,
      verticalCenter: (top + bottom) / 2,
      horizontalCenter: (left + right) / 2
    };
  }

  get defaultAnchors() {
    const {
      top,
      bottom,
      left,
      right,
      verticalCenter,
      horizontalCenter
    } = this.scrollAdjustedBoundingRectangle;

    const midpointThreshold = 30;
    return [
      new ElementAnchor(top, left),
      new ElementAnchor(top, horizontalCenter, midpointThreshold),
      new ElementAnchor(top, right),
      new ElementAnchor(verticalCenter, right, midpointThreshold),
      new ElementAnchor(verticalCenter, left, midpointThreshold),
      new ElementAnchor(bottom, left),
      new ElementAnchor(bottom, horizontalCenter, midpointThreshold),
      new ElementAnchor(bottom, right)
    ];
  }

  closestPairTo(toWrapper: ElementWrapper) {
    const from = this.anchors;
    const to = toWrapper.anchors;
    if (!from || !to) {
      return { from: null, to: null };
    }
    let minDistance = Number.MAX_VALUE;
    let pair;
    from.forEach(a =>
      to.forEach(b => {
        const distance =
          Point.distanceBetween(a, b) - a.threshold - b.threshold;
        if (distance < minDistance) {
          minDistance = distance;
          pair = { from: a, to: b };
        }
      })
    );
    return pair;
  }

  _customAnchors() {
    this.customAnchors(this.scrollAdjustedBoundingRectangle, ElementAnchor);
  }

  get anchors() {
    return this._customAnchors() || this.defaultAnchors;
  }
}
