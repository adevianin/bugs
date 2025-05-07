import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import notificationsTabTmpl from './notificationsTabTmpl.html';
import { NotificationsListView } from "./notificationsListView";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';

class NotificationsTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = notificationsTabTmpl;
        
        this._notificationsListView = new NotificationsListView(this._el.querySelector('[data-notifications]'));
        this._el.querySelector('[data-tab-title]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_TITLE);
    }

}

export {
    NotificationsTabView
}