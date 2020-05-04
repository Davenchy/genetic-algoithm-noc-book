import { Vector, Color } from "p5";
import Rocket from "./rocket";

interface BlockOptions {
  location?: Vector;
  size?: Vector;
  color?: Color;
}

export default class Block {
  options: BlockOptions;
  constructor(options: BlockOptions = {}) {
    this.options = Object.assign(
      {
        location: createVector(random(0, width), random(0, height)),
        size: createVector(random(30, 100), random(30, 100)),
        color: color(200, 20, 30)
      },
      options
    );
  }

  isTouch(rocket: Rocket): boolean {
    const {
      location: { x: x2, y: y2 }
    } = rocket;
    const {
      location: { x: x1, y: y1 },
      size: { x: w, y: h }
    } = this.options;

    const distX = abs(x2 - x1);
    const distY = abs(y2 - y1);

    const isTouch = distX <= w / 2 && distY <= h / 2;
    return isTouch;
  }

  draw() {
    const { location, size, color } = this.options;
    const { x, y } = location;
    const { x: w, y: h } = size;

    rectMode(CENTER);
    noStroke();
    fill(color);
    rect(x, y, w, h);
  }
}
