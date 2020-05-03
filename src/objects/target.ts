import { Vector } from "p5";

export default class Target {
  location: Vector;
  radius: number = 10;
  color: number[] = [190, 0, 100];

  constructor(location?: Vector) {
    if (location) this.location = location;
    else {
      const x = random(this.radius, width - this.radius);
      const y = random(this.radius, height - this.radius);
      this.location = createVector(x, y);
    }
  }

  draw() {
    const { location, color, radius: r } = this;
    const { x, y } = location;

    noStroke();
    fill(color);
    circle(x, y, r * 2);
  }
}
