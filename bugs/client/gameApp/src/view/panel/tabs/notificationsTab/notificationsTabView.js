import './styles.css';
import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import notificationsTabTmpl from './notificationsTabTmpl.html';
import { NotificationsListView } from "./notificationsListView";
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { PanelTabHeadView } from '@view/panel/panelTabHead/panelTabHeadView';

class NotificationsTabView extends BaseGameHTMLView {

    constructor(el) {
        super(el);

        this._render();
    }

    _render() {
        this._el.innerHTML = notificationsTabTmpl;
        
        this._notificationsListView = new NotificationsListView(this._el.querySelector('[data-notifications]'));

        let tabName = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATIONS_TAB_TITLE);
        this._tabHeadView = new PanelTabHeadView(this._el.querySelector('[data-tab-head]'), tabName);
    }

}

export {
    NotificationsTabView
}