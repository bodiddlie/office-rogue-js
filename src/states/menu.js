import { Game } from './game';
import { getDisplayOptions } from '../index';

const OPTIONS = ['[N] Play a new game'];

export class Menu {
  constructor(engine) {
    this.engine = engine;
  }

  update(event) {
    this.engine.mapDisplay.clear();

    if (event && event.code === 'KeyN') {
      return new Game(this.engine);
    }

    this.drawMenu();

    return this;
  }

  resize() {
    this.drawMenu();
  }

  drawMenu() {
    this.engine.mapDisplay.clear();
    OPTIONS.forEach((o, i) => {
      const { width, height } = getDisplayOptions();
      const x = Math.floor(width / 2);
      const y = Math.floor(height / 2 - 1 + i);

      this.engine.mapDisplay.draw(x, y, o, '#fff');
    });
  }

  processInput(event) {}
}
