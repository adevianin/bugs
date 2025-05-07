import { AntTypes } from "@domain/enum/antTypes";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";

let antTypesLabelIds = {
    [AntTypes.WORKER]: GAME_MESSAGE_IDS.ANT_TYPE_WORKER,
    [AntTypes.WARRIOR]: GAME_MESSAGE_IDS.ANT_TYPE_WARRIOR,
    [AntTypes.QUEEN]: GAME_MESSAGE_IDS.ANT_TYPE_FEMALE,
    [AntTypes.MALE]: GAME_MESSAGE_IDS.ANT_TYPE_MALE
};

export {
    antTypesLabelIds
}