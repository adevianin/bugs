import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import enemyTmpl from './enemyTmpl.html';

class EnemyView extends BaseGameHTMLView {

    constructor(el, enemyColonyId) {
        super(el);
        this._enemyColonyId = enemyColonyId;

        this._render();

        this._showBtn.addEventListener('click', this._onShowBtnClick.bind(this));
    }

    _render() {
        this._el.innerHTML = enemyTmpl;

        this._renderName();
        this._showBtn = this._el.querySelector('[data-show-btn]');
    }

    async _renderName() {
        let enemyColonyData = await this.$domain.getEnemyColonyData(this._enemyColonyId);
        this._el.querySelector('[data-colony-name]').innerHTML = enemyColonyData.name;
    }

    async _onShowBtnClick() {
        let enemyColonyData = await this.$domain.getEnemyColonyData(this._enemyColonyId);
        this.$eventBus.emit('showPointRequest', enemyColonyData.position);
        this.$eventBus.emit('highlightEntity', {
            colonyId: this._enemyColonyId,
            type: 'enemy'
        });
        
    }

}

export {
    EnemyView
}