import './style.css';

import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GeneView } from './genes/geneView';
import { ChromosomesTypes } from '@domain/enum/chromosomeTypes';
import genomeTmpl from './genomeTmpl.html';
import chromosomesSetTmpl from './chromosomesSetTmpl.html';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class GenomeView extends BaseGameHTMLView {

    constructor(el, genome) {
        super(el);
        this._genesViews = [];
        this._genome = genome;

        this._render();
    }

    setGenome(genome) {
        this._genome = genome;
        this._renderGenome();
    }

    remove() {
        super.remove();
        this._removeGeneViews();
    }

    _render() {
        this._el.innerHTML = genomeTmpl;
        this._el.classList.add('genome');

        if (this._genome) {
            this._renderGenome();
        }
    }

    _renderGenome() {
        this._removeGeneViews();
        let maternalChrSetTitle = this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_MATERNAL);
        this._renderChromosomeSet(this._el.querySelector('[data-maternal-chromosomes-set]'), this._genome.maternal, maternalChrSetTitle);
        let paternalChrSetTitle = this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOMESET_LABEL_PATERNAL);
        this._renderChromosomeSet(this._el.querySelector('[data-paternal-chromosomes-set]'), this._genome.paternal, paternalChrSetTitle);
    }

    _renderChromosomeSet(el, chromosomesSet, title) {
        el.innerHTML = chromosomesSetTmpl;

        el.querySelector('[data-chromosome-set-title]').innerHTML = title;

        if (chromosomesSet) {
            el.querySelector('[data-body-chromosome-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_BODY);
            el.querySelector('[data-development-chromosome-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_DEVELOPMENT);
            el.querySelector('[data-adaptation-chromosome-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_ADAPTATION);
            el.querySelector('[data-specialization-chromosome-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.CHROMOSOME_LABEL_SPECIALIZATION);

            this._renderChromosome(el.querySelector('[data-body-chromosome]'), this._getChromosomeByType(chromosomesSet, ChromosomesTypes.BODY));
            this._renderChromosome(el.querySelector('[data-development-chromosome]'), this._getChromosomeByType(chromosomesSet, ChromosomesTypes.DEVELOPMENT));
            this._renderChromosome(el.querySelector('[data-adaptation-chromosome]'), this._getChromosomeByType(chromosomesSet, ChromosomesTypes.ADAPTATION));
            this._renderChromosome(el.querySelector('[data-specialization-chromosome]'), this._getChromosomeByType(chromosomesSet, ChromosomesTypes.SPECIALIZATION));
        }

    }

    _getChromosomeByType(chromosomesSet, chromosomeType) {
        return chromosomesSet.find(ch => ch.type == chromosomeType);
    }

    _renderChromosome(el, chromosome) {
        let genesContainerEl = el.querySelector('[data-genes-container]');

        for (let gene of chromosome.genes) {
            this._renderGene(genesContainerEl, gene);
        }
    }

    _renderGene(geneContainerEl, gene) {
        let el = document.createElement('div');
        geneContainerEl.append(el);
        let view = new GeneView(el, gene);
        this._genesViews.push(view);
    }

    _removeGeneViews() {
        for (let geneView of this._genesViews) {
            geneView.remove();
        }
    }

}

export {
    GenomeView
}