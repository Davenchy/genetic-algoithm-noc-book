import { Vector } from "p5";

export default class DNA {
  genes: Vector[];

  constructor(
    public population: number = 150,
    public maxVelocity: number = 0.1
  ) {}

  populate() {
    this.genes = [];

    for (let i = 0; i < this.population; i++) {
      const vector = randomGene(this.maxVelocity);
      this.genes.push(vector);
    }
  }

  crossOver(partner: DNA, mutationRate: 0.01): DNA {
    const getGene = (index: number, r: number = Math.random()): Vector =>
      r < mutationRate
        ? randomGene(this.maxVelocity)
        : r >= 0.5
        ? this.genes[index]
        : partner.genes[index];

    const childDNA = new DNA();
    for (let i = 0; i < this.population; i++) childDNA.genes.push(getGene(i));
    return childDNA;
  }
}

export function randomGene(maxVelocity: number): Vector {
  const vector: Vector = Vector.random2D();
  vector.mult(random(0, maxVelocity));
  return vector;
}
