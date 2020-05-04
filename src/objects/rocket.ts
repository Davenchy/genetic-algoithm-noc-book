import { Vector, Color } from "p5";
import Target from "./target";
import DNA from "./dna";

interface RocketOptions {
  size?: number;
  rocketColor?: Color;
  strokeWeight?: number;
}

export default class Rocket {
  dna: DNA;
  fitness: number = 0;

  location: Vector;
  velocity: Vector;
  acceleration: Vector;

  size: number;
  rocketColor: Color;
  strokeWeight: number;

  freeze: boolean = false;

  constructor(
    public target: Target,
    location?: Vector,
    options?: RocketOptions
  ) {
    this.location = location || randomLocation();

    Object.assign(
      this,
      {
        size: random(25, 40),
        rocketColor: color(10, 200, 100),
        strokeWeight: 3
      },
      options || {}
    );

    this.velocity = createVector();
    this.acceleration = createVector();
  }

  applyForce(force: Vector) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
  }

  draw() {
    const { location, size, rocketColor: color, strokeWeight: w } = this;
    const { x, y } = location;

    noStroke();
    fill(color);
    circle(x, y, size / 2);

    // to draw a triangle but for later
    const widthConstant = 0.4;
    // const p1 = {
    //   x: x - size * widthConstant,
    //   y
    // };

    // const p2 = {
    //   x,
    //   y: y - size
    // };

    // const p3 = {
    //   x: x + size * widthConstant,
    //   y
    // };

    // noFill();
    // stroke(color);
    // strokeWeight(w);
    // triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }

  calculateFitness() {
    this.fitness = pow(this.bounce / this.dist, 2);
  }

  get dist(): number {
    return Vector.dist(this.location, this.target.location);
  }

  get hitTarget(): boolean {
    return this.dist <= this.target.radius * 2;
  }

  bounce: number = 1;
  geneCounter: number = 0;
  run() {
    if (!this.freeze) {
      const gene = this.dna.genes[this.geneCounter];
      this.applyForce(gene);
    } else this.velocity.mult(0);

    if (this.hitTarget) {
      this.bounce++;
      this.freeze = true;
    }

    this.geneCounter++;
    this.update();
  }
}

const randomLocation = () => createVector(random(0, width), random(0, height));
