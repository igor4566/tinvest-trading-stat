import axios from 'axios'
import {getCookie} from "../helpers/cookie"
import moment from "moment"

export default class Data {
    constructor() {
        this.host = 'https://api-invest.tinkoff.ru';
    }

    async getOperations(months) {
        const to = moment().format();
        const from = moment().subtract(months, 'months').format();
        const sessionId = getCookie('psid');

        let res = await axios.post(
            this.host + '/trading/user/operations',
            {
                accountType: 'Tinkoff',
                from: from,
                to: to,
                overnightsDisabled: true
            },
            {
                params: {
                    appName: 'invest_terminal',
                    appVersion: '2.0.0',
                    sessionId: sessionId
                }
            }
        ).catch((e) => {
            console.log(e);
        });

        if (res.data.status === 'Ok') {
            const items = res.data.payload.items;
            return items;
        }
    }
}