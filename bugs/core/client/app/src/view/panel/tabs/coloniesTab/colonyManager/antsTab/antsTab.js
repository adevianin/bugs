import { BaseHTMLView } from "@view/base/baseHTMLView";
import antsTabTmpl from './antsTabTmpl.html';
import { AntsListView } from "./antsList";

class AntsTab extends BaseHTMLView {

    constructor(el) {
        super(el)

        this._render();
    }

    manageColony(colony) {
        this._antsList.manageColony(colony);
    }

    remove() {
        super.remove();
        this._antsList.remove();
    }

    _render() {
        this._el.innerHTML = antsTabTmpl;

        this._antsList = new AntsListView(this._el.querySelector('[data-ants-list]'));
    }
}

export { AntsTab }