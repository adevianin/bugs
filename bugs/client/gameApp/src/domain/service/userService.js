import { BaseGameService } from "./base/baseGameService";

class UserService extends BaseGameService {

    constructor(mainEventBus, world, notificationsContainer) {
        super(mainEventBus, world);
        this._notificationsContainer = notificationsContainer
    }

    get notificationsContainer() {
        return this._notificationsContainer;
    }

    setUserData(userData) {
        this._userData = userData;
    }

    initNotifications(notifications) {
        this._notificationsContainer.setNotifications(notifications);
    }

    playUserAction(action) {
        this._notificationsContainer.pushNewNotification(action.notification);
    }

    getUserData() {
        return this._userData;
    }

    updateUserData(newUserData) {
        this._userData = newUserData;
    }

    verifyEmailForUser() {
        this._userData.isEmailVerified = true;
        this._mainEventBus.emit('emailVerified');
    }

}

export {
    UserService
}