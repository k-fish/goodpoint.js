import ElementWrapper from './element-wrapper';
import Connection from './connection';

export default class Arrow {
  from: ElementWrapper;
  to: ElementWrapper;

  constructor({ from, to }: { from: Element, to: Element }) {
    const _from = new ElementWrapper({ element: from });
    const _to = new ElementWrapper({ element: to });
    Object.assign(this, { from: _from, to: _to });
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