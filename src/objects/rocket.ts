import { Vector } from "p5";
import Target from "./target";

export default class Rocket {
  velocity: Vector = createVector();
  acceleration: Vector = createVector();
  color: number[] = [0, 200, 100];
  fitness: number = 0;

  constructor(
    public location: Vector = createVector(),
    public size: Vector = createVector(50, 50)
  ) {}

  applyForce(force: Vector) {
    this.acceleration.add(force);
  }

  update() {
    this.velocity.add(this.acceleration);
    this.location.add(this.velocity);
    this.acceleration.mult(0);
    this.draw();
    this.applyForce(Vector.random2D());
  }

  draw() {
    const { location, size, color } = this;
    const { x, y } = location;
    const { x: w, y: h } = size;

    noStroke();
    fill(color);
    rect(x, y, w, h);
  }

  calculateFitness(target: Target) {
    const dist = Vector.dist(this.location, target.location);
    this.fitness = pow(1 / dist, 2);
  }
}
