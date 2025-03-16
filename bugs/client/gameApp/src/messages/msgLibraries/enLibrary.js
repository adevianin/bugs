import { GAME_MESSAGE_IDS } from "../messageIds";
import { COMMON_EN_LIBRARY } from "@common/messages/msgLibraries/enLibrary";

const EN_LIBRARY = {
    ...COMMON_EN_LIBRARY,
    [GAME_MESSAGE_IDS.OLD_PASSWORD_NEEDED]: 'Old password is not specified.',
    [GAME_MESSAGE_IDS.TAB_BREEDING]: 'Breeding',
    [GAME_MESSAGE_IDS.TAB_COLONIES]: 'Colonies',
    [GAME_MESSAGE_IDS.TAB_SPECIE]: 'Specie',
    [GAME_MESSAGE_IDS.TAB_NOTIFICATIONS]: 'Notifications',
    [GAME_MESSAGE_IDS.TAB_RATING]: 'Rating',
    [GAME_MESSAGE_IDS.TAB_ACCOUNT]: 'Account',
}

export {
    EN_LIBRARY
}