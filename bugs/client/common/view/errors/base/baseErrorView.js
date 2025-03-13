import { BaseHTMLView } from "@common/view/base/baseHTMLView";

class BaseErrorView extends BaseHTMLView {

    setErr(err) {
        throw 'not realized';
    }
}

export {
    BaseErrorView
}