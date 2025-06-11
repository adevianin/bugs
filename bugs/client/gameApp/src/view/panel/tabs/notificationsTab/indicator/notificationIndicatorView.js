import { BaseGameHTMLView } from "@view/base/baseGameHTMLView";
import './styles.css';

class NotificationIndicatorView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._notificationsContainer = this.$domain.myState.notificationsContainer;
        this._isReadingNotifications = false;

        this._render();

        this.$eventBus.on('tabSwitched:panel', this._onPanelTabSwitched.bind(this));
        this._notificationsContainer.on('newNotification', this._onNewNotification.bind(this));
    }

    _render() {
        this._el.classList.add('notification-indicator-container');
        this._indicatorEl = document.createElement('div');
        this._indicatorEl.classList.add('notification-indicator');

        let hasUnread = this._checkHasUnreadNotifications();
        this._toggleIndicator(hasUnread);

        this._el.append(this._indicatorEl);
    }

    _toggleIndicator(isEnabled) {
        this._indicatorEl.classList.toggle('g-hidden', !isEnabled);
    }

    _onPanelTabSwitched(tabName) {
        if (tabName == 'notifications') {
            this._isReadingNotifications = true;
            this._saveLastReadNotificationId();
            this._toggleIndicator(false);
        } else {
            this._isReadingNotifications = false;
        }
    }

    _onNewNotification() {
        if (this._isReadingNotifications) {
            this._saveLastReadNotificationId();
        } else {
            this._toggleIndicator(true);
        }
    }

    _saveLastReadNotificationId() {
        let lastNotification = this._getLastNotification();
        if (lastNotification) {
            let key = this._buildLastReadNotificationIdKey();
            localStorage.setItem(key, lastNotification.id);
        }
    }

    _checkHasUnreadNotifications() {
        let lastNotification = this._getLastNotification();
        if (!lastNotification) {
            return false;
        }

        let key = this._buildLastReadNotificationIdKey();
        let lastReadNotificationId = localStorage.getItem(key);
        if (!lastReadNotificationId) {
            return false;
        }
        return lastReadNotificationId != lastNotification.id;
    }

    _getLastNotification() {
        let notificationsCount = this._notificationsContainer.notifications.length;
        if (notificationsCount == 0) {
            return null;
        }
        let lastNotification = this._notificationsContainer.notifications[notificationsCount - 1];
        return lastNotification;
    }

    _buildLastReadNotificationIdKey() {
        let userData = this.$domain.getUserData();
        return `lastReadNotification_${userData.id}`;
    }

}

export {
    NotificationIndicatorView
}