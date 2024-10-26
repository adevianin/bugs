class UserService {

    constructor(notificationsContainer) {
        this._notificationsContainer = notificationsContainer
    }

    get notificationsContainer() {
        return this._notificationsContainer;
    }

    initNotifications(notifications) {
        this._notificationsContainer.setNotifications(notifications);
    }

    playUserAction(action) {
        this._notificationsContainer.pushNewNotification(action.notification);
    }

}

export {
    UserService
}