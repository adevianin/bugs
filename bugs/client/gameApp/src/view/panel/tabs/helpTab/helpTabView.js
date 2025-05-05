import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import helpTabTmpl from './helpTabTmpl.html';

class HelpTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    showSection(sectionId) {
        let highlightClassName = 'help__section--highlighted';
        let section = this._el.querySelector(`[data-section="${sectionId}"]`);
        section.scrollIntoView();
        section.classList.add(highlightClassName);
        setTimeout(() => section.classList.remove(highlightClassName), 1000);
    }

    _render() {
        this._el.innerHTML = helpTabTmpl;
    }

}

export {
    HelpTabView
}