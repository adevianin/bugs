import { BaseGameService } from "./base/baseGameService";

class UserService extends BaseGameService {

    constructor(mainEventBus, world, serverConnection) {
        super(mainEventBus, world);
        this._serverConnection = serverConnection;
        this._notifications = [];

        this._serverConnection.events.on('message', this._onMessage.bind(this));
    }

    setUserData(userData) {
        this._userData = userData;
    }

    verifyEmailForUser() {
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

    _onMessage(msg) {
        if (msg.type == 'email_verified') {
            this.verifyEmailForUser();
        }
    }

}

export {
    UserService
}