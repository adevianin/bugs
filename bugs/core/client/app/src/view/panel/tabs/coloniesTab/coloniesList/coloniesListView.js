import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import { ColonyView } from "./colonyView";

class ColoniesListView extends BaseHTMLView {

    constructor(el) {
        super(el);

        this.$domainFacade.events.on('colonyBorn', this._onColonyBorn.bind(this));

        this._colonies = this.$domainFacade.findMyColonies();
        
        this._renderColonies();
        this._autoSelect();
    }

    get selectedColony() {
        return this._selectedColony;
    }

    selectColony(colonyId) {
        let colony = this._colonies.find(colony => colony.id == colonyId);
        this._selectColony(colony);
    }

    _autoSelect() {
        if (!this.selectedColony && this._colonies.length > 0) {
            this._selectColony(this._colonies[0]);
        }
    }

    _renderColonies() {
        this._clearColonyViews();
        this._colonies.forEach(colony => this._renderColony(colony));
    }

    _renderColony(colony) {
        let liEl = document.createElement('li');
        let colonyView = new ColonyView(liEl, colony);
        colonyView.events.addListener('click', () => this._onColonyViewClick(colony))
        this._colonyViews[colony.id] = colonyView;
        this._el.append(liEl);
    }

    _clearColonyViews() {
        for (let colonyId in this._colonyViews) {
            this._colonyViews[colonyId].remove();
        }
        this._colonyViews = {};
        this._selectedColony = null;
    }

    _selectColony(colony) {
        this._selectedColony = colony;
        this._renderSelectedColony();
        this.events.emit('selectedColonyChanged');
    }

    _renderSelectedColony() {
        for (let colonyId in this._colonyViews) {
            this._colonyViews[colonyId].toggleSelect(this._selectedColony.id == colonyId);
        }
    }

    _onColonyViewClick(clickedColony) {
        this._selectColony(clickedColony);
    }

    _onColonyBorn(colony) {
        let isMine = this.$domainFacade.isColonyMine(colony);
        if (isMine) {
            this._colonies.push(colony);
            this._renderColony(colony);
            this._autoSelect();
        }
    }
}

export {
    ColoniesListView
}