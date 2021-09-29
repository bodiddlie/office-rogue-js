import * as ROT from 'rot-js';
import { Menu } from './states/menu';

// We'll need to use variables like MAP_WIDTH and MAP_HEIGHT across various parts
// of our codebase as this project progresses, so let's go ahead and create a
// "constants" object that can be easily put in its own file later.
const constants = {
  MAP_WIDTH: 120,
  MAP_HEIGHT: 60,
};

class Engine {
  constructor() {
    // Create a rot.js canvas interface which we'll be using to render our
    // roguelike dungeon map. Set it as a property of the main Engine object so we
    // can access this Display instance from other methods.
    this.mapDisplay = new ROT.Display({
      width: constants.MAP_WIDTH,
      height: constants.MAP_HEIGHT,
    });

    this.mapDisplay.setOptions({
      fontSize: 16,
    });
    // getContainer() returns the canvas element. We then need to use
    // appendChild() to insert the canvas into the web page "document" or our map
    // will not be displayed.
    document.querySelector('#root').appendChild(this.mapDisplay.getContainer());

    // Print a test message in the upper-left corner of the display.
    this.state = new Menu(this);

    window.addEventListener('keydown', (event) => {
      const state = this.state.update(event);
      if (state !== this.state) {
        this.state = state;
        this.state.update();
      }
    });

    this.state = this.state.update();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  const engine = new Engine();
  // Attach the engine instance to the window object for console debugging.
  window.ENGINE = engine;
});
