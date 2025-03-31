import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import enemiesTabTmpl from './enemiesTabTmpl.html';
import { EnemiesListView } from './enemiesList/enemiesListView';

class EnemiesTab extends BaseGameHTMLView {

    constructor(el) {
        super(el)

        this._render();
    }

    manageColony(colony) {
        this._enemiesListView.manageColony(colony);
    }

    _render() {
        this._el.innerHTML = enemiesTabTmpl;

        this._enemiesListView = new EnemiesListView(this._el.querySelector('[data-enemies-list]'));
    }
}

export { EnemiesTab }