class WorldStatusView {
    constructor(requester, el) {
        this._requester = requester;
        this._el = el;
        this._isWorldRunningStatusEl = this._el.querySelector('[data-is-world-running]');
        this._stopWorldBtnEl = this._el.querySelector('[data-stop-world]');
        this._runWorldBtnEl = this._el.querySelector('[data-run-world]');
        this._saveWorldBtnEl = this._el.querySelector('[data-save-world]');
        this._expandMapBtnEl = this._el.querySelector('[data-expand-map-btn]');
        this._expandMapChunkRowsEl = this._el.querySelector('[data-chunk-rows]');
        this._expandMapChunkColsEl = this._el.querySelector('[data-chunk-cols]');

        this._stopWorldBtnEl.addEventListener('click', this._stopWorld.bind(this));
        this._runWorldBtnEl.addEventListener('click', this._runWorld.bind(this));
        this._saveWorldBtnEl.addEventListener('click', this._saveWorld.bind(this));
        this._expandMapBtnEl.addEventListener('click', this._expandMap.bind(this));

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

    _saveWorld() {
        this._requester.post('admin/world/save').then((resp) => {
            alert('saved')
        });
    }

    _expandMap() {
        this._requester.post('admin/world/expand_map', {
            chunk_rows: this._expandMapChunkRowsEl.value,
            chunk_cols: this._expandMapChunkColsEl.value
        })
        .then((resp) => {
            alert('expanded')
        }).catch(axiosErr => {
            let resp = axiosErr.response
            if (resp.status == 409) {
                alert(resp.data.msg);
            } else {
                alert('something went wrong');
            }
        });
    }

    _renderWorldStatus(status) {
        this._isWorldRunningStatusEl.innerText = status;
    }
}

export {
    WorldStatusView
}