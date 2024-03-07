import './style.css';
import { BaseHTMLView } from "../baseHTMLView";
import genomeTmpl from './genomeTmpl.html';
import chromosomesSetTmpl from './chromosomesSetTmpl.html';
import { GenesTypes } from '@domain/enum/genesTypes';
import { BodyStrengthGeneView } from './genes/bodyChromosome/strengthGene/bodyStrengthGeneView';
import { BodyDefenseGeneView } from './genes/bodyChromosome/defenseGene/bodyDefenseGeneView';
import { BodyMaxHpGeneView } from './genes/bodyChromosome/maxHpGene/bodyMaxHpGeneView';
import { BodyHpRegenRateGeneView } from './genes/bodyChromosome/hpRegenRateGene/bodyHpRegenRateGeneView';
import { BodySightDistanceGeneView } from './genes/bodyChromosome/sightDistanceGene/bodySightDistanceGeneView';
import { BodySpeedGeneView } from './genes/bodyChromosome/speedGene/bodySpeedGeneView';
import { DevelopmentQueenCasteGeneView } from './genes/developmentChromosome/developmentQueenCasteGeneView';
import { DevelopmentWorkerCasteGeneView } from './genes/developmentChromosome/developmentWorkerCasteGeneView';
import { DevelopmentWarriorCasteGeneView } from './genes/developmentChromosome/developmentWarriorCasteGeneView';
import { DevelopmentMaleCasteGeneView } from './genes/developmentChromosome/developmentMaleCasteGeneView';
import { AdjustingAppetiteGeneView } from './genes/adjustingChromosome/adjustingAppetiteGeneView';
import { AdjustingDevelopmentAppetiteGeneView } from './genes/adjustingChromosome/adjustingDevelopmentAppetiteGeneView';

class GenomeView extends BaseHTMLView {

    constructor(el, genome) {
        super(el);
        this._genesViews = [];
        this._genome = genome;

        this._render();
    }

    remove() {
        super.remove();
        for (let geneView of this._genesViews) {
            geneView.remove();
        }
    }

    _render() {
        this._el.innerHTML = genomeTmpl;

        this._renderChromosomeSet(this._el.querySelector('[data-maternal-chromosomes-set]'), this._genome.maternal, 'материнський набір хромосом');
        if (this._genome.paternal) {
            this._renderChromosomeSet(this._el.querySelector('[data-paternal-chromosomes-set]'), this._genome.paternal, 'батьківський набір хромосом');
        }
    }

    _renderChromosomeSet(el, chromosomesSet, title) {
        el.innerHTML = chromosomesSetTmpl;

        el.querySelector('[data-chromosome-set-title]').innerHTML = title;

        this._renderBodyChromosome(el.querySelector('[data-body-chromosome]'), chromosomesSet.body);
        this._renderDevelopmentChromosome(el.querySelector('[data-development-chromosome]'), chromosomesSet.development);
        this._renderAdjustingChromosome(el.querySelector('[data-adjusting-chromosome]'), chromosomesSet.adjusting);
    }

    _renderBodyChromosome(el, bodyChromosome) {
        let genesContainerEl = el.querySelector('[data-genes-container]');

        this._renderGene(genesContainerEl, bodyChromosome.strengthGene);
        this._renderGene(genesContainerEl, bodyChromosome.defenseGene);
        this._renderGene(genesContainerEl, bodyChromosome.maxHpGene);
        this._renderGene(genesContainerEl, bodyChromosome.hpRegenRateGene);
        this._renderGene(genesContainerEl, bodyChromosome.sightDistanceGene);
        this._renderGene(genesContainerEl, bodyChromosome.speedGene);
    }

    _renderDevelopmentChromosome(el, devChromosome) {
        let genesContainerEl = el.querySelector('[data-genes-container]');
        this._renderGene(genesContainerEl, devChromosome.queenCasteGene);
        this._renderGene(genesContainerEl, devChromosome.workerCasteGene);
        this._renderGene(genesContainerEl, devChromosome.maleCasteGene);
        if (devChromosome.warriorCasteGene) {
            this._renderGene(genesContainerEl, devChromosome.warriorCasteGene);
        }
    }

    _renderAdjustingChromosome(el, adjustingChromosome) {
        let genesContainerEl = el.querySelector('[data-genes-container]');
        
        this._renderGene(genesContainerEl, adjustingChromosome.appetiteGene);
        this._renderGene(genesContainerEl, adjustingChromosome.developmentAppetiteGene);
    }

    _renderGene(geneContainerEl, gene) {
        let li = document.createElement('li');
        geneContainerEl.append(li);
        let view = this._buildGeneView(li, gene);
        this._genesViews.push(view);
    }

    _buildGeneView(el, gene) {
        switch (gene.type) {
            case GenesTypes.BODY_STRENGTH:
                return new BodyStrengthGeneView(el, gene);
            case GenesTypes.BODY_DEFENSE:
                return new BodyDefenseGeneView(el, gene);
            case GenesTypes.BODY_MAX_HP:
                return new BodyMaxHpGeneView(el, gene);
            case GenesTypes.BODY_HP_REGEN_RATE:
                return new BodyHpRegenRateGeneView(el, gene);
            case GenesTypes.BODY_SIGHT_DISTANCE:
                return new BodySightDistanceGeneView(el, gene);
            case GenesTypes.BODY_SPEED:
                return new BodySpeedGeneView(el, gene);
            case GenesTypes.DEVELOPMENT_QUEEN_CASTE:
                return new DevelopmentQueenCasteGeneView(el, gene);
            case GenesTypes.DEVELOPMENT_WORKER_CASTE:
                return new DevelopmentWorkerCasteGeneView(el, gene);
            case GenesTypes.DEVELOPMENT_WARRIOR_CASTE:
                return new DevelopmentWarriorCasteGeneView(el, gene);
            case GenesTypes.DEVELOPMENT_MALE_CASTE:
                return new DevelopmentMaleCasteGeneView(el, gene);
            case GenesTypes.ADJUSTING_APPETITE:
                return new AdjustingAppetiteGeneView(el, gene);
            case GenesTypes.ADJUSTING_DEVELOPMENT_APPETITE:
                return new AdjustingDevelopmentAppetiteGeneView(el, gene);
            default:
                throw 'unknown body gene type';
        }
    }

}

export {
    GenomeView
}