import { Game } from './game';

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

    OPTIONS.forEach((o, i) => {
      const { width, height } = this.engine.mapDisplay.getOptions();
      const x = Math.floor(width / 2);
      const y = Math.floor(height / 2 - 1 + i);

      this.engine.mapDisplay.draw(x, y, o, '#fff');
    });

    return this;
  }

  processInput(event) {}
}
