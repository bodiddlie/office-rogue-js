import { Player } from '../components/player';
import { Positional } from '../components/positional';
import { Sprite } from '../components/sprite';
import { handleInput } from '../systems/input';
import { moveEntities } from '../systems/movement';
import { render } from '../systems/render';

export class Game {
  constructor(engine) {
    this.engine = engine;
    this.entities = [
      {
        components: [
          new Positional(10, 10),
          new Sprite('@', '#f00'),
          new Player(),
        ],
      },
    ];
  }

  update(event) {
    this.engine.mapDisplay.clear();

    if (event) {
      handleInput(event, this.entities);
    }
    moveEntities(this.entities);

    render(this.engine.mapDisplay, this.entities);

    return this;
  }
}
