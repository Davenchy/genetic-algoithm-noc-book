export const dict = "abcdefghijklmnopqrstuvwxyz ";
export const randomIndex = (len: number): number =>
  Math.round(Math.random() * (len - 1));

export const randomGene = (): string => dict[randomIndex(dict.length)];

export class DNA {
  genes: string[] = [];
  fitness: number = 0;

  populate(len: number): DNA {
    this.genes.length = 0;
    for (let i = 0; i < len; i++) this.genes.push(randomGene());
    return this;
  }

  calculateFitness(target: string): DNA {
    const myTarget: string[] = target.split("");
    const { genes } = this;
    const { length: len } = genes;
    let score: number = 0;

    for (let i = 0; i < len; i++) if (myTarget[i] === genes[i]) score++;

    this.fitness = score / len;
    return this;
  }

  crossOver(partner: DNA, mutationRate: number = 0.01): DNA {
    const getGene = (i: number, r: number = Math.random()): string =>
      r < mutationRate
        ? randomGene()
        : r >= 0.5
        ? this.genes[i]
        : partner.genes[i];

    const childDNA = new DNA();

    for (let i = 0; i < this.genes.length; i++) childDNA.genes.push(getGene(i));
    return childDNA;
  }

  toString() {
    return this.genes.join("");
  }
}

export default class Evolution {
  mutationRate: number = 0.01;
  totalFitness: number = 0;
  bestDNA: DNA;
  generation: number = 1;

  pool: DNA[] = [];
  matingPool: DNA[] = [];

  constructor(public target: string, public population: number = 150) {
    for (let i = 0; i < this.population; i++) {
      const dna = new DNA()
        .populate(this.target.length)
        .calculateFitness(this.target);

      this.pool.push(dna);
      this.totalFitness += dna.fitness;
      if (dna.fitness > this.bestFitness) this.bestDNA = dna;
    }

    this.fillMatingPool();
  }

  fillMatingPool(): Evolution {
    this.matingPool.length = 0;

    const total: number = this.pool.reduce(
      (a, b) => ({ fitness: a.fitness + b.fitness }),
      { fitness: 0 }
    ).fitness;

    this.pool.forEach(dna => {
      const len = dna.fitness * 100;
      for (let i = 0; i < len; i++) this.matingPool.push(dna);
    });
    return this;
  }

  pickDNA(): DNA {
    return this.matingPool[randomIndex(this.matingPool.length)];
  }

  generateGeneration(): Evolution {
    this.pool.length = 0;
    this.totalFitness = 0;
    this.generation++;

    for (let i = 0; i < this.population; i++) {
      const a = this.pickDNA();
      let b = this.pickDNA();
      while (a === b) b = this.pickDNA();

      const childDNA = a
        .crossOver(b, this.mutationRate)
        .calculateFitness(this.target);

      this.pool.push(childDNA);
      this.totalFitness += childDNA.fitness;

      if (childDNA.fitness > this.bestFitness) this.bestDNA = childDNA;
    }

    this.fillMatingPool();
    return this;
  }

  loop(maxIterations = 1000, maxFitness = 1, log: () => void) {
    while (this.generation < maxIterations) {
      this.generateGeneration();
      if (log) log.bind(this)();
      if (this.bestFitness >= maxFitness) break;
    }
  }

  get bestFitness(): number {
    const { bestDNA: dna } = this;
    return dna ? dna.fitness : 0;
  }
}
