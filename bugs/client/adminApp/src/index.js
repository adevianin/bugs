import { WorldStatusView } from "./worldStatusView";
import { Requester } from "@common/utils/requester";

let requester = new Requester();
new WorldStatusView(requester, document.querySelector('[data-world-status]'))