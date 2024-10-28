import { BaseHTMLView } from "@view/base/baseHTMLView";
import { NotificationTypes } from "@domain/enum/notificationTypes";
import { DeathTypes } from "@domain/enum/deathTypes";
import { DamageTypes } from "@domain/enum/damageTypes";
import diedAntNotificationTmpl from './diedAntNotificationTmpl.html';
import diedNestNotificationTmpl from './diedNestNotificationTmpl.html';
import nestAlarmCanceledNotificationTmpl from './nestAlarmCanceledNotificationTmpl.html';
import nestAlarmRaisedNotificationTmpl from './nestAlarmRaisedNotificationTmpl.html';
import diedColonyNotificationTmpl from './diedColonyNotificationTmpl.html';
import { converStepsToYear } from "@utils/convertStepsToYear";

class NotificationView extends BaseHTMLView {

    constructor(el, notification) {
        super(el);
        this._notification = notification;

        this._render();
    }

    _render() {
        switch (this._notification.type) {
            case NotificationTypes.DIED_ANT:
                this._renderDiedAntNotification();
                break;
            case NotificationTypes.DIED_NEST:
                this._renderDiedNestNotification();
                break;
            case NotificationTypes.NEST_ALARM_RAISED:
                this._renderNestAlarmRaisedNotification();
                break;
            case NotificationTypes.NEST_ALARM_CANCELED:
                this._renderNestAlarmCanceledNotification();
                break;
            case NotificationTypes.DIED_COLONY:
                this._renderDiedColonyNotification();
                break;
            default:
                throw 'unknown notification type';
        }
    }

    _renderDiedAntNotification() {
        this._el.innerHTML = diedAntNotificationTmpl;
        this._el.querySelector('[data-ant-name]').innerHTML = this._notification.antName;
        this._el.querySelector('[data-death-describe]').innerHTML = this._generateAntDeathDescribeText();
        this._el.querySelector('[data-death-position]').innerHTML = this._renderPosition(this._notification.deathRecord.deathPosition);
        this._el.querySelector('[data-year]').innerHTML = converStepsToYear(this._notification.step) ;
    }

    _renderDiedNestNotification() {
        this._el.innerHTML = diedNestNotificationTmpl;
        this._el.querySelector('[data-nest-name]').innerHTML = this._notification.nestName;
        this._el.querySelector('[data-death-position]').innerHTML = this._renderPosition(this._notification.deathRecord.deathPosition);
        this._el.querySelector('[data-year]').innerHTML = converStepsToYear(this._notification.step) ;
    }

    _renderNestAlarmRaisedNotification() {
        this._el.innerHTML = nestAlarmRaisedNotificationTmpl;
        this._el.querySelector('[data-nest-name]').innerHTML = this._notification.nestName;
        this._el.querySelector('[data-death-position]').innerHTML = this._renderPosition(this._notification.nestPosition);
        this._el.querySelector('[data-year]').innerHTML = converStepsToYear(this._notification.step);
    }

    _renderNestAlarmCanceledNotification() {
        this._el.innerHTML = nestAlarmCanceledNotificationTmpl;
        this._el.querySelector('[data-nest-name]').innerHTML = this._notification.nestName;
        this._el.querySelector('[data-death-position]').innerHTML = this._renderPosition(this._notification.nestPosition);
        this._el.querySelector('[data-year]').innerHTML = converStepsToYear(this._notification.step) ;
    }

    _renderDiedColonyNotification() {
        this._el.innerHTML = diedColonyNotificationTmpl;
        this._el.querySelector('[data-colony-name]').innerHTML = this._notification.colonyName;
        this._el.querySelector('[data-year]').innerHTML = converStepsToYear(this._notification.step) ;
    }

    _generateAntDeathDescribeText() {
        switch(this._notification.deathRecord.type) {
            case DeathTypes.DAMAGE:
                switch(this._notification.deathRecord.damageType) {
                    case DamageTypes.COMBAT:
                        return 'загинув в бою';
                    case DamageTypes.COLD:
                        return 'замерз';
                }
            case DeathTypes.AGED:
                return 'помер від старості';
            case DeathTypes.HUNGER:
                return 'помер з голоду';
            case DeathTypes.NO_HOME:
                return 'помер без дому';
            case DeathTypes.NUPTIAL_FLY:
                return 'помер в шлюбному льоті';
            case DeathTypes.SIMPLE:
                return 'помер з невідомих причин';
        }
    }

    _renderPosition(position) {
        return `(${position.x}:${position.y})`;
    }

}

export {
    NotificationView
}