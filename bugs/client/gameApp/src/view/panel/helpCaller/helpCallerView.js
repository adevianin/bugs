import './styles.css';
import { BaseHTMLView } from "@common/view/base/baseHTMLView";

class HelpCallerView extends BaseHTMLView {

    constructor(el, sectionId) {
        super(el);
        this._sectionId = sectionId;

        this._render();
    }

    _render() {
        this._el.classList.add('help-sign-container');
        let aEl = document.createElement('a');
        aEl.classList.add('help-sign');
        aEl.setAttribute('href', '#');
        aEl.innerText = '?';
        aEl.addEventListener('click', (e) => {
            e.preventDefault();
            this._onSighClick();
        })
        this._el.append(aEl);
    }

    _onSighClick() {
        this.$eventBus.emit('help', this._sectionId);
    }
}

export {
    HelpCallerView
}