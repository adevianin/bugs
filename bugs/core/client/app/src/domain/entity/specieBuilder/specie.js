import { EventEmitter } from "@utils/eventEmitter";

class Specie extends EventEmitter {

    constructor(bodyChromosome, developmentChromosome, adaptationChromosome, buildingChromosome, combatChromosome, adjustingChromosome) {
        super();
        this.bodyChromosome = bodyChromosome;
        this.developmentChromosome = developmentChromosome;
        this.adaptationChromosome = adaptationChromosome;
        this.buildingChromosome = buildingChromosome;
        this.combatChromosome = combatChromosome;
        this.adjustingChromosome = adjustingChromosome;
    }

}

export {
    Specie
}