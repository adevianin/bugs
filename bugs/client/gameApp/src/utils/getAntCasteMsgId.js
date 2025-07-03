import { AntTypes } from "@domain/enum/antTypes";
import { GAME_MESSAGE_IDS } from "@messages/messageIds";

function getAntCasteMsgId(antType, isQueenOfColony = false) {
    if (isQueenOfColony) {
        return GAME_MESSAGE_IDS.ANT_TYPE_QUEEN;
    } else {
        switch (antType) {
            case AntTypes.QUEEN:
                return GAME_MESSAGE_IDS.ANT_TYPE_FEMALE;
            case AntTypes.MALE:
                return GAME_MESSAGE_IDS.ANT_TYPE_MALE;
            case AntTypes.WARRIOR:
                return GAME_MESSAGE_IDS.ANT_TYPE_WARRIOR;
            case AntTypes.WORKER:
                return GAME_MESSAGE_IDS.ANT_TYPE_WORKER;
        }
    }
}

export {
    getAntCasteMsgId
}