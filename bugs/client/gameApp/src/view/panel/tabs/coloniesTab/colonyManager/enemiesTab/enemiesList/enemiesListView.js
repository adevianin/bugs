import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import enemiesListTmpl from './enemiesListTmpl.html';
import { EnemyView } from './enemyView';

class EnemiesListView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._enemyViews = {};

        this._render();
    }

    manageColony(colony) {
        this._stopListenColony();
        this._colony = colony;
        this._listenColony(colony);

        this._renderAllEnemies();
    }

    remove() {
        super.remove();
        this._stopListenColony();
    }

    _listenColony(colony) {
        this._stopListenEnemiesChange = colony.on('enemiesChanged', this._onEnemiesChanged.bind(this));
    }

    _stopListenColony() {
        if (this._colony) {
            this._stopListenEnemiesChange();
        }
    }

    _render() {
        this._el.innerHTML = enemiesListTmpl;

        this._enemiesListEl = this._el.querySelector('[data-enemies-list]');
        this._enemiesPlaceholderEl = this._el.querySelector('[data-no-enemies-placeholder]');
    }

    _renderEnemiesEmptyState() {
        this._enemiesPlaceholderEl.classList.toggle('g-hidden', this._colony.enemies.length > 0);
        this._enemiesListEl.classList.toggle('g-hidden', this._colony.enemies.length == 0);
    }

    _renderAllEnemies() {
        this._renderEnemiesEmptyState();
        this._clearAllEnemies();
        let enemyColonies = this.$domain.getColoniesByIds(this._colony.enemies);
        for (let enemyColony of enemyColonies) {
            this._renderEnemy(enemyColony);
        }
    }

    _clearAllEnemies() {
        for (let enemyColonyId in this._enemyViews) {
            this._enemyViews[enemyColonyId].remove();
            delete this._enemyViews[enemyColonyId];
        }

        this._enemyViews = {};
    }

    _renderEnemy(enemyColony) {
        let el = document.createElement('li');
        let view = new EnemyView(el, enemyColony);
        this._enemiesListEl.append(el);
        this._enemyViews[enemyColony.id] = view;
    }

    _updateEnemiesList() {
        this._renderEnemiesEmptyState();

        for (let enemyColonyId in this._enemyViews) {
            if (!this._colony.enemies.includes(parseInt(enemyColonyId))) {
                this._enemyViews[enemyColonyId].remove();
                delete this._enemyViews[enemyColonyId];
            }
        }

        let newEnemyIds = [];
        for (let enemyId of this._colony.enemies) {
            if (!this._enemyViews[enemyId]) {
                newEnemyIds.push(enemyId);
            }
        }

        let newEnemyColonies = this.$domain.getColoniesByIds(newEnemyIds);

        for (let enemyColony of newEnemyColonies) {
            this._renderEnemy(enemyColony);
        }
    }

    _onEnemiesChanged() {
        this._updateEnemiesList();
    }

}

export {
    EnemiesListView
}