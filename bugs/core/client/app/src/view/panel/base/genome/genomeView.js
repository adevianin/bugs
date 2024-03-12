import './style.css';
import { BaseHTMLView } from "../baseHTMLView";
import genomeTmpl from './genomeTmpl.html';
import chromosomesSetTmpl from './chromosomesSetTmpl.html';
import { GenesTypes } from '@domain/enum/genesTypes';
import { GeneView } from './genes/geneView';

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

        this._renderChromosome(el.querySelector('[data-body-chromosome]'), chromosomesSet.body);
        this._renderChromosome(el.querySelector('[data-development-chromosome]'), chromosomesSet.development);
        this._renderChromosome(el.querySelector('[data-adjusting-chromosome]'), chromosomesSet.adjusting);
    }

    _renderChromosome(el, chromosome) {
        let genesContainerEl = el.querySelector('[data-genes-container]');

        for (let gene of chromosome.genes) {
            this._renderGene(genesContainerEl, gene);
        }
    }

    _renderGene(geneContainerEl, gene) {
        let li = document.createElement('li');
        geneContainerEl.append(li);
        let view = new GeneView(li, gene);
        this._genesViews.push(view);
    }

}

export {
    GenomeView
}