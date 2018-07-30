import { test } from 'ava';
import browserEnv from 'browser-env';
import Arrow from './arrow';

const fakeElement = (height, width, top, left) => {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.width = `${width}px`;
  div.style.height = `${height}px`;
  div.style.top = `${top}px`;
  div.style.left = `${left}px`;

  div.getBoundingClientRect = () => {
    return {
      bottom: top + height,
      height,
      left,
      right: left + width,
      top,
      width
    };
  };

  return div;
};

test('renders', async t => {
  browserEnv();
  const div1 = fakeElement(100, 100, 77, 141);
  const div2 = fakeElement(100, 100, 314, 512);
  document.body.appendChild(div1);
  document.body.appendChild(div2);
  const arrow = new Arrow({ from: div1, to: div2 });

  const svg = document.createElement('div');
  svg.innerHTML = arrow.connection.simpleSVG;

  document.body.appendChild(svg);

  const html = document.documentElement.innerHTML;

  t.is(arrow.connection.curve.baseLine.distance, 289.2567387313432);

  t.is(arrow.connection.line.distance, 329.2567387313432);

  t.is(arrow.connection.controlAnchorLine.distance, 82.3141846828358);
  t.is(arrow.connection.startControlLine.distance, 92.03005623164641);
  t.is(arrow.connection.endControlLine.distance, 138.0450843474696);

  t.is(
    arrow.connection.curve.baseLine.linePath,
    'M122.14077691496625 103.12825791802678  360.21814018544165 267.4104237172109'
  );
  t.is(arrow.connection.curve.start.top, 103.12825791802678);
  t.is(arrow.connection.curve.start.left, 122.14077691496625);
  t.is(
    arrow.connection.curve.start.toStyle,
    'top: 103.12825791802678px; left: 122.14077691496625px;'
  );
  t.is(
    arrow.connection.curve.start.clone().toStyle,
    'top: 103.12825791802678px; left: 122.14077691496625px;'
  );

  t.false(html.includes('NaN'));
  t.false(html.includes('undefined'));

  t.snapshot(html);
});

test('check if divs are intersecting', async t => {
  const div1 = fakeElement(100, 100, 777, 23);
  const div2 = fakeElement(100, 100, 777, 23);

  const error = t.throws(() => {
    new Arrow({ from: div1, to: div2 }); // tslint:disable-line
  }, Error);

  t.is(
    error.message,
    "Arrow can't be drawn - The From and To elements are intersecting"
  );
});
