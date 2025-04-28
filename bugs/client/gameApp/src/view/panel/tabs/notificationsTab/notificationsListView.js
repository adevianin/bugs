import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import notificationsListTmpl from './notificationsListTmpl.html';
import { NotificationView } from "./notification/notificationView";

class NotificationsListView extends BaseGameHTMLView {

    constructor(el) {
        super(el);
        this._notificationsContainer = this.$domain.myState.notificationsContainer;
        this._notifications = this._notificationsContainer.notifications.slice().reverse();
        this._notificationViews = [];
        this._currentPortionIndex = 0;
        this._portionSize = 20;

        this._render();

        this._notificationsContainer.on('newNotification', this._onNewNotification.bind(this));
        if (this._notifications.length == 0) {
            this._notificationsContainer.once('newNotification', this._onFirstNotificationAdded.bind(this));
        }
        this._showMoreBtn.addEventListener('click', this._onShowMoreBtnClick.bind(this));
    }

    _render() {
        this.el.innerHTML = notificationsListTmpl;

        this._listEl = this._el.querySelector('[data-notifications-list]');
        this._showMoreBtn = this._el.querySelector('[data-show-more]');

        this._notificationsContainerEl = this._el.querySelector('[data-notifications-container]');
        this._notificationPlaceholderEl = this._el.querySelector('[data-notifications-placeholder]');

        this._renderCurrentPortion();
        this._renderEmptyState();
    }

    _renderEmptyState() {
        let isEmpty = this._notifications.length == 0;
        this._notificationsContainerEl.classList.toggle('g-hidden', isEmpty);
        this._notificationPlaceholderEl.classList.toggle('g-hidden', !isEmpty);
    }

    _renderNotification(notification, atStart = false) {
        let el = document.createElement('tr');
        let view = new NotificationView(el, notification);
        if (atStart) {
            this._listEl.prepend(el);
            this._notificationViews.unshift(view);
        } else {
            this._listEl.append(el);
            this._notificationViews.push(view);
        }
    }

    _renderCurrentPortion() {
        let startIndex = this._currentPortionIndex * this._portionSize;
        let endIndex = startIndex + this._portionSize;

        let notificationsToRenderNow = this._notifications.slice(startIndex, endIndex);
        for (let notification of notificationsToRenderNow) {
            this._renderNotification(notification);
        }

        this._renderShowMoreBtnState();
    }

    _showNextPortion() {
        this._currentPortionIndex++;
        this._renderCurrentPortion();
    }

    _onNewNotification(notification) {
        if (this._notificationViews.length && (this._notificationViews.length % this._portionSize == 0)) {
            let view = this._notificationViews.pop();
            view.remove();
        }
        this._notifications.unshift(notification);
        this._renderNotification(notification, true);
        this._renderShowMoreBtnState();
    }

    _renderShowMoreBtnState() {
        let renderedPortionsCount = this._currentPortionIndex + 1;
        let isAllShowed = renderedPortionsCount * this._portionSize >= this._notifications.length;
        this._showMoreBtn.classList.toggle('g-hidden', isAllShowed);
    }

    _onShowMoreBtnClick() {
        this._showNextPortion();
    }

    _onFirstNotificationAdded() {
        this._renderEmptyState();
    }

}

export {
    NotificationsListView
}