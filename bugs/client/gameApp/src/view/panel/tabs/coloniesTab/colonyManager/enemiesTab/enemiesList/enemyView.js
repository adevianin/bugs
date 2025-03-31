import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import enemyTmpl from './enemyTmpl.html';

class EnemyView extends BaseGameHTMLView {

    constructor(el, colony) {
        super(el);
        this._colony = colony;

        this._render();

        this._showBtn.addEventListener('click', this._onShowBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = enemyTmpl;

        this._el.querySelector('[data-colony-name]').innerHTML = this._colony.name;
        this._showBtn = this._el.querySelector('[data-show-btn]');
    }

    _onShowBtnClick() {
        let nests = this.$domain.getNestsFromColony(this._colony.id);
        this.$eventBus.emit('showPointRequest', this._calcAveragePosition(nests));
        this.$eventBus.emit('highlightEntity', {
            colonyId: this._colony.id,
            type: 'enemy'
        });
    }

    _calcAveragePosition(nests) {
        let xSum = 0;
        let ySum = 0;
        for (let nest of nests) {
            xSum += nest.position.x;
            ySum += nest.position.y;
        }

        let averageX = Math.round(xSum / nests.length);
        let averageY = Math.round(ySum / nests.length);

        return { x: averageX, y: averageY };
    }
    
}

export {
    EnemyView
}