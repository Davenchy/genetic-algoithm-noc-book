import Rocket from "./rocket";
import Target from "./target";
import { Vector } from "p5";
import DNA from "./dna";

interface PopulationOptions {
  target: Target;
  mutationRate?: number;
  population?: number;
  lifeTime?: number;
  maxVelocity?: number;
}

export default class Population {
  rockets: Rocket[] = [];
  matingPool: Rocket[] = [];
  generation: number = 0;
  options: PopulationOptions;

  constructor(options: PopulationOptions) {
    this.options = Object.assign(
      {
        mutationRate: 0.01,
        population: 150,
        lifeTime: 500
      },
      options
    );
    this.populate();
  }

  populate() {
    const { population: pop, lifeTime, maxVelocity } = this.options;
    for (let i = 0; i < pop; i++) {
      const rocket = new Rocket();
      rocket.dna = new DNA(lifeTime, maxVelocity).populate();
      this.rockets.push(rocket);
    }
  }

  fitness() {
    const { location: loc } = this.options.target;
    const calculateFitness = r => {
      const dist = Vector.dist(loc, r.location);
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
