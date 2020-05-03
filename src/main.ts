import * as p5 from "p5";
import Population from "./objects/population";
import Target from "./objects/target";

let population: Population;
let lifeTime: number;
let lifeCounter: number;
let target: Target;

function setup() {
  createCanvas(600, 600);
  background(100);

  lifeTime = 500;
  lifeCounter = 0;

  target = new Target();

  population = new Population({ target, lifeTime });
}

function draw() {
  background(100);

  if (lifeCounter < lifeTime) {
    lifeCounter++;
    population.live();
  } else {
    lifeCounter = 0;
    population.fitness();
    population.selection();
    population.reproduction();
  }
}

window.setup = setup;
window.draw = draw;
