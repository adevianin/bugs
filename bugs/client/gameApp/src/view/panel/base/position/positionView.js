import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';

class PositionView extends BaseGameHTMLView {

    constructor(el, position) {
        super(el);
        this._position = position;

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
        this._el.innerHTML = this._position ? `(${this._position.x};${this._position.y})` : this.$messages.not_specified;
    }

}

export {
    PositionView
}