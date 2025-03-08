import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import antsTabTmpl from './antsTabTmpl.html';
import { AntsListView } from "./antsList";

class AntsTab extends BaseGameHTMLView {

    constructor(el) {
        super(el)

        this._render();
    }

    manageColony(colony) {
        this._antsList.manageColony(colony);
    }

    _render() {
        this._el.innerHTML = antsTabTmpl;

        this._antsList = new AntsListView(this._el.querySelector('[data-ants-list]'));
    }
}

export { AntsTab }