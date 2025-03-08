import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import notificationsTabTmpl from './notificationsTabTmpl.html';
import { NotificationsListView } from "./notificationsListView";

class NotificationsTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = notificationsTabTmpl;
        
        this._notificationsListView = new NotificationsListView(this._el.querySelector('[data-notifications]'));
    }

}

export {
    NotificationsTabView
}