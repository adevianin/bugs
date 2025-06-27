import './style.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GenesTypes } from '@domain/enum/genesTypes';
import { convertStepsToYear } from '@utils/convertStepsToYear';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import valueGeneTmpl from './valueGeneTmpl.html';
import titleGeneTmpl from './titleGeneTmpl.html';
import casteGeneTmpl from './casteGeneTmpl.html';
import '@view/panel/icons/statsStrengthIcon.png';
import '@view/panel/icons/statsDefenseIcon.png';
import '@view/panel/icons/statsMaxHpIcon.png';
import '@view/panel/icons/statsHpRegenRateIcon.png';
import '@view/panel/icons/statsSpeedIcon.png';
import '@view/panel/icons/statsLifeSpanIcon.png';
import '@view/panel/icons/statsSightDistanceIcon.png';

class GeneView extends BaseGameHTMLView {

    constructor(el, gene) {
        super(el);
        this._gene = gene;

        this._render();
    }

    _render() {
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

    _renderValueGeneBase() {
        this._el.innerHTML = valueGeneTmpl;
        this._el.querySelector('[data-domination-code-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DOMINATION_CODE);
        this._el.querySelector('[data-domination-code]').innerHTML = this._gene.dominationCode;
        this._el.querySelector('[data-value-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_VALUE);
    }

    _renderTitleGeneBase() {
        this._el.innerHTML = titleGeneTmpl;
    }

    _renderCasteGeneBase() {
        this._el.innerHTML = casteGeneTmpl;

        this._el.querySelector('[data-strength-col-head]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_STRENGTH));
        this._el.querySelector('[data-defense-col-head]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_DEFENSE));
        this._el.querySelector('[data-max-hp-col-head]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_MAX_HP));
        this._el.querySelector('[data-hp-regen-rate-col-head]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_HP_REGEN_RATE));
        this._el.querySelector('[data-speed-col-head]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_SPEED));
        this._el.querySelector('[data-life-span-col-head]').setAttribute('title', this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_DEVELOPMENT_LIFE_SPAN));
    }

    _renderBodyStrengthGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-strength');
        this._el.querySelector('[data-value]').innerHTML = this._gene.strength;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_STRENGTH);
    }

    _renderBodyDefenseGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-defense');
        this._el.querySelector('[data-value]').innerHTML = this._gene.defense;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_DEFENSE);
    }

    _renderBodyMaxHpGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-max-hp');
        this._el.querySelector('[data-value]').innerHTML = this._gene.maxHp;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_MAX_HP);
    }

    _renderBodyHpRegenRateGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-hp-regen-rate');
        this._el.querySelector('[data-value]').innerHTML = this._gene.hpRegenRate;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_HP_REGEN_RATE);
    }

    _renderBodySightDistanceGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-sight-distance');
        this._el.querySelector('[data-value]').innerHTML = this._gene.sightDistance;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_SIGHT_DISTANCE);
    }

    _renderBodySpeedGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-speed');
        this._el.querySelector('[data-value]').innerHTML = this._gene.speed;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_SPEED);
    }

    _renderBodyLifeSpanGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').classList.add('gene__icon-container-life-span');
        this._el.querySelector('[data-value]').innerHTML = convertStepsToYear(this._gene.lifeSpan, true);
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_BODY_LIFE_SPAN);
    }

    _renderCasteDevelopmentGene() {
        this._renderCasteGeneBase();
        this._el.querySelector('[data-title]').innerHTML = this._getGeneTitleForDevelopmentGene();

        this._el.querySelector('[data-dev-strength]').innerHTML = `x${this._gene.strength}`;
        this._el.querySelector('[data-dev-defense]').innerHTML = `x${this._gene.defense}`;
        this._el.querySelector('[data-dev-max-hp]').innerHTML = `x${this._gene.maxHp}`;
        this._el.querySelector('[data-dev-hp-regen-rate]').innerHTML = `x${this._gene.hpRegenRate}`;
        this._el.querySelector('[data-dev-speed]').innerHTML = `x${this._gene.speed}`;
        this._el.querySelector('[data-dev-life-span]').innerHTML = `x${this._gene.lifeSpan}`;
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
        this._renderTitleGeneBase();
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST);
        this._el.querySelector('[data-description]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_SPECIALIZATION_BUILDING_SUBNEST_DESCRIPTION);
    }

    _renderAdaptationAppetiteGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').remove();
        this._el.querySelector('[data-value]').innerHTML = this._gene.multiplier;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_APPETITE);
        this._el.querySelector('[data-description]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_APPETITE_DESCRIPTION);
    }

    _renderAdaptationDevelopmentAppetiteGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').remove();
        this._el.querySelector('[data-value]').innerHTML = this._gene.multiplier;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE);
        this._el.querySelector('[data-description]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_DEVELOPMENT_APPETITE_DESCRIPTION);
    }

    _renderAdaptationColdGene() {
        this._renderValueGeneBase();
        this._el.querySelector('[data-icon-container]').remove();
        this._el.querySelector('[data-value]').innerHTML = this._gene.resistancePoints;
        this._el.querySelector('[data-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.GENE_LABEL_ADAPTATION_COLD);
    }

}

export {
    GeneView
}