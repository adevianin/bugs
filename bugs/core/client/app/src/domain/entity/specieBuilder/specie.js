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

        this.bodyChromosome.on('change', this._onChromosomeChange.bind(this));
        this.developmentChromosome.on('change', this._onChromosomeChange.bind(this));
        this.adaptationChromosome.on('change', this._onChromosomeChange.bind(this));
        this.buildingChromosome.on('change', this._onChromosomeChange.bind(this));
        this.combatChromosome.on('change', this._onChromosomeChange.bind(this));
        this.adjustingChromosome.on('change', this._onChromosomeChange.bind(this));
    }

    _onChromosomeChange() {
        this.emit('change');
    }

}

export {
    Specie
}