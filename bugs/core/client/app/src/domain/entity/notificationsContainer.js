import { EventEmitter } from "@utils/eventEmitter";

class NotificationsContainer extends EventEmitter {

    constructor() {
        super();
        this._notifications = [];
    }

    get notifications() {
        return this._notifications;
    }

    setNotifications(notifications) {
        this._notifications = this._notifications.concat(notifications);
        // this._sortByStep();
    }

    pushNewNotification(notification) {
        this._notifications.push(notification);
        this.emit('newNotification', notification);
    }

    // _sortByStep() {
    //     this._notifications.sort((n1, n2) => n1.step - n2.step);
    // }
}

export {
    NotificationsContainer
}