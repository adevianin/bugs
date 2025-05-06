import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GenesTypes } from '@domain/enum/genesTypes';
import geneTmpl from './geneTmpl.html';
import bodyStrengthTmpl from './bodyStrengthTmpl.html';
import bodyDefenseTmpl from './bodyDefenseTmpl.html';
import bodyMaxHpTmpl from './bodyMaxHpTmpl.html';
import bodyHpRegenRateTmpl from './bodyHpRegenRateTmpl.html';
import bodySightDistanceTmpl from './bodySightDistanceTmpl.html';
import bodySpeedTmpl from './bodySpeedTmpl.html';
import devCasteGeneTmpl from './developmentCasteGeneTmpl.html';
import bodyLifeSpanTmpl from './bodyLifeSpanTmpl.html';
import adaptationColdTmpl from './adaptationColdTmpl.html';
import adaptationAppetiteTmpl from './adaptationAppetiteTmpl.html';
import adaptationDevelopmentAppetiteTmpl from './adaptationDevelopmentAppetiteTmpl.html';
import { AntTypes } from "@domain/enum/antTypes";
import { antTypesLabels } from "@view/labels/antTypesLabels";
import { convertStepsToYear } from '@utils/convertStepsToYear';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class GeneView extends BaseGameHTMLView {

    constructor(el, gene) {
        super(el);
        this._gene = gene;

        this._render();
    }

    _render() {
        this._el.innerHTML = geneTmpl;

        this._el.querySelector('[data-domination-code]').innerHTML = this._gene.dominationCode;
        this._el.querySelector('[data-domination-code-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DOMINATION_CODE);
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
            case GenesTypes.BODY_LIFE_SPAN:
                this._renderBodyLifeSpanGene();
                break;
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                this._renderCasteDevelopmentGene();
                break;
            case GenesTypes.SPECIALIZATION_BUILDING_SUBNEST:
                this._renderSpecializationBuildingSubnestGene();
                break;
            case GenesTypes.ADAPTATION_APPETITE:
                this._renderAdaptationAppetiteGene();
                break;
            case GenesTypes.ADAPTATION_DEVELOPMENT_APPETITE:
                this._renderAdaptationDevelopmentAppetiteGene();
                break;
            case GenesTypes.ADAPTATION_COLD:
                this._renderAdaptationColdGene();
                break;
            default:
                throw 'unknown body gene type';
        }
    }

    _renderBodyStrengthGene() {
        this._geneEl.innerHTML = bodyStrengthTmpl;
        this._geneEl.querySelector('[data-strength]').innerHTML = this._gene.strength;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_STRENGTH);
    }

    _renderBodyDefenseGene() {
        this._geneEl.innerHTML = bodyDefenseTmpl;
        this._geneEl.querySelector('[data-defense]').innerHTML = this._gene.defense;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_DEFENSE);
    }

    _renderBodyMaxHpGene() {
        this._geneEl.innerHTML = bodyMaxHpTmpl;
        this._geneEl.querySelector('[data-max-hp]').innerHTML = this._gene.maxHp;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_MAX_HP);
    }

    _renderBodyHpRegenRateGene() {
        this._geneEl.innerHTML = bodyHpRegenRateTmpl;
        this._geneEl.querySelector('[data-hp-regen-rate]').innerHTML = this._gene.hpRegenRate;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_HP_REGEN_RATE);
    }

    _renderBodySightDistanceGene() {
        this._geneEl.innerHTML = bodySightDistanceTmpl;
        this._geneEl.querySelector('[data-sight-distance]').innerHTML = this._gene.sightDistance;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_SIGHT_DISTANCE);
    }

    _renderBodySpeedGene() {
        this._geneEl.innerHTML = bodySpeedTmpl;
        this._geneEl.querySelector('[data-speed]').innerHTML = this._gene.speed;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_SPEED);
    }

    _renderBodyLifeSpanGene() {
        this._geneEl.innerHTML = bodyLifeSpanTmpl;
        this._geneEl.querySelector('[data-life-span]').innerHTML = convertStepsToYear(this._gene.lifeSpan, true);
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_LIFE_SPAN);
    }

    _renderCasteDevelopmentGene() {
        this._geneEl.innerHTML = devCasteGeneTmpl;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this._getGeneTitleForDevelopmentGene();

        this._geneEl.querySelector('[data-strength-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_STRENGTH);
        this._geneEl.querySelector('[data-defense-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_DEFENSE);
        this._geneEl.querySelector('[data-max-hp-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MAX_HP);
        this._geneEl.querySelector('[data-hp-regen-rate-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_HP_REGEN_RATE);
        this._geneEl.querySelector('[data-speed-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_SPEED);
        this._geneEl.querySelector('[data-life-span-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_LIFE_SPAN);

        this._geneEl.querySelector('[data-dev-strength]').innerHTML = this._gene.strength;
        this._geneEl.querySelector('[data-dev-defense]').innerHTML = this._gene.defense;
        this._geneEl.querySelector('[data-dev-max-hp]').innerHTML = this._gene.maxHp;
        this._geneEl.querySelector('[data-dev-hp-regen-rate]').innerHTML = this._gene.hpRegenRate;
        this._geneEl.querySelector('[data-dev-speed]').innerHTML = this._gene.speed;
        this._geneEl.querySelector('[data-dev-life-span]').innerHTML = this._gene.lifeSpan;
    }

    _getGeneTitleForDevelopmentGene() {
        switch(this._gene.type) {
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_QUEEN_CASTE);
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_WORKER_CASTE);
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                return this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MALE_CASTE);
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_WARRIOR_CASTE);
            default:
                throw 'unknown development gene type';
        }
    }

    _renderSpecializationBuildingSubnestGene() {
        this._geneEl.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST);
    }

    _renderAdaptationAppetiteGene() {
        this._geneEl.innerHTML = adaptationAppetiteTmpl;
        this._geneEl.querySelector('[data-multiplier]').innerHTML = this._gene.multiplier;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_APPETITE);
    }

    _renderAdaptationDevelopmentAppetiteGene() {
        this._geneEl.innerHTML = adaptationDevelopmentAppetiteTmpl;
        this._geneEl.querySelector('[data-multiplier]').innerHTML = this._gene.multiplier;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE);
    }

    _renderAdaptationColdGene() {
        this._geneEl.innerHTML = adaptationColdTmpl;
        this._geneEl.querySelector('[data-resistance-points]').innerHTML = this._gene.resistancePoints;
        this._geneEl.querySelector('[data-gene-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_COLD);
    }

}

export {
    GeneView
}