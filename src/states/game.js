import { Player } from '../components/player';
import { Positional } from '../components/positional';
import { Sprite } from '../components/sprite';
import { MAP_HEIGHT, MAP_WIDTH } from '../constants';
import { Entity } from '../entity';
import { handleInput } from '../systems/input';
import { moveEntities } from '../systems/movement';
import { render } from '../systems/render';
import { Level } from '../world/level';

export class Game {
  constructor(engine) {
    this.engine = engine;
    this.level = new Level(MAP_WIDTH, MAP_HEIGHT, this.engine.mapDisplay, 1);

    this.player = new Entity();
    this.player.addComponent(
      Positional,
      new Positional(this.level.playerSpawn.x, this.level.playerSpawn.y)
    );
    this.player.addComponent(Sprite, new Sprite('@', '#f00'));
    this.player.addComponent(Player, new Player());
    this.entities = [this.player];
  }

  update(event) {
    this.engine.mapDisplay.clear();

    if (event) {
      handleInput(event, this.entities);
    }
    moveEntities(this.entities, this.level);

    this.level.updateFov(this.player);

    this.level.render();
    render(this.engine.mapDisplay, this.entities);

    return this;
  }
}
