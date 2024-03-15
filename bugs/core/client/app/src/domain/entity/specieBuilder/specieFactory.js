import { Specie } from "./specie";
import { SpecieChromosome } from "./specieChromosome";

class SpecieFactory {

    buildSpecieFromJson(specieJson) {
        let chromosomes = []

        for (let specieChromosomeJson of specieJson['specieChromosomesSet']) {
            chromosomes.push(this._buildChromosome(specieChromosomeJson));
        }

        return new Specie(chromosomes);
    }

    _buildChromosome(chromosomeJson) {
        return new SpecieChromosome(chromosomeJson.type, chromosomeJson.activatedGenesIds, chromosomeJson.genes);
    }
}

export {
    SpecieFactory
}