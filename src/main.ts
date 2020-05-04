import Population from "./objects/population";
import Target from "./objects/target";
import Block from "./objects/block";

console.clear();

let population: Population;
let lifeTime: number = 200;
let lifeCounter: number = 0;
let maxVelocity: number = 0.5;
let target: Target;

let blocks: Block[] = [];

function setup() {
  createCanvas(600, 600);
  background(100);

  target = new Target(createVector(random(50, width - 50), random(50, 150)));

  const randomSize = () => createVector(random(250, 350), random(20, 50));
  blocks.push(
    new Block({
      location: createVector(200, 250),
      size: randomSize()
    })
  );

  blocks.push(
    new Block({
      location: createVector(400, 400),
      size: randomSize()
    })
  );

  population = new Population({
    target,
    lifeTime,
    population: 1000,
    maxVelocity,
    blocks,
    initLocation: createVector(
      random(50, width - 50),
      random(height - 150, height - 50)
    )
  });
}

function draw() {
  background(100);
  target.draw();
  blocks.forEach(b => b.draw());
  population.checkBlocks();

  if (lifeCounter < lifeTime) {
    lifeCounter++;
    population.live();
  } else {
    lifeCounter = 0;
    population.fitness();
    population.selection();
    population.reproduction();

    console.log("Generation:", population.generation);
    console.log("Best Rocket:", population.bestRocket);
    console.log();
  }

  population.rockets.forEach(r => r.draw());
}

window.setup = setup;
window.draw = draw;
