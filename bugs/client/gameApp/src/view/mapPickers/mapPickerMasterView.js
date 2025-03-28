import * as PIXI from 'pixi.js';
import { BaseGraphicView } from "@view/base/baseGraphicView";
import { RaidNestPickerView } from "./raidNestPickerView";
import { NewNestPositionPickerView } from "./newNestPositionPickerView";
import { BorderView } from './borderView';

class MapPickerMasterView extends BaseGraphicView {

    constructor(container, borderEl) {
        super();
        this._container = container;
        this._borderEl = borderEl;

        this._render();

        this.$eventBus.on('raidNestPickRequest', this._onRaidNestPickRequest.bind(this));
        this.$eventBus.on('newNestPositionPickRequest', this._onNewNestPositionPickRequest.bind(this));
        this.$eventBus.on('deactivateMapPickerRequest', this._onPickerDeactivateRequest.bind(this));
        this.$eventBus.on('tabSwitched', this._onSomeTabSwitched.bind(this));
    }

    _render() {
        let newNestPositionPickerContainer = new PIXI.Container();
        this._container.addChild(newNestPositionPickerContainer);
        this._newNestPositionPickerView = new NewNestPositionPickerView(newNestPositionPickerContainer);

        let nestPickerContainer = new PIXI.Container();
        this._container.addChild(nestPickerContainer);
        this._raidNestPickerView = new RaidNestPickerView(nestPickerContainer);

        this._borderView = new BorderView(this._borderEl);
    }

    _onRaidNestPickRequest(raidingColonyId, raidAreaCenter, callback) {
        if (this._raidNestPickerView.isActivated) {
            return;
        }
        this._raidNestPickerView.activate(raidingColonyId, raidAreaCenter, nest => {
            callback(nest);
            this._deactivateAll();
        });
        this._borderView.activate(this.$messages.pick_nest);
    }

    _onNewNestPositionPickRequest(mainNestPosition, callback) {
        if (this._newNestPositionPickerView.isActivated) {
            return;
        }
        this._newNestPositionPickerView.activate(mainNestPosition, point => {
            callback(point);
            this._deactivateAll();
        });
        this._borderView.activate(this.$messages.pick_position);
    }

    _onPickerDeactivateRequest() {
        this._deactivateAll();
    }
    
    _onSomeTabSwitched() {
        this._deactivateAll();
    }

    _deactivateAll() {
        if (this._raidNestPickerView.isActivated) {
            this._raidNestPickerView.deactivate();
        }
        if (this._newNestPositionPickerView.isActivated) {
            this._newNestPositionPickerView.deactivate();
        }
        this._borderView.deactivate();
    }

}

export {
    MapPickerMasterView
}