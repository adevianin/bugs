import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import { ColonyView } from "./colonyView";

class ColoniesListView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._colonies = this.$domainFacade.findMyColonies();
        this._selectColony(this._colonies[0]);
        
        this._renderColonies();
        this._renderSelectedColony();
    }

    get selectedColony() {
        return this._selectedColony;
    }

    selectColony(colonyId) {
        let colony = this._colonies.find(colony => colony.id == colonyId);
        this._selectColony(colony);
        this._renderSelectedColony();
    }

    _renderSelectedColony() {
        for (let colonyId in this._colonyViews) {
            this._colonyViews[colonyId].toggleSelect(this._selectedColony.id == colonyId);
        }
    }

    _renderColonies() {
        this._clearColonyViews();
        this._colonies.forEach(colony => {
            let liEl = document.createElement('li');
            let colonyView = new ColonyView(liEl, colony);
            colonyView.events.addListener('click', () => this._onColonyViewClick(colony))
            this._colonyViews[colony.id] = colonyView;
            this._el.append(liEl);
        });
    }

    _clearColonyViews() {
        for (let colonyId in this._colonyViews) {
            this._colonyViews[colonyId].remove();
        }
        this._colonyViews = {};
    }

    _selectColony(colony) {
        this._selectedColony = colony;
        this.events.emit('selectedColonyChanged');
    }

    _onColonyViewClick(clickedColony) {
        this._selectColony(clickedColony);
        this._renderSelectedColony();
    }
}

export {
    ColoniesListView
}