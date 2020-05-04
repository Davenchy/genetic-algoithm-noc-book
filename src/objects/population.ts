import Rocket from "./rocket";
import Target from "./target";
import { Vector } from "p5";
import DNA from "./dna";
import Block from "./block";

interface PopulationOptions {
  target: Target;
  mutationRate?: number;
  population?: number;
  lifeTime?: number;
  maxVelocity?: number;
  initLocation?: Vector;
  blocks: Block[];
}

interface MatingCard {
  score: number;
  rocket: Rocket;
}

export default class Population {
  rockets: Rocket[] = [];
  matingPool: MatingCard[] = [];
  generation: number = 0;
  totalFitness: number = 0;
  options: PopulationOptions;
  bestRocket: Rocket;

  constructor(options: PopulationOptions) {
    this.options = Object.assign(
      {
        mutationRate: 0.01,
        population: 150,
        lifeTime: 500,
        initLocation: createVector(width / 2, height - 100)
      },
      options
    );

    const { population: pop, lifeTime, maxVelocity } = this.options;

    if (pop < 2)
      throw new Error("at least 2 populations for the reproduction process");

    for (let i = 0; i < pop; i++) {
      const rocket = new Rocket(
        this.options.target,
        this.options.initLocation.copy()
      );
      rocket.dna = new DNA(lifeTime, maxVelocity).populate();
      this.rockets.push(rocket);
    }
  }

  fitness() {
    const calculateFitness = r => {
      r.calculateFitness();
      if (!this.bestRocket || this.bestRocket.fitness < r.fitness)
        this.bestRocket = r;
    };
    this.rockets.forEach(calculateFitness);
  }

  get getTotalFitness(): number {
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
    this.totalFitness = this.getTotalFitness;

    this.rockets.forEach(rocket => {
      const normalizedFitness = rocket.fitness / this.totalFitness;
      const matingCard: MatingCard = {
        score: normalizedFitness,
        rocket
      };

      this.matingPool.push(matingCard);
    });

    this.matingPool.sort(({ score: a }, { score: b }) =>
      a === b ? 0 : a > b ? 1 : -1
    );
  }

  pickRocketDNA(level: number = 0): DNA {
    if (this.matingPool.length === 0) return;
    const pointer = Math.random();
    let card: MatingCard;

    if (level >= 10)
      card = this.matingPool[randomIndex(this.matingPool.length)];
    else card = this.matingPool.filter(c => c.score >= pointer)[0];

    if (!card) return this.pickRocketDNA(level + 1);
    return card.rocket.dna;
  }

  reproduction() {
    this.generation++;
    this.rockets.length = 0;

    for (let i = 0; i < this.options.population; i++) {
      const a: DNA = this.pickRocketDNA();
      let b: DNA = this.pickRocketDNA();
      while (a === b) b = this.pickRocketDNA();

      const childDNA = a.crossOver(b, this.options.mutationRate);

      const rocket = new Rocket(
        this.options.target,
        this.options.initLocation.copy()
      );

      rocket.dna = childDNA;
      this.rockets.push(rocket);
    }
  }

  live() {
    this.rockets.forEach(rocket => rocket.run());
  }

  checkBlocks() {
    this.options.blocks.forEach(block => {
      this.rockets.forEach(rocket => {
        if (rocket.freeze) return;
        const isTouched = block.isTouch(rocket);
        if (isTouched) rocket.freeze = true;
      });
    });
  }
}

const randomIndex = (len: number): number =>
  Math.round(Math.random() * (len - 1));
