import { BaseGameHTMLView } from '@view/base/baseGameHTMLView';
import { NotificationTypes } from "@domain/enum/notificationTypes";
import { DeathTypes } from "@domain/enum/deathTypes";
import { DamageTypes } from "@domain/enum/damageTypes";
import diedAntNotificationTmpl from './diedAntNotificationTmpl.html';
import diedNestNotificationTmpl from './diedNestNotificationTmpl.html';
import nestAlarmCanceledNotificationTmpl from './nestAlarmCanceledNotificationTmpl.html';
import nestAlarmRaisedNotificationTmpl from './nestAlarmRaisedNotificationTmpl.html';
import diedColonyNotificationTmpl from './diedColonyNotificationTmpl.html';
import { convertStepsToYear } from "@utils/convertStepsToYear";
import { PositionView } from '@view/panel/base/position/positionView';
import { GAME_MESSAGE_IDS } from '@messages/messageIds';
import { convertStepsToSeason } from '@utils/convertStepsToSeason';
import { SEASON_TYPES } from '@domain/enum/season_types';
import './styles.css';

class NotificationView extends BaseGameHTMLView {

    constructor(el, notification) {
        super(el);
        this._notification = notification;
        this._positionViews = [];

        this._render();

        this._stopListenHighlightRequest = this.$eventBus.on(`hightlightNotificationRequest:${notification.id}`, this._onHighlightRequest.bind(this));
    }

    remove() {
        super.remove();
        for (let positionView of this._positionViews) {
            positionView.remove();
        }
        this._stopListenHighlightRequest();
        clearTimeout(this._hightlightTimer);
    }

    _onHighlightRequest() {
        let hightLightClass = 'notification--hightlighted';
        this._el.classList.add(hightLightClass);
        this._hightlightTimer = setTimeout(() => {
            this._el.classList.remove(hightLightClass);
        }, 1000);
    }

    _render() {
        this._el.classList.add('notification');
        
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
        this._el.querySelector('[data-notification-object]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_ANT);
        this._el.querySelector('[data-ant-name]').innerHTML = this._notification.antName;
        this._el.querySelector('[data-death-describe]').innerHTML = this._generateAntDeathDescribeText();
        if (this._notification.deathRecord.type == DeathTypes.NUPTIAL_FLY) {
            this._el.querySelector('[data-death-position]').remove();
        } else {
            let deathPositionText = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_PLACE);
            this._renderPosition(this._notification.deathRecord.deathPosition, this._el.querySelector('[data-death-position]'), deathPositionText);
        }
        
        this._renderDate(this._el.querySelector('[data-year]'), this._notification.step);
    }

    _renderDiedNestNotification() {
        this._el.innerHTML = diedNestNotificationTmpl;
        this._el.querySelector('[data-notification-object]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_NEST);
        this._el.querySelector('[data-death-describe]').innerHTML = this._generateNestDeathDescribeText();
        this._el.querySelector('[data-nest-name]').innerHTML = this._notification.nestName;
        let deathPositionText = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_PLACE);
        this._renderPosition(this._notification.deathRecord.deathPosition, this._el.querySelector('[data-death-position]'), deathPositionText);
        this._renderDate(this._el.querySelector('[data-year]'), this._notification.step);
    }

    _renderNestAlarmRaisedNotification() {
        this._el.innerHTML = nestAlarmRaisedNotificationTmpl;
        this._el.querySelector('[data-notification-object]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_NEST);
        this._el.querySelector('[data-raised-alarm-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_NEST_RAISED_ALARM);
        this._renderPosition(this._notification.nestPosition, this._el.querySelector('[data-nest-name]'), this._notification.nestName);
        this._renderDate(this._el.querySelector('[data-year]'), this._notification.step);
    }

    _renderNestAlarmCanceledNotification() {
        this._el.innerHTML = nestAlarmCanceledNotificationTmpl;
        this._el.querySelector('[data-notification-object]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_NEST);
        this._el.querySelector('[data-canceled-alarm-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_NEST_CANCELED_ALARM);
        this._renderPosition(this._notification.nestPosition, this._el.querySelector('[data-nest-name]'), this._notification.nestName);
        this._renderDate(this._el.querySelector('[data-year]'), this._notification.step);
    }

    _renderDiedColonyNotification() {
        this._el.innerHTML = diedColonyNotificationTmpl;
        this._el.querySelector('[data-notification-object]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_OBJECT_COLONY);
        this._el.querySelector('[data-destroyed-label]').innerHTML = this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_COLONY_DEATH_DESTROYED);
        this._el.querySelector('[data-colony-name]').innerHTML = this._notification.colonyName;
        this._renderDate(this._el.querySelector('[data-year]'), this._notification.step);
    }

    _generateAntDeathDescribeText() {
        switch(this._notification.deathRecord.type) {
            case DeathTypes.DAMAGE:
                switch(this._notification.deathRecord.damageType) {
                    case DamageTypes.COMBAT:
                        return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_COMBAT);
                    case DamageTypes.COLD:
                        return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_FREEZED);
                }
            case DeathTypes.AGED:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_AGED);
            case DeathTypes.HUNGER:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_HUNGER);
            case DeathTypes.NO_HOME:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_WITHOUT_HOME);
            case DeathTypes.NUPTIAL_FLY:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_NUPTIAL_FLIGHT);
            case DeathTypes.SIMPLE:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_UNKNOWN);
            case DeathTypes.BURIED_IN_DESTRUCTED_NEST:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_ANT_DEATH_BURIED_IN_NEST);
        }
    }

    _generateNestDeathDescribeText() {
        switch(this._notification.deathRecord.type) {
            case DeathTypes.DAMAGE:
                switch(this._notification.deathRecord.damageType) {
                    case DamageTypes.COMBAT:
                        return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_COMBAT);
                    case DamageTypes.DECAY:
                        return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_DECAY);
                }
            case DeathTypes.SIMPLE:
                return this.$mm.get(GAME_MESSAGE_IDS.NOTIFICATION_NEST_DEATH_UNKNOWN);
        }
    }

    _renderPosition(position, el, linkText) {
        let view = new PositionView(el, position, linkText);
        this._positionViews.push(view);
    }

    _renderDate(el, steps) {
        let yearText = convertStepsToYear(steps);
        let seasonText = this._convertSeasonToText(convertStepsToSeason(steps));
        el.innerHTML = `${seasonText} ${yearText}`;
    }

    _convertSeasonToText(season) {
        switch (season) {
            case SEASON_TYPES.SPRING:
                return this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_SPRING);
            case SEASON_TYPES.SUMMER:
                return this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_SUMMER);
            case SEASON_TYPES.AUTUMN:
                return this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_AUTUMN);
            case SEASON_TYPES.WINTER:
                return this.$mm.get(GAME_MESSAGE_IDS.SEASON_LABEL_WINTER);
        }
    }

}

export {
    NotificationView
}