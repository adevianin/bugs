import { Genome } from "../genetic/genome";
import { NuptialMale } from "./nuptialMale";
import { NuptialEnvironment } from "./nuptialEnvironment";

class NuptialEnvironmentFactory {

    buildNuptialEnvironment() {
        return new NuptialEnvironment();
    }

    buildNuptialMale(nuptialMaleJson) {
        let genome = Genome.buildFromJson(nuptialMaleJson.genome);
        return new NuptialMale(nuptialMaleJson.id, genome, nuptialMaleJson.stats, nuptialMaleJson.isLocal);
    }

}

export {
    NuptialEnvironmentFactory
}