import { BaseViewModel } from "./baseViewModel"

class NotificationsContainerViewModel extends BaseViewModel {

    get notifications() {
        return this._props.notifications;
    }

    getNotificationsAfter(notificationId) {
        let index = this.notifications.findIndex(n => n.id == notificationId);
        if (index >= 0) {
            return this.notifications.slice(index + 1);
        }

        return [];
        
    }

    addNewNotification(newNotification) {
        this.notifications.push(newNotification);
        this.emit('newNotification', newNotification);
    }

    applyPatch(patch) {
        for (let newNotification of patch.add) {
            this.addNewNotification(newNotification);
        }
    }

}

export {
    NotificationsContainerViewModel
}