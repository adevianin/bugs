class Larva {

    static buildFromJson(json) {
        return new Larva(json.antType, json.progress);
    }

    static build(antType, progress) {
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