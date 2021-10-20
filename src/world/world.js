import * as ROT from 'rot-js';
import { MAP_WIDTH, MAP_HEIGHT } from '../constants';

const STOP_SIZE = 15;

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
      const min = Math.floor(this.w * 0.25);
      const max = Math.floor(this.w * 0.75);

      let firstWidth;
      let firstRatio;
      let secondRatio;
      do {
        firstWidth = ROT.RNG.getUniformInt(min, max);
        firstRatio = firstWidth / this.h;
        secondRatio = (this.w - firstWidth) / this.h;
        console.log('vert');
      } while (firstRatio < 0.25 || secondRatio < 0.25);

      this.first = new Leaf(this.x, this.y, firstWidth, this.h);
      this.second = new Leaf(
        this.x + firstWidth,
        this.y,
        this.w - firstWidth,
        this.h,
      );
    } else {
      const min = Math.floor(this.h * 0.25);
      const max = Math.floor(this.h * 0.75);

      let firstHeight;
      let firstRatio;
      let secondRatio;
      do {
        firstHeight = ROT.RNG.getUniformInt(min, max);
        firstRatio = firstHeight / this.w;
        secondRatio = (this.h - firstHeight) / this.h;
        console.log('hor');
      } while (firstRatio < 0.25 || secondRatio < 0.25);

      this.first = new Leaf(this.x, this.y, this.w, firstHeight);
      this.second = new Leaf(
        this.x,
        this.y + firstHeight,
        this.w,
        this.h - firstHeight,
      );
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
      //build room of random size in leaf
      const width = ROT.RNG.getUniformInt(3, Math.floor(this.w * 0.9));
      const height = ROT.RNG.getUniformInt(3, Math.floor(this.h * 0.9));
      const x = ROT.RNG.getUniformInt(this.x + 1, this.x + this.w - width - 1);
      const y = ROT.RNG.getUniformInt(this.y + 1, this.y + this.h - height - 1);
      // this.room = new Room(this.x + 1, this.y + 1, this.w - 1, this.h - 1);
      this.room = new Room(x, y, width, height);
    }
  }

  render(display) {
    if (this.first) {
      this.first.render(display);
    }
    if (this.second) {
      this.second.render(display);
    }
    if (this.room) {
      this.room.render(display);
    }
  }
}

class Room {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  render(display) {
    for (let x = this.x; x < this.x + this.w; x++) {
      for (let y = this.y; y < this.y + this.h; y++) {
        display.draw(x, y, '.', '#fff', '#000');
      }
    }
  }
}

export class World {
  constructor(width, height, display, floor) {
    this.floor = floor;
    this.display = display;
    this.width = width;
    this.height = height;
    this._initMap(width, height);
  }

  _initMap() {
    this.leaf = new Leaf(0, 0, this.width, this.height);
    this.leaf.split();
    this.leaf.buildRooms();
  }

  render() {
    console.log(this.leaf);
    this.leaf.render(this.display);
  }
}
