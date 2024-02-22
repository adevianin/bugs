import './styles.css';
import { BaseHTMLView } from "../baseHTMLView";
import genesTmpl from './genesTmpl.html';
import { antTypesLabels } from '../labels/antTypesLabels';
import { AntTypes } from '@domain/enum/antTypes';

class GenesView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    showGenes(genes) {
        this._genes = genes;

        this._renderGenes();
    }

    _render() {
        this._el.innerHTML = genesTmpl;
    }

    _renderGenes() {
        this._renderGenesRow(this._el.querySelector('[data-queen-row]'), this._genes.queenStats, this._genes.queenFoodRequired, AntTypes.QUEEN);
        this._renderGenesRow(this._el.querySelector('[data-warrior-row]'), this._genes.warriorStats, this._genes.warriorFoodRequired, AntTypes.WARRIOR);
        this._renderGenesRow(this._el.querySelector('[data-worker-row]'), this._genes.workerStats, this._genes.workerFoodRequired, AntTypes.WORKER);
    }

    _renderGenesRow(rowEl, stats, reuqiredFood, antType) {
        rowEl.querySelector('[data-type]').innerHTML = antTypesLabels[antType];
        rowEl.querySelector('[data-attack]').innerHTML = stats.attack;
        rowEl.querySelector('[data-defence]').innerHTML = stats.defence;
        rowEl.querySelector('[data-dist-per-calorie]').innerHTML = stats.distancePerCalorie;
        rowEl.querySelector('[data-dist-per-step]').innerHTML = stats.distancePerStep;
        rowEl.querySelector('[data-hp-regen-rate]').innerHTML = stats.hpRegenRate;
        // rowEl.querySelector('[data-max-calories]').innerHTML = stats.maxCalories;
        rowEl.querySelector('[data-max-hp]').innerHTML = stats.maxHp;
        rowEl.querySelector('[data-sight-distance]').innerHTML = stats.sightDistance;
        rowEl.querySelector('[data-required-food]').innerHTML = reuqiredFood;
    }
}

export {
    GenesView
}