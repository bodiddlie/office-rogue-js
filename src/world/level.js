import * as ROT from 'rot-js';
import { Positional } from '../components/positional';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

const MIN_WIDTH = 9;
const STOP_WIDTH = MIN_WIDTH * 2 + 1;

const WALL_TILE = {
  char: '#',
  fg: '#999',
  bg: '#666',
  fogFg: '#444',
  fogBg: '#111',
  isWalkable: false,
  isVisible: false,
  seen: false,
};
const FLOOR_TILE = {
  char: '.',
  fg: '#888',
  bg: '#000',
  fogFg: '#333',
  fogBg: '#000',
  isWalkable: true,
  isVisible: false,
  seen: false,
};
const STAIR_DOWN = {
  char: '<',
  fg: '#fff',
  bg: '#000',
  fogFg: '#ccc',
  fogBg: '#000',
  isWalkable: true,
  isVisible: false,
  seen: false,
};
const STAIR_UP = {
  char: '>',
  fg: '#fff',
  bg: '#000',
  fogFg: '#ccc',
  fogBg: '#000',
  isWalkable: true,
  isVisible: false,
  seen: false,
};
const ENTER_TILE = {
  char: '&',
  fg: '#0f0',
  bg: '#000',
  fogFg: '#0c0',
  fogBg: '#000',
  isWalkable: true,
  isVisible: false,
  seen: false,
};

export class Level {
  constructor(width, height, display, floor) {
    this.floor = floor;
    this.display = display;
    this.width = width;
    this.height = height;
    this.rooms = [];
    this._initMap(width, height);
    console.table(this.rooms);
  }

  _initMap(width, height) {
    this.map = new Array(height);
    const row = new Array(width);
    for (let x = 0; x < width; x++) {
      row[x] = { ...FLOOR_TILE };
    }

    for (let y = 0; y < height; y++) {
      this.map[y] = row.map((t) => ({ ...t }));
      this.map[y][0] = { ...WALL_TILE };
      this.map[y][width - 1] = { ...WALL_TILE };
      if (y === 0 || y === height - 1) {
        for (let x = 0; x < width; x++) {
          this.map[y][x] = { ...WALL_TILE };
        }
      }
    }

    this._subdivide(1, 1, this.width - 2, this.height - 2);

    if (this.floor > 1) {
      this.playerSpawn = this.getRandomWalkableTile();
      this.map[this.playerSpawn.y][this.playerSpawn.x] = { ...STAIR_DOWN };
    } else {
      this.playerSpawn = this.getBuildingEntrance();
      this.map[this.playerSpawn.y][this.playerSpawn.x] = { ...ENTER_TILE };
    }
    const exitCoords = this.getRandomWalkableTile();
    this.map[exitCoords.y][exitCoords.x] = { ...STAIR_UP };
  }

  _subdivide(x1, y1, x2, y2) {
    const w = x2 - x1 + 1;
    const h = y2 - y1 + 1;

    let didSplit = false;
    if (w >= h && w >= STOP_WIDTH) {
      this._subdivideWidth(x1, y1, x2, y2);
      didSplit = true;
    } else if (h >= STOP_WIDTH) {
      this._subdivideHeight(x1, y1, x2, y2);
      didSplit = true;
    }

    return didSplit;
  }

  _subdivideWidth(x1, y1, x2, y2) {
    const x = ROT.RNG.getUniformInt(x1 + MIN_WIDTH, x2 - MIN_WIDTH);

    for (let y = y1; y < y2 + 1; y++) {
      this.map[y][x] = { ...WALL_TILE };
    }

    const firstSplit = this._subdivide(x1, y1, x - 1, y2);
    const secondSplit = this._subdivide(x + 1, y1, x2, y2);

    if (!firstSplit && !secondSplit) {
      this._addRoom(x1, y1, x2, y2);
    }

    let doory = ROT.RNG.getUniformInt(y1 + 1, y2 - 1);
    while (
      this.map[doory][x - 1].char === '#' ||
      this.map[doory][x + 1].char === '#'
    ) {
      doory = ROT.RNG.getUniformInt(y1 + 1, y2 - 1);
    }
    this.map[doory][x] = { ...FLOOR_TILE };
  }

  _subdivideHeight(x1, y1, x2, y2) {
    const y = ROT.RNG.getUniformInt(y1 + MIN_WIDTH, y2 - MIN_WIDTH);

    for (let x = x1; x < x2 + 1; x++) {
      this.map[y][x] = { ...WALL_TILE };
    }

    const firstSplit = this._subdivide(x1, y1, x2, y - 1);
    const secondSplit = this._subdivide(x1, y + 1, x2, y2);

    if (!firstSplit && !secondSplit) {
      this._addRoom(x1, y1, x2, y2);
    }

    let doorx = ROT.RNG.getUniformInt(x1 + 1, x2 - 1);
    while (
      this.map[y - 1][doorx].char === '#' ||
      this.map[y + 1][doorx].char === '#'
    ) {
      doorx = ROT.RNG.getUniformInt(x1 + 1, x2 - 1);
    }
    this.map[y][doorx] = { ...FLOOR_TILE };
  }

  _addRoom(x1, y1, x2, y2) {
    this.rooms.push({ x1, y1, x2, y2 });
  }

  isWalkable(x, y) {
    if (this.map[y] && this.map[y][x]) {
      return this.map[y][x].isWalkable;
    }
    return false;
  }

  getBuildingEntrance() {
    let x = ROT.RNG.getUniformInt(1, MAP_WIDTH - 2);
    const y = MAP_HEIGHT - 2;

    while (!this.isWalkable(x, y)) {
      x = ROT.RNG.getUniformInt(1, MAP_WIDTH - 1);
    }

    return { x, y };
  }

  getRandomWalkableTile() {
    let x = ROT.RNG.getUniformInt(1, MAP_WIDTH - 2);
    let y = ROT.RNG.getUniformInt(1, MAP_HEIGHT - 2);

    while (!this.isWalkable(x, y)) {
      x = ROT.RNG.getUniformInt(1, MAP_WIDTH - 2);
      y = ROT.RNG.getUniformInt(1, MAP_HEIGHT - 2);
    }

    return { x, y };
  }

  lightPasses(x, y) {
    return this.isWalkable(x, y);
  }

  updateFov(player) {
    for (let y = 0; y < this.height; y++) {
      for (let x = 0; x < this.width; x++) {
        this.map[y][x].isVisible = false;
      }
    }
    const fov = new ROT.FOV.PreciseShadowcasting(this.lightPasses.bind(this));
    const pos = player.components.get(Positional);
    fov.compute(pos.x, pos.y, 10, (x, y, r, visibility) => {
      if (visibility) {
        this.map[y][x].isVisible = true;
        this.map[y][x].seen = true;
      }
    });
  }

  render() {
    this.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        if (tile.isVisible) {
          this.display.draw(x, y, tile.char, tile.fg, tile.bg);
        } else if (tile.seen) {
          this.display.draw(x, y, tile.char, tile.fogFg, tile.fogBg);
        }
      });
    });
  }
}
