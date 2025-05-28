import './style.css';
import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import zoomControlTmpl from './zoomControlTmpl.html';

class ZoomControlView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._isZoomedIn = true;

        this._render();

        this._zoomInBtn.addEventListener('click', this._onZoomInBtnClick.bind(this));
        this._zoomOutBtn.addEventListener('click', this._onZoomOutBtnClick.bind(this));
    }

    _render () {
        this._el.innerHTML = zoomControlTmpl;
        this._el.classList.add('zoom-control');

        this._zoomInBtn = this._el.querySelector('[data-zoom-in-btn]');
        this._zoomOutBtn = this._el.querySelector('[data-zoom-out-btn]');

        this._renderBtnsState();
    }

    _renderBtnsState() {
        this._zoomInBtn.classList.toggle('g-hidden', this._isZoomedIn);
        this._zoomOutBtn.classList.toggle('g-hidden', !this._isZoomedIn);
    }

    _onZoomInBtnClick() {
        this._isZoomedIn = true;
        this._renderBtnsState();
        this.$eventBus.emit('zoomIn');
    }

    _onZoomOutBtnClick() {
        this._isZoomedIn = false;
        this._renderBtnsState();
        this.$eventBus.emit('zoomOut');
    }
}

export {
    ZoomControlView
}