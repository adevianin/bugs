from enum import StrEnum

class NotificationTypes(StrEnum):
    DIED_ANT = 'died_ant'
    DIED_NEST = 'died_nest'
    NEST_ALARM_RAISED = 'nest_alarm_raised'
    NEST_ALARM_CANCELED = 'nest_alarm_canceled'