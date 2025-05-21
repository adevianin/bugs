import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import operationTmpl from './operationTmpl.html';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class OperationView extends BaseGameHTMLView {

    constructor(el, operation, colonyId) {
        super(el);
        this._operation = operation;
        this._colonyId = colonyId;
        this._isSelected = false;
        
        this._render();

        this._stopBtn.addEventListener('click', this._onStopBtnClick.bind(this));
        this._activateBtn.addEventListener('click', this._onActivateBtnClick.bind(this))
        this._operation.on('changed', this._renderOperation.bind(this));
    }

    toggleSelect(isSelected) {
        this._isSelected = isSelected;
        this._el.classList.toggle('colony-manager__operation--selected', isSelected);
        this._renderActivateBtnState();
    }

    _render() {
        this._el.innerHTML = operationTmpl;
        this._nameEl = this._el.querySelector('[data-name]')
        this._statusEl = this._el.querySelector('[data-status]')
        this._stopBtn = this._el.querySelector('[data-stop-btn]');
        this._hiringProgressEl = this._el.querySelector('[data-hiring-progress]');
        this._activateBtn = this._el.querySelector('[data-activate-btn]');
        this._renderActivateBtnState();

        this._renderOperation();
    }

    _renderOperation() {
        this._nameEl.innerHTML = this._getOperationTypeText(this._operation.type);
        this._statusEl.innerHTML = this._getOperationStatusText(this._operation.status);
        let warriorsLabel = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_HIRING_WARRIORS_STATUS_LABEL);
        let workersLabel = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_HIRING_WORKERS_STATUS_LABEL);
        let warriorsText = `${warriorsLabel}(${this._operation.hiredWarriorsCount}/${this._operation.warriorVacanciesCount})`
        let workersText = `${workersLabel}(${this._operation.hiredWorkersCount}/${this._operation.workerVacanciesCount})`;
        this._hiringProgressEl.innerHTML = `${workersText} ${warriorsText}`;
    }

    _getOperationStatusText(status) {
        switch (status) {
            case 'hiring':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_STATUS_HIRING_LABEL);
            case 'in_progress':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_STATUS_IN_PROGRESS_LABEL);
            case 'done':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_STATUS_DONE_LABEL);
        }
    }

    _getOperationTypeText(type) {
        switch (type) {
            case 'build_new_sub_nest':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_NEW_SUBNEST);
            case 'destroy_nest':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_DESTROY_NEST);
            case 'pillage_nest':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_PILLAGE_NEST);
            case 'bring_bug_corpse_to_nest':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_BRING_BUG);
            case 'transport_food':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_TRANSPORT_FOOD);
            case 'build_fortification':
                return this.$mm.get(GAME_MESSAGE_IDS.OPERATION_TYPE_LABEL_BUILD_FORTIFICATION);
        }   
    }

    _renderActivateBtnState() {
        if (this._isSelected) {
            this._activateBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_DEACTIVATE_BTN_LABEL);
        } else {
            this._activateBtn.innerHTML = this.$mm.get(GAME_MESSAGE_IDS.OPERATION_ACTIVATE_BTN_LABEL);
        }
    }

    _onStopBtnClick(e) {
        e.stopPropagation();
        this.events.emit('stopRequest');
    }

    _onActivateBtnClick() {
        this.events.emit('activate');
    }

}

export {
    OperationView
}