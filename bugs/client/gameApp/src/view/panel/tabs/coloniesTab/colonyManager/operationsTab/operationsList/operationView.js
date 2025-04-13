import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import operationTmpl from './operationTmpl.html';

class OperationView extends BaseGameHTMLView {

    constructor(el, operation, colonyId) {
        super(el);
        this._operation = operation;
        this._colonyId = colonyId;
        
        this._render();

        this._stopBtn.addEventListener('click', this._onStopBtnClick.bind(this));
        this._el.addEventListener('click', this._onClick.bind(this));
    }

    update() {
        this._renderOperation();
    }

    toggleSelect(isSelected) {
        this._el.classList.toggle('colony-manager__operation--selected', isSelected);
    }

    _render() {
        this._el.innerHTML = operationTmpl;
        this._nameEl = this._el.querySelector('[data-name]')
        this._statusEl = this._el.querySelector('[data-status]')
        this._stopBtn = this._el.querySelector('[data-stop-btn]');
        this._hiringProgressEl = this._el.querySelector('[data-hiring-progress]');

        this._renderOperation();
    }

    _renderOperation() {
        this._nameEl.innerHTML = this._operation.name;
        this._statusEl.innerHTML = this._operation.status;
        this._hiringProgressEl.classList.toggle('g-hidden', this._operation.status == 'in_progress');
        let warriorsText = `warriors(${this._operation.hiredWarriorsCount}/${this._operation.warriorVacanciesCount})`
        let workersText = `workers(${this._operation.hiredWorkersCount}/${this._operation.workerVacanciesCount})`;
        this._hiringProgressEl.innerHTML = `${workersText} ${warriorsText}`;
    }

    _onStopBtnClick(e) {
        e.stopPropagation();
        this.$domain.stopOperation(this._colonyId, this._operation.id);
        this.toggle(false);
    }

    _onClick() {
        this.events.emit('click');
    }

}

export {
    OperationView
}