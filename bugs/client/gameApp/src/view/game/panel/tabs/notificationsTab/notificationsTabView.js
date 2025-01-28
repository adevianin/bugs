import './styles.css';
import { BaseHTMLView } from "@view/base/baseHTMLView";
import notificationsTabTmpl from './notificationsTabTmpl.html';
import { NotificationsListView } from "./notificationsListView";

class NotificationsTabView extends BaseHTMLView {

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