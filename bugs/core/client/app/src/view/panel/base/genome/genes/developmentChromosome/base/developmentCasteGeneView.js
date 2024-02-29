import { GeneView } from "../../base/geneView";
import devCasteGeneTmpl from './developmentCasteGeneTmpl.html';
import { antTypesLabels } from "@view/panel/base/labels/antTypesLabels";

class DevelopmentCasteGeneView extends GeneView {

    _renderGene(el) {
        el.innerHTML = devCasteGeneTmpl;
        el.querySelector('[data-ant-type]').innerHTML = antTypesLabels[this._antType];
        el.querySelector('[data-dev-strength]').innerHTML = this._gene.strength;
        el.querySelector('[data-dev-defense]').innerHTML = this._gene.defense;
        el.querySelector('[data-dev-max-hp]').innerHTML = this._gene.maxHp;
        el.querySelector('[data-dev-hp-regen-rate]').innerHTML = this._gene.hpRegenRate;
        el.querySelector('[data-dev-speed]').innerHTML = this._gene.speed;
    }

    get _antType() {
        throw 'abstract method'; 
    }

}

export {
    DevelopmentCasteGeneView
}