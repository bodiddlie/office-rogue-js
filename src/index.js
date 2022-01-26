import * as ROT from 'rot-js';
import { Menu } from './states/menu';

import './app.css';
import Point from './util/point';

let options = {
  width: 1,
  height: 1,
  fontSize: 22,
  fontFamily: 'metrickal, droid sans mono, monospace',
};

export function getDisplayOptions() {
  return { ...options };
}

class Engine {
  constructor() {
    this.mapDisplay = new ROT.Display(options);

    this.parent = document.querySelector('#map');
    this.parent.appendChild(this.mapDisplay.getContainer());

    this.state = new Menu(this);
    this.fit();
    this.state.resize();

    window.addEventListener('keydown', (event) => {
      this.update(event);
    });

    this.touchStart = null;

    this.parent.addEventListener('touchstart', (event) => {
      if (event.touches.length > 1) {
        this.touchStart = null;
        return;
      }

      this.touchStart = event.touches[0];
    });

    this.parent.addEventListener('touchend', (event) => {
      if (!this.touchStart) return;
      event._touchStart = this.touchStart;
      this.update(event);
    });

    window.addEventListener('resize', (event) => {
      this.fit();
      this.state.resize();
    });

    document.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });

    this.state = this.state.update();
  }

  update(event) {
    const state = this.state.update(event);
    if (state !== this.state) {
      this.state = state;
      this.state.update();
    }
  }

  fit() {
    let node = this.mapDisplay.getContainer();
    let available = new Point(
      this.parent.offsetWidth,
      this.parent.offsetHeight,
    );
    let size = this.mapDisplay.computeSize(available.x, available.y);
    size[0] += size[0] % 2 ? 2 : 1;
    size[1] += size[1] % 2 ? 2 : 1;
    options.width = size[0];
    options.height = size[1];
    this.mapDisplay.setOptions(options);

    let current = new Point(node.offsetWidth, node.offsetHeight);
    let offset = available.minus(current).scale(0.5);
    node.style.left = `${offset.x}px`;
    node.style.top = `${offset.y}px`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine();
  // Attach the engine instance to the window object for console debugging.
  window.ENGINE = engine;
});
