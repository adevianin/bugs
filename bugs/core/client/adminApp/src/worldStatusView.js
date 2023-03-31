class WorldStatusView {
    constructor(requester, el) {
        this._requester = requester;
        this._el = el;
        this._isWorldRunningStatusEl = this._el.querySelector('[data-is-world-running]');
        this._stopWorldBtnEl = this._el.querySelector('[data-stop-world]');
        this._runWorldBtnEl = this._el.querySelector('[data-run-world]');

        this._stopWorldBtnEl.addEventListener('click', this._stopWorld.bind(this));
        this._runWorldBtnEl.addEventListener('click', this._runWorld.bind(this));

        this._checkWorldStatus();
        setInterval(this._checkWorldStatus.bind(this), 30000);
    }

    _checkWorldStatus() {
        this._requester.post('admin/world/status').then((resp) => {
            this._renderWorldStatus(resp.data.status);
        });
    }

    _stopWorld() {
        this._requester.post('admin/world/stop').then((resp) => {
            this._renderWorldStatus(resp.data.status);
        });
    }

    _runWorld() {
        this._requester.post('admin/world/run').then((resp) => {
            this._renderWorldStatus(resp.data.status);
        });
    }

    _renderWorldStatus(status) {
        this._isWorldRunningStatusEl.innerText = status;
    }
}

export {
    WorldStatusView
}