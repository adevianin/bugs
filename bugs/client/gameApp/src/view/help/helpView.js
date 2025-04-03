import './styles.css';
import helpTmpl from './helpTmpl.html';
import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";

class HelpView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();

        this._closeBtn.addEventListener('click', this._onCloseBtnClick.bind(this));
        this.$eventBus.on('help', this._onHelpRequest.bind(this));
    }

    _render() {
        this._el.innerHTML = helpTmpl;
        this._el.classList.add('help');

        this._closeBtn = this._el.querySelector('[data-close-btn]');
        this.toggle(false);
    }

    _onHelpRequest(sectionId) {
        let section = this._el.querySelector(`[data-section="${sectionId}"]`);
        if (section) {
            this.toggle(true);
            section.scrollIntoView();
            section.classList.add('scroll__section--highlighted');
            setTimeout(() => section.classList.remove('scroll__section--highlighted'), 1000);
        } else {
            console.error('cant find help section');
        }
    }

    _onCloseBtnClick() {
        this.toggle(false);
    }

}

export {
    HelpView
}