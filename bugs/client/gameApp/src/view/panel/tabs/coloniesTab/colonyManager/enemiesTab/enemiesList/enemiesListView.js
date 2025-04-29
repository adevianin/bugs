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
        for (let enemyColonyId of this._colony.enemies) {
            this._renderEnemy(enemyColonyId);
        }
    }

    _clearAllEnemies() {
        for (let enemyColonyId in this._enemyViews) {
            this._enemyViews[enemyColonyId].remove();
            delete this._enemyViews[enemyColonyId];
        }

        this._enemyViews = {};
    }

    _renderEnemy(enemyColonyId) {
        let el = document.createElement('li');
        let view = new EnemyView(el, enemyColonyId);
        this._enemiesListEl.append(el);
        this._enemyViews[enemyColonyId] = view;
    }

    _updateEnemiesList() {
        this._renderEnemiesEmptyState();

        for (let enemyColonyId in this._enemyViews) {
            if (!this._colony.enemies.includes(parseInt(enemyColonyId))) {
                this._enemyViews[enemyColonyId].remove();
                delete this._enemyViews[enemyColonyId];
            }
        }

        for (let enemyColonyId of this._colony.enemies) {
            if (!this._enemyViews[enemyColonyId]) {
                this._renderEnemy(enemyColonyId);
            }
        }
    }

    _onEnemiesChanged() {
        this._updateEnemiesList();
    }

}

export {
    EnemiesListView
}