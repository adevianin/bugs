import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class PositionView extends BaseGameHTMLView {

    constructor(el, position, linkText = null) {
        super(el);
        this._position = position;
        this._linkText = linkText;

        this._renderPosition();
    }

    get value() {
        return this._position;
    }

    set value(pos) {
        this._position = pos;
        this._renderPosition();
    }

    _renderPosition() {
        if (this._position) {
            this._el.innerHTML = '';
            let aEl = document.createElement('a');
            aEl.setAttribute('href', '#');
            aEl.addEventListener('click', (e) => {
                e.preventDefault();
                this.$eventBus.emit('showPointRequest', this._position);
            });
            aEl.innerText = this._linkText ? this._linkText : `(${this._position.x};${this._position.y})`;
            this._el.append(aEl);
        } else {
            this._el.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.POSITION_NOT_SPECIFIED);
        }
    }



}

export {
    PositionView
}