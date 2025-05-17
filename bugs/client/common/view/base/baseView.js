import { EventEmitter } from "@common/utils/eventEmitter";

class BaseView {

    static domain;
    static eventBus;
    static mm;

    get $domain() {
        return BaseView.domain;
    }

    get $eventBus() {
        return BaseView.eventBus;
    }

    get $mm() {
        return BaseView.mm;
    }

    static useDomain(domain) {
        BaseView.domain = domain;
    }

    static useEventBus(eventBus) {
        BaseView.eventBus = eventBus;
    }

    static useMessageMaster(mm) {
        BaseView.mm = mm;
    }

    constructor() {
        this.events = new EventEmitter();
    }

    remove(){
        this.events.removeAllListeners();
    }

}

export {
    BaseView
}   