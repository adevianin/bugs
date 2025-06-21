class WorldStatusView {
    constructor(requester, el) {
        this._requester = requester;
        this._el = el;
        this._isWorldRunningStatusEl = this._el.querySelector('[data-is-world-running]');
        this._isWorldInitedStatusEl = this._el.querySelector('[data-is-world-inited]');
        this._initWorldBtnEl = this._el.querySelector('[data-init-world]');
        this._stopWorldBtnEl = this._el.querySelector('[data-stop-world]');
        this._runWorldBtnEl = this._el.querySelector('[data-run-world]');
        this._saveWorldBtnEl = this._el.querySelector('[data-save-world]');
        this._countAntsBtnEl = this._el.querySelector('[data-count-ants]');
        this._populatePerformanceTestBtnEl = this._el.querySelector('[data-populate-for-performance-test]');
        this._expandMapBtnEl = this._el.querySelector('[data-expand-map-btn]');
        this._expandMapChunkRowsEl = this._el.querySelector('[data-chunk-rows]');
        this._expandMapChunkColsEl = this._el.querySelector('[data-chunk-cols]');
        this._worldControlsEl = this._el.querySelector('[data-world-controls]');
        this._playersOnlineEl = this._el.querySelector('[data-players-online]');

        this._initWorldBtnEl.addEventListener('click', this._initWorld.bind(this));
        this._stopWorldBtnEl.addEventListener('click', this._stopWorld.bind(this));
        this._runWorldBtnEl.addEventListener('click', this._runWorld.bind(this));
        this._saveWorldBtnEl.addEventListener('click', this._saveWorld.bind(this));
        this._countAntsBtnEl.addEventListener('click', this._countAnts.bind(this));
        this._populatePerformanceTestBtnEl.addEventListener('click', this._onPopulateForPerformanceTest.bind(this));
        this._expandMapBtnEl.addEventListener('click', this._expandMap.bind(this));

        this._checkWorldStatus();
        setInterval(this._checkWorldStatus.bind(this), 30000);
    }

    _checkWorldStatus() {
        this._requester.get('api/admin/world/status').then(result => {
            this._renderWorldStatus(result.data.status);
        }).catch(result => {
            if (!result.status) {
                alert('server is not responding!!!');
            } else {
                alert('server in bad state');
            }
        });
    }

    _initWorld() {
        this._requester.post('api/admin/world/init').then(res => {
            this._renderWorldStatus(res.data.status);
        }).catch(() => {
            alert('something went wrong');
        });
    }

    _stopWorld() {
        this._requester.post('api/admin/world/stop').then(res => {
            this._renderWorldStatus(res.data.status);
        }).catch(() => {
            alert('something went wrong');
        });
    }

    _runWorld() {
        this._requester.post('api/admin/world/run').then(res => {
            this._renderWorldStatus(res.data.status);
        }).catch(() => {
            alert('something went wrong');
        });
    }

    _saveWorld() {
        this._requester.post('api/admin/world/save').then(res => {
            alert('saved')
        }).catch(() => {
            alert('something went wrong');
        });
    }

    _countAnts() {
        this._requester.post('api/admin/world/count_ants').then(res => {
            alert(res.data.ants_count);
        }).catch(() => {
            alert('something went wrong');
        });
    }

    _onPopulateForPerformanceTest() {
        this._requester.post('api/admin/world/populate_for_performance_test').then(res => {
            alert('populated')
        }).catch(() => {
            alert('something went wrong');
        });
    }

    _expandMap() {
        this._requester.post('api/admin/world/expand_map', {
            chunk_rows: this._expandMapChunkRowsEl.value,
            chunk_cols: this._expandMapChunkColsEl.value
        })
        .then(res => {
            alert('expanded')
        }).catch(res => {
            if (res.status == 409) {
                alert(res.data.msg);
            } else {
                alert('something went wrong');
            }
        });
    }

    _renderWorldStatus(status) {
        this._isWorldRunningStatusEl.innerText = status.isRunning;
        this._isWorldInitedStatusEl.innerText = status.isInited;
        this._playersOnlineEl.innerText = status.playersOnline;
        
        this._worldControlsEl.disabled = !status.isInited;
        this._initWorldBtnEl.disabled = status.isInited;
        this._saveWorldBtnEl.disabled = status.isRunning;
        this._populatePerformanceTestBtnEl.disabled = status.isRunning;
        this._expandMapBtnEl.disabled = status.isRunning;
        this._runWorldBtnEl.disabled = status.isRunning;
        this._stopWorldBtnEl.disabled = !status.isRunning;
    }
}

export {
    WorldStatusView
}