import ElementWrapper from './element-wrapper';
import Connection from './connection';

export default class Arrow {
  from: ElementWrapper;
  to: ElementWrapper;

  constructor({ from, to }: { from: Element; to: Element }) {
    Object.assign(this, {
      from: new ElementWrapper({ element: from }),
      to: new ElementWrapper({ element: to })
    });

    if (this.from.intersects(this.to)) {
      console.log('intersection happened'); // tslint:disable-line
      throw new Error(
        "Arrow can't be drawn - The From and To elements are intersecting"
      );
    }
  }

  get connectionPair() {
    return this.from.closestPairTo(this.to);
  }

  get connection() {
    const { from, to } = this.connectionPair;
    return new Connection({
      start: from,
      end: to
    });
  }
}
