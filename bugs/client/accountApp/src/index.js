import './styles.css';
import { AccountAppView } from "./accountAppView";
import { AccountApi } from './accountApi';
import { Requester } from '@common/utils/requester';

let requester = new Requester();
let accountApi = new AccountApi(requester);
new AccountAppView(document.body, accountApi);