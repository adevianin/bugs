import { Specie } from "./specie";
import { SpecieChromosome } from "./specieChromosome";

class SpecieFactory {

    buildSpecieFromJson(specieJson) {
        let bodyChromosome =this._buildChromosome(specieJson.body);
        let developmentChromosome = this._buildChromosome(specieJson.development);
        let adaptationChromosome = this._buildChromosome(specieJson.adaptation);
        let buildingChromosome = this._buildChromosome(specieJson.building);
        let combatChromosome = this._buildChromosome(specieJson.combat);
        let adjustingChromosome = this._buildChromosome(specieJson.adjusting);

        return new Specie(bodyChromosome, developmentChromosome, adaptationChromosome, buildingChromosome, combatChromosome, adjustingChromosome);
    }

    _buildChromosome(chromosomeJson) {
        return new SpecieChromosome(chromosomeJson.activatedGenesIds, chromosomeJson.genes);
    }
}

export {
    SpecieFactory
}