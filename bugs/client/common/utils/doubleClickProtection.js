import { debounce } from "lodash";
import { UI_CONSTS } from "@common/view/ui_consts";

function doubleClickProtection(func) {
    return debounce(func, UI_CONSTS.DOUBLE_CLICK_PROTECT_MS, {
        leading: true,
        trailing: false
    });
}

export {
    doubleClickProtection
}