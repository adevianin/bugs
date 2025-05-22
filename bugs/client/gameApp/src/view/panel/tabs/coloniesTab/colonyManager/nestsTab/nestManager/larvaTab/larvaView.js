import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import larvaTmpl from './larvaTmpl.html';
import { antTypesLabelIds } from '@view/labels/antTypesLabelIds';
import { GenomeInlineView } from "@view/panel/base/genome/genomeInlineView";
import { doubleClickProtection } from '@common/utils/doubleClickProtection';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class LarvaView extends BaseGameHTMLView {

    constructor(el, larva, nest) {
        super(el);
        this._larva = larva;
        this._nest = nest;

        this._render();

        this._stopListenProgressChange = larva.on('progressChanged', this._onProgressChanged.bind(this));
        this._deleteLarvaBtn.addEventListener('click', doubleClickProtection(this._onDeleteBtnClick.bind(this)));
    }

    _render() {
        this._el.innerHTML = larvaTmpl;

        this._progressEl = this._el.querySelector('[data-progress]');
        this._el.querySelector('[data-ant-type]').innerHTML = this.$mm.get(antTypesLabelIds[this._larva.antType]);
        this._el.querySelector('[data-name]').innerHTML = this._larva.name;
        this._genomeView = new GenomeInlineView(this._el.querySelector('[data-genome]'), this._larva.genome);
        this._deleteLarvaBtn = this._el.querySelector('[data-delete]');
        this._deleteLarvaBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NEST_MANAGER_LARVA_TAB_REMOVE_LARVA_BTN_LABEL);
        this._renderProgress();
    }

    remove() {
        super.remove();
        this._genomeView.remove();
        this._stopListenProgressChange();
    }

    _renderProgress() {
        if (!this._larva.isDied) {
            this._progressEl.innerHTML = `${Math.round(this._larva.ateFood)}/${this._larva.requiredFood}`;
        } else {
            this._progressEl.innerHTML = 'загинув';
        }
        
    }

    _onProgressChanged() {
        this._renderProgress();
    }

    _onDeleteBtnClick() {
        this.events.emit('removeRequest');
    }
}

export {
    LarvaView
}