class Larva {

    static fromJson(antType, progress) {
        return new Larva(antType, progress);
    }

    constructor(antType, progress) {
        this.antType = antType;
        this.progress = progress;
    }
}

export {
    Larva
}