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

  t.is(arrow.connection.line.distance, 329.2567387313432);

  t.false(html.includes('NaN'));
  t.false(html.includes('undefined'));

  t.snapshot(html);
});
