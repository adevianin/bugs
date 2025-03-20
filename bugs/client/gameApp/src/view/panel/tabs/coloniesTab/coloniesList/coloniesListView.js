import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { ColonyView } from "./colonyView";

class ColoniesListView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this.$domain.events.on('colonyBorn', this._onColonyBorn.bind(this));
        this.$domain.events.on('colonyDied', this._onColonyDied.bind(this));

        this._colonies = this.$domain.findMyColonies();
        this._colonyViews = {};
        this._selectedColony = null;
        
        this._renderColonies();
    }

    get selectedColony() {
        return this._selectedColony;
    }

    selectColony(colonyId) {
        let colony = this._colonies.find(colony => colony.id == colonyId);
        this._selectColony(colony, true);
    }

    _renderColonies() {
        this._colonies.forEach(colony => this._renderColony(colony));
    }

    _renderColony(colony) {
        let liEl = document.createElement('li');
        let colonyView = new ColonyView(liEl, colony);
        colonyView.events.on('click', () => this._onColonyViewClick(colony))
        this._colonyViews[colony.id] = colonyView;
        this._el.append(liEl);
    }

    _selectColony(colony, silent = false) {
        this._selectedColony = colony;
        this._renderSelectedColony();
        if (!silent) {
            this.events.emit('selectedColonyChanged');
        }
    }

    _renderSelectedColony() {
        for (let colonyId in this._colonyViews) {
            this._colonyViews[colonyId].toggleSelect(this._selectedColony.id == colonyId);
        }
    }

    _deleteColonyEntity(colony) {
        let index = this._colonies.indexOf(colony);
        if (index != -1) {
            this._colonies.splice(index, 1);
        }
    }

    _deleteColonyView(colony) {
        this._colonyViews[colony.id].remove();
        delete this._colonyViews[colony.id];
    }

    _onColonyViewClick(clickedColony) {
        this._selectColony(clickedColony);
    }

    _onColonyBorn(colony) {
        let isMine = this.$domain.isColonyMy(colony);
        if (isMine) {
            this._colonies.push(colony);
            this._renderColony(colony);
            if (!this._selectedColony) {
                this._selectColony(colony);
            }
        }
    }

    _onColonyDied(colony) {
        let isMine = this.$domain.isColonyMy(colony);
        if (isMine) {
            this._deleteColonyEntity(colony);
            this._deleteColonyView(colony);
            if (this._selectedColony == colony) {
                this._selectedColony = null;
                if (this._colonies.length > 0) {
                    this._selectColony(this._colonies[0]);
                }
            }
        }
    }
}

export {
    ColoniesListView
}