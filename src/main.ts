import Evolution, { DNA, dict } from "./evolution";

const target = "to be or not to be";
const evo = new Evolution(target, 500);

evo.loop(2000, 1, function () {
  console.clear();
  console.log(`Fitness: ${this.bestFitness}, Generation: ${this.generation}`);
});

console.log(evo.bestDNA.toString());
