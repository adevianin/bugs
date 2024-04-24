import { BaseHTMLView } from "../../../../base/baseHTMLView";
import { GenesTypes } from '@domain/enum/genesTypes';
import geneTmpl from './geneTmpl.html';
import bodyStrengthTmpl from './bodyStrengthTmpl.html';
import bodyDefenseTmpl from './bodyDefenseTmpl.html';
import bodyMaxHpTmpl from './bodyMaxHpTmpl.html';
import bodyHpRegenRateTmpl from './bodyHpRegenRateTmpl.html';
import bodySightDistanceTmpl from './bodySightDistanceTmpl.html';
import bodySpeedTmpl from './bodySpeedTmpl.html';
import devCasteGeneTmpl from './developmentCasteGeneTmpl.html';
import { AntTypes } from "@domain/enum/antTypes";
import { antTypesLabels } from "../../labels/antTypesLabels";

class GeneView extends BaseHTMLView {

    constructor(el, gene) {
        super(el);
        this._gene = gene;

        this._render();
    }

    _render() {
        this._el.innerHTML = geneTmpl;

        this._el.querySelector('[data-domination-code]').innerHTML = this._gene.dominationCode;
        this._geneEl = this._el.querySelector('[data-gene]');
        this._renderGene();
    }

    _renderGene() {
        switch(this._gene.type) {
            case GenesTypes.BODY_STRENGTH:
                this._renderBodyStrengthGene();
                break;
            case GenesTypes.BODY_DEFENSE:
                this._renderBodyDefenseGene();
                break;
            case GenesTypes.BODY_MAX_HP:
                this._renderBodyMaxHpGene();
                break;
            case GenesTypes.BODY_HP_REGEN_RATE:
                this._renderBodyHpRegenRateGene();
                break;
            case GenesTypes.BODY_SIGHT_DISTANCE:
                this._renderBodySightDistanceGene();
                break;
            case GenesTypes.BODY_SPEED:
                this._renderBodySpeedGene();
                break;
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                this._renderCasteDevelopmentGene();
                break;
            case GenesTypes.ADJUSTING_APPETITE:
                this._renderAdjustingAppetiteGene();
                break;
            case GenesTypes.ADJUSTING_DEVELOPMENT_APPETITE:
                this._renderAdjustingDevelopmentAppetiteGene();
                break;
            default:
                throw 'unknown body gene type';
        }
    }

    _renderBodyStrengthGene() {
        this._geneEl.innerHTML = bodyStrengthTmpl;
        this._geneEl.querySelector('[data-strength]').innerHTML = this._gene.strength;
    }

    _renderBodyDefenseGene() {
        this._geneEl.innerHTML = bodyDefenseTmpl;
        this._geneEl.querySelector('[data-defense]').innerHTML = this._gene.defense;
    }

    _renderBodyMaxHpGene() {
        this._geneEl.innerHTML = bodyMaxHpTmpl;
        this._geneEl.querySelector('[data-max-hp]').innerHTML = this._gene.maxHp;
    }

    _renderBodyHpRegenRateGene() {
        this._geneEl.innerHTML = bodyHpRegenRateTmpl;
        this._geneEl.querySelector('[data-hp-regen-rate]').innerHTML = this._gene.hpRegenRate;
    }

    _renderBodySightDistanceGene() {
        this._geneEl.innerHTML = bodySightDistanceTmpl;
        this._geneEl.querySelector('[data-sight-distance]').innerHTML = this._gene.sightDistance;
    }

    _renderBodySpeedGene() {
        this._geneEl.innerHTML = bodySpeedTmpl;
        this._geneEl.querySelector('[data-speed]').innerHTML = this._gene.speed;
    }

    _renderCasteDevelopmentGene() {
        let antType = this._figureOutAntTypeOfDevelopmentGene();

        this._geneEl.innerHTML = devCasteGeneTmpl;
        this._geneEl.querySelector('[data-ant-type]').innerHTML = antTypesLabels[antType];
        this._geneEl.querySelector('[data-dev-strength]').innerHTML = this._gene.strength;
        this._geneEl.querySelector('[data-dev-defense]').innerHTML = this._gene.defense;
        this._geneEl.querySelector('[data-dev-max-hp]').innerHTML = this._gene.maxHp;
        this._geneEl.querySelector('[data-dev-hp-regen-rate]').innerHTML = this._gene.hpRegenRate;
        this._geneEl.querySelector('[data-dev-speed]').innerHTML = this._gene.speed;
    }

    _figureOutAntTypeOfDevelopmentGene() {
        switch(this._gene.type) {
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return AntTypes.QUEEN;
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return AntTypes.WORKER;
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                return AntTypes.MALE;
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return AntTypes.WARRIOR;
            default:
                throw 'unknown development gene type';
        }
    }

    _renderAdjustingAppetiteGene() {
        this._geneEl.innerHTML = 'ген підстройки апетиту';
    }

    _renderAdjustingDevelopmentAppetiteGene() {
        this._geneEl.innerHTML = 'ген підстройки апетиту розвитку';
    }

}

export {
    GeneView
}