import { BaseGameService } from "./base/baseGameService";

class UserService extends BaseGameService {

    constructor(mainEventBus, world) {
        super(mainEventBus, world);
        this._notifications = [];
    }

    setUserData(userData) {
        this._userData = userData;
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

    initNotifications(notifications) {
        this._notifications = notifications;
    }

    getNotifications() {
        return this._notifications;
    }

    playUserAction(action) {
        this._notifications.push(action.notification);
        this._mainEventBus.emit('newNotification', action.notification);
    }

}

export {
    UserService
}