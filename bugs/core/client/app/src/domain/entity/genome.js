import { AntTypes } from "@domain/enum/antTypes";

class Genome {

    constructor(maternal, paternal) {
        this.maternal = maternal;
        this.paternal = paternal;
    }

    getAvaliableAntTypes() {
        let res = [
            AntTypes.WORKER,
            AntTypes.MALE,
            AntTypes.QUEEN,
        ];

        let isWarriorCasteInMaternalChromosome = !!this.maternal.development.warriorCasteGene;
        let isWarriorCasteInPaternalChromosome = this.paternal ? !!this.paternal.development.warriorCasteGene : false;
        if (isWarriorCasteInMaternalChromosome || isWarriorCasteInPaternalChromosome) {
            res.push(AntTypes.WARRIOR);
        }

        return res;
    }

}

export {
    Genome
}