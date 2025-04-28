import { BaseViewModel } from "./baseViewModel"

class NotificationsContainerViewModel extends BaseViewModel {

    get notifications() {
        return this._props.notifications;
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