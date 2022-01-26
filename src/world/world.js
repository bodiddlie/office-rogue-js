import * as ROT from 'rot-js';
import { ENTER_TILE, FLOOR_TILE, STAIR_DOWN, WALL_TILE } from './tiles';
import { Positional } from '../components/positional';
import { getDisplayOptions } from '../index';
import Point from '../util/point';

const STOP_SIZE = 16;

class Leaf {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.first = null;
    this.second = null;
    this.room = null;
  }

  split() {
    if (this.first || this.second) return;

    if (this.w <= STOP_SIZE || this.h <= STOP_SIZE) return;

    let vertical = Math.random() > 0.5;
    if (vertical && this.w <= STOP_SIZE * 2) {
      vertical = false;
    } else if (!vertical && this.h <= STOP_SIZE * 2) {
      vertical = true;
    }

    if (vertical) {
      const min = Math.floor(this.w * 0.35);
      const max = Math.floor(this.w * 0.75);

      const width = ROT.RNG.getUniformInt(min, max);

      this.first = new Leaf(this.x, this.y, width, this.h);
      this.second = new Leaf(this.x + width, this.y, this.w - width, this.h);
    } else {
      const min = Math.floor(this.h * 0.35);
      const max = Math.floor(this.h * 0.75);

      const height = ROT.RNG.getUniformInt(min, max);

      this.first = new Leaf(this.x, this.y, this.w, height);
      this.second = new Leaf(this.x, this.y + height, this.w, this.h - height);
    }
    this.first.split();
    this.second.split();
  }

  buildRooms() {
    if (this.first || this.second) {
      if (this.first) {
        this.first.buildRooms();
      }
      if (this.second) {
        this.second.buildRooms();
      }
    } else {
      const width = ROT.RNG.getUniformInt(5, this.w - 1);
      const height = ROT.RNG.getUniformInt(5, this.h - 1);
      const x = ROT.RNG.getUniformInt(this.x, this.x + this.w - 1 - width);
      const y = ROT.RNG.getUniformInt(this.y, this.y + this.h - 1 - height);

      this.room = new Room(x, y, width, height);
    }
  }

  getRooms() {
    let rooms = [];

    if (this.first || this.second) {
      if (this.first) {
        rooms = rooms.concat(this.first.getRooms());
      }
      if (this.second) {
        rooms = rooms.concat(this.second.getRooms());
      }
    } else {
      rooms = [...rooms, this.room];
    }

    return rooms;
  }
}

class Room {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  getRandomPos() {
    const x = ROT.RNG.getUniformInt(this.x + 1, this.x + this.w - 2);
    const y = ROT.RNG.getUniformInt(this.y + 1, this.y + this.h - 2);
    return { x, y };
  }
}

export class World {
  constructor(width, height, display, floor) {
    this.floor = floor;
    this.display = display;
    this.width = width;
    this.height = height;
    this.cameraPosition = new Point();
    this._initMap(width, height);
  }

  _initMap() {
    this.leaf = new Leaf(0, 0, this.width, this.height);
    this.leaf.split();
    this.leaf.buildRooms();
    this.rooms = this.leaf.getRooms();
    this.map = new Array(this.height);
    const row = new Array(this.width);
    for (let x = 0; x < this.width; x++) {
      row[x] = { ...WALL_TILE };
    }

    for (let y = 0; y < this.height; y++) {
      this.map[y] = row.map((t) => ({ ...t }));
    }

    this.rooms.forEach((room) => {
      for (let x = room.x; x < room.x + room.w; x++) {
        for (let y = room.y; y < room.y + room.h; y++) {
          let tile = { ...FLOOR_TILE };
          if (
            x === room.x ||
            x === room.x + room.w - 1 ||
            y === room.y ||
            y === room.y + room.h - 1
          ) {
            tile = { ...WALL_TILE };
          }

          if (x > 0 && x < this.width && y > 0 && y < this.height) {
            this.map[y][x] = tile;
          }
        }
      }
    });

    // loop over rooms connecting current to next
    for (let i = 0; i < this.rooms.length - 1; i++) {
      const current = this.rooms[i];
      const next = this.rooms[i + 1];

      const curPos = current.getRandomPos();
      const nextPos = next.getRandomPos();
      const vertical = ROT.RNG.getUniformInt(0, 1);

      const startx = curPos.x < nextPos.x ? curPos.x : nextPos.x;
      const endx = curPos.x < nextPos.x ? nextPos.x : curPos.x;
      const starty = curPos.y < nextPos.y ? curPos.y : nextPos.y;
      const endy = curPos.y < nextPos.y ? nextPos.y : curPos.y;

      if (vertical) {
        for (let y = starty; y <= endy; y++) {
          this.map[y][curPos.x] = { ...FLOOR_TILE };
        }
        for (let x = startx; x <= endx; x++) {
          this.map[nextPos.y][x] = { ...FLOOR_TILE };
        }
      } else {
        for (let x = startx; x <= endx; x++) {
          this.map[curPos.y][x] = { ...FLOOR_TILE };
        }
        for (let y = starty; y <= endy; y++) {
          this.map[y][nextPos.x] = { ...FLOOR_TILE };
        }
      }
    }

    this.playerSpawn = this.getRandomWalkableTile();
    this.map[this.playerSpawn.y][this.playerSpawn.x] =
      this.floor > 1 ? { ...STAIR_DOWN } : { ...ENTER_TILE };
  }

  isWalkable(x, y) {
    if (this.map[y] && this.map[y][x]) {
      return this.map[y][x].isWalkable;
    }
    return false;
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
    this.cameraPosition = new Point(pos.x, pos.y);
    fov.compute(pos.x, pos.y, 10, (x, y, r, visibility) => {
      if (visibility) {
        this.map[y][x].isVisible = true;
        this.map[y][x].seen = true;
      }
    });
  }

  getRandomWalkableTile() {
    const index = ROT.RNG.getUniformInt(0, this.rooms.length);
    return this.rooms[index].getRandomPos();
  }

  isEntityVisible(entity) {
    const positional = entity.components.get(Positional);
    const { startX, endX, startY, endY } = this.getScreenBounds();
    return (
      positional.x >= startX &&
      positional.x < endX &&
      positional.y >= startY &&
      positional.y < endY
    );
  }

  getScreenBounds() {
    const opts = getDisplayOptions();
    const halfHeight = Math.floor(opts.height / 2);
    const halfWidth = Math.floor(opts.width / 2);
    const startY = this.cameraPosition.y - halfHeight;
    const endY = this.cameraPosition.y + halfHeight;
    const startX = this.cameraPosition.x - halfWidth;
    const endX = this.cameraPosition.x + halfWidth;
    return { startX, endX, startY, endY };
  }

  render() {
    const { startX, endX, startY, endY } = this.getScreenBounds();
    for (let y = startY; y <= endY; y++) {
      for (let x = startX; x <= endX; x++) {
        const row = this.map[y];
        if (!row) continue;
        const tile = row[x];
        if (tile) {
          if (tile.isVisible) {
            this.display.draw(
              x - startX,
              y - startY,
              tile.char,
              tile.fg,
              tile.bg,
            );
          } else if (tile.seen) {
            this.display.draw(
              x - startX,
              y - startY,
              tile.char,
              tile.fogFg,
              tile.fogBg,
            );
          }
        }
      }
    }
    // this.map.forEach((row, y) => {
    //   row.forEach((tile, x) => {
    //     if (tile.isVisible) {
    //       this.display.draw(x, y, tile.char, tile.fg, tile.bg);
    //     } else if (tile.seen) {
    //       this.display.draw(x, y, tile.char, tile.fogFg, tile.fogBg);
    //     }
    //   });
    // });
  }
}
