interface Point {
  x: number;
  y: number;
}

interface BloopOptions {
  location?: Point;
  size?: Point;
  maxSpeed?: number;
}

export default class Bloop {
  location: Point;
  radius: number;
  maxSpeed: number;

  constructor(options: BloopOptions) {
    Object.assign(
      this,
      {
        location: {
          x: random(0, width),
          y: random(0, height)
        }
      },
      options
    );
  }
}
