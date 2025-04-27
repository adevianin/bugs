import { Specie } from "./specie";
import { SpecieChromosome } from "./specieChromosome";
import { Genome } from "../genetic/genome";
import { NuptialMale } from "./nuptialMale";
import { NuptialEnvironment } from "./nuptialEnvironment";

class NuptialEnvironmentFactory {

    buildNuptialEnvironment() {
        return new NuptialEnvironment();
    }

    buildSpecie(specieJson) {
        let chromosomes = []

        for (let specieChromosomeJson of specieJson['specieChromosomesSet']) {
            chromosomes.push(this._buildChromosome(specieChromosomeJson));
        }

        return new Specie(chromosomes);
    }

    buildNuptialMale(nuptialMaleJson) {
        let genome = Genome.buildFromJson(nuptialMaleJson.genome);
        return new NuptialMale(nuptialMaleJson.id, genome, nuptialMaleJson.stats, nuptialMaleJson.isLocal);
    }

    _buildChromosome(chromosomeJson) {
        return new SpecieChromosome(chromosomeJson.type, chromosomeJson.activatedGenesIds, chromosomeJson.genes);
    }
}

export {
    NuptialEnvironmentFactory
}