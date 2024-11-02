class UserService {

    constructor(userApi, notificationsContainer) {
        this._userApi = userApi;
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

    prepareStarterPack() {
        this._userApi.prepareStarterPack();
    }

}

export {
    UserService
}