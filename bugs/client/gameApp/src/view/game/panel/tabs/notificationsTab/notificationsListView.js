import { BaseHTMLView } from "@view/base/baseHTMLView";
import notificationsListTmpl from './notificationsListTmpl.html';
import { NotificationView } from "./notification/notificationView";

class NotificationsListView extends BaseHTMLView {

    constructor(el) {
        super(el);
        this._notificationsContainer = this.$domainFacade.notificationsContainer;
        this._notificationViews = [];

        this._render();

        this._notificationsContainer.on('newNotification', this._onNewNotification.bind(this));

    }

    _render() {
        this.el.innerHTML = notificationsListTmpl;

        this._listEl = this._el.querySelector('[data-notifications-list]');

        for (let notification of this._notificationsContainer.notifications) {
            this._renderNotification(notification);
        }
    }

    _renderNotification(notification) {
        let el = document.createElement('tr');
        let view = new NotificationView(el, notification);
        this._notificationViews.push(view);
        this._listEl.append(el);
    }

    _onNewNotification(notification) {
        this._renderNotification(notification);
    }

}

export {
    NotificationsListView
}