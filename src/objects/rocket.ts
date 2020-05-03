import { Vector } from "p5";
import Target from "./target";
import DNA from "./dna";
import { Color } from "p5";

export default class Rocket {
  dna: DNA;
  fitness: number = 0;

  location: Vector;
  velocity: Vector;
  acceleration: Vector;

  size: number;
  rocketColor: Color;

  constructor(location?: Vector, size?: number, rocketColor?: Color) {
    this.location = location || Vector.random2D();
    this.size = size || random(1, 3);
    this.rocketColor = rocketColor || color(10, 200, 100);
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
    const { location, size, rocketColor: color } = this;
    const { x, y } = location;

    const p1 = {
      x: x - size / 2,
      y
    };

    const p2 = {
      x,
      y: y - size
    };

    const p3 = {
      x: x + size / 2,
      y
    };

    noStroke();
    fill(color);
    triangle(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
  }

  calculateFitness(target: Target) {
    const dist = Vector.dist(this.location, target.location);
    this.fitness = pow(1 / dist, 2);
  }

  geneCounter: number = 0;
  run() {
    this.applyForce(this.dna.genes[this.geneCounter]);
    this.geneCounter++;
    this.update();
  }
}
