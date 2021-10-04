import * as ROT from 'rot-js';

const MIN_WIDTH = 9;
const STOP_WIDTH = MIN_WIDTH * 2 + 1;

export class Level {
  constructor(width, height, display) {
    this.display = display;
    this.width = width;
    this.height = height;
    this._initMap(width, height);
  }

  _initMap(width, height) {
    this.map = new Array(height);
    const row = new Array(width);
    row.fill('.');

    for (let y = 0; y < height; y++) {
      this.map[y] = [...row];
      this.map[y][0] = '#';
      this.map[y][width - 1] = '#';
      if (y === 0 || y === height - 1) {
        this.map[y].fill('#');
      }
    }

    this._subdivide(1, 1, this.width - 2, this.height - 2);
  }

  _subdivide(x1, y1, x2, y2) {
    const w = x2 - x1 + 1;
    const h = y2 - y1 + 1;

    if (w >= h && w >= STOP_WIDTH) {
      this._subdivideWidth(x1, y1, x2, y2);
    } else if (h >= STOP_WIDTH) {
      this._subdivideHeight(x1, y1, x2, y2);
    }
  }

  _subdivideWidth(x1, y1, x2, y2) {
    const x = ROT.RNG.getUniformInt(x1 + MIN_WIDTH, x2 - MIN_WIDTH);

    for (let y = y1; y < y2 + 1; y++) {
      this.map[y][x] = '#';
    }

    this._subdivide(x1, y1, x - 1, y2);
    this._subdivide(x + 1, y1, x2, y2);

    let doory = ROT.RNG.getUniformInt(y1 + 1, y2 - 1);
    while (this.map[doory][x - 1] === '#' || this.map[doory][x + 1] === '#') {
      doory = ROT.RNG.getUniformInt(y1 + 1, y2 - 1);
    }
    this.map[doory][x] = '.';
  }

  _subdivideHeight(x1, y1, x2, y2) {
    const y = ROT.RNG.getUniformInt(y1 + MIN_WIDTH, y2 - MIN_WIDTH);

    for (let x = x1; x < x2 + 1; x++) {
      this.map[y][x] = '#';
    }

    this._subdivide(x1, y1, x2, y - 1);
    this._subdivide(x1, y + 1, x2, y2);

    let doorx = ROT.RNG.getUniformInt(x1 + 1, x2 - 1);
    while (this.map[y - 1][doorx] === '#' || this.map[y + 1][doorx] === '#') {
      doorx = ROT.RNG.getUniformInt(x1 + 1, x2 - 1);
    }
    this.map[y][doorx] = '.';
  }

  isWalkable(x, y) {
    return this.map[y][x] === '.';
  }

  render() {
    this.map.forEach((row, y) => {
      row.forEach((tile, x) => {
        this.display.draw(x, y, tile, '#fff');
      });
    });
  }
}
