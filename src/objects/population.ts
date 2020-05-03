import Rocket from "./rocket";
import Target from "./target";
import { Vector } from "p5";
import DNA from "./dna";

export default class Population {
  rockets: Rocket[];
  matingPool: Rocket[];
  generation: number;

  constructor(
    public target: Target,
    public mutationRate: number = 0.01,
    public population: number = 150
  ) {
    this.populate();
  }

  populate() {
    for (let i = 0; i < this.population; i++) {
      const rocket = new Rocket();
      this.rockets.push(rocket);
    }
  }

  fitness() {
    const { location: tLocation } = this.target;
    const calculateFitness = r => {
      const dist = Vector.dist(tLocation, r.location);
      r.fitness = pow(1 / dist, 2);
    };
    this.rockets.forEach(calculateFitness);
  }

  getTotalFitness(): number {
    const totalFitness = this.rockets.reduce(
      ({ fitness: a }, { fitness: b }) => ({
        fitness: a + b
      }),
      { fitness: 0 }
    ).fitness;
    return totalFitness;
  }

  selection() {
    this.matingPool.length = 0;
    const totalFitness = this.getTotalFitness();

    this.rockets.forEach(rocket => {
      const normalizedFitness = rocket.fitness / totalFitness;
      const amount: number = round(normalizedFitness * 100);
      for (let i = 0; i < amount; i++) this.matingPool.push(rocket);
    });
  }

  pickRocketDNA(): DNA {
    return this.matingPool[randomIndex(this.matingPool.length)].dna;
  }

  reproduction() {
    this.rockets.forEach(rocket => {
      const a: DNA = this.pickRocketDNA();
      let b: DNA = this.pickRocketDNA();
      while (a === b) b = this.pickRocketDNA();
      const newDNA = a.crossOver(b, this.mutationRate);
      rocket.dna = newDNA;
    });
  }

  live() {
    this.rockets.forEach(rocket => rocket.run());
  }
}

const randomIndex = (len: number): number =>
  Math.round(Math.random() * (len - 1));
