import { EggStates } from "@domain/enum/eggStates";

let eggStatesLabels = {
    [EggStates.DEVELOPMENT]: 'Розвивається',
    [EggStates.READY]: 'Готове',
    [EggStates.SPOILED]: 'Зіпсоване'
};

export {
    eggStatesLabels
}