import { MESSAGE_IDS } from "../messageIds";
import { EN_BASE_LIBRARY } from "@common/messages/msgLibraries/enLibrary";

const EN_LIBRARY = {
    ...EN_BASE_LIBRARY,
    [MESSAGE_IDS.TAB_BREEDING]: 'Breeding',
    [MESSAGE_IDS.TAB_COLONIES]: 'Colonies',
    [MESSAGE_IDS.TAB_SPECIE]: 'Specie',
    [MESSAGE_IDS.TAB_NOTIFICATIONS]: 'Notifications',
    [MESSAGE_IDS.TAB_RATING]: 'Rating',
    [MESSAGE_IDS.TAB_ACCOUNT]: 'Account',
}

export {
    EN_LIBRARY
}