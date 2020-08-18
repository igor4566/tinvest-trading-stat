import Chart from 'chart.js'
import Data from './data'
import moment from "moment"

export default class StatChart {
    constructor() {
        this.BAR_TYPE = 1;
        this.LINE_TYPE = 2;
    }

    async getStatChart(name) {
        const chart = document.createElement('div');

        chart.setAttribute('class', 'src-containers-WidgetLayout-styles-rnd-3kI8E pt-card react-draggable react-draggable-dragged');
        chart.setAttribute('data-widget-type', 'STAT_WIDGET');
        chart.setAttribute('style', 'position: absolute; user-select: auto; touch-action: none; width: 820px; height: 450px; display: inline-block; top: 0px; left: 0px; cursor: auto; z-index: 1; transform: translate(318px, 0px); max-width: 9.0072e+15px; max-height: 9.0072e+15px; min-width: 100px; min-height: 80px; box-sizing: border-box;');
        chart.innerHTML = '<div class="src-containers-WidgetLayout-styles-dragPanelWrapper-2EkSV"><div class="src-containers-WidgetLayout-styles-dragPanel-2YEn6"><div class="src-containers-WidgetLayout-styles-draggable-2VyiZ dragClass"><div class="src-containers-WidgetLayout-styles-text-16W1X">&nbsp;' + name + '</div></div><div class="src-containers-WidgetLayout-styles-icons-k4S9c static"><div class="src-containers-WidgetLayout-styles-iconBtn-1qzki"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L6.58579 8L3.29289 11.2929C2.90237 11.6834 2.90237 12.3166 3.29289 12.7071C3.68342 13.0976 4.31658 13.0976 4.70711 12.7071L8 9.41421L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L9.41421 8L12.7071 4.70711C13.0976 4.31658 13.0976 3.68342 12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L8 6.58579L4.70711 3.29289Z" fill="currentColor"></path></svg></div></div></div></div><div class="src-containers-WidgetLayout-styles-widget-77iAy widget"><div class="src-modules-Chart-containers-styles-wrap-2dVt9"></div></div><span class="src-containers-WidgetLayout-styles-resize-3NmyN"><div style="position: absolute; user-select: none; width: 20px; height: 20px; right: -10px; bottom: -10px; cursor: se-resize;"></div></span>';

        this._addButtons(chart.getElementsByClassName('src-modules-Chart-containers-styles-wrap-2dVt9')[0]);

        this._addDrag(chart);
        this._addCloseEvent(chart);
        await this._addChart(chart.getElementsByClassName('src-modules-Chart-containers-styles-wrap-2dVt9')[0], 1);

        return chart;
    }

    _addDrag(chart) {
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        const dragEl = chart.getElementsByClassName('dragClass')[0];

        const chartMoveEvent = (e) => {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            chart.style.transform = 'translate(' + currentX + 'px, ' + currentY + 'px)';
        }

        dragEl.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;

            document.getElementById('SpaceVisibleArea').addEventListener('mousemove', chartMoveEvent, false);
        }, false);

        document.getElementById('SpaceVisibleArea').addEventListener('mouseup', () => {
            initialX = currentX;
            initialY = currentY;

            document.getElementById('SpaceVisibleArea').removeEventListener('mousemove', chartMoveEvent, false);
        });
    }

    _addCloseEvent(chart) {
        const closeEl = chart.getElementsByClassName('static')[0];

        closeEl.onclick = () => {
            chart.remove();
        }
    }

    _addButtons(el) {
        const btns = [1, 2, 3, 6, 12];
        const wrapper = document.createElement('div');
        wrapper.className = 'stat-btn-wrapper';
        el.appendChild(wrapper);
        const $this = this;

        for (const item of btns) {
            const btn = document.createElement('button');
            btn.className = 'stat-btn'
            btn.innerHTML = item + ' мес.';

            btn.onclick = async () => {
                await $this._addChart(el, item);
            }

            wrapper.appendChild(btn);
        }
    }

    async _addChart(el, months) {
        let canvas = el.getElementsByTagName('canvas');

        if (canvas.length === 0) {
            canvas = document.createElement('canvas');
            el.style.overflowX = 'auto';
            el.appendChild(canvas);
        } else {
            canvas = canvas[0];
        }

        canvas.width = 790;
        canvas.height = 300;

        const data = new Data();

        let sumCom = 0,
            sumOperations = 0;

        let items = await data.getOperations(months);

        let obj = {};
        let dObj = {};
        items.reverse();

        items.forEach((item) => {
            if (item.ticker !== 'USDRUB' && item.status === 'done' && item.ticker) {
                const date = moment(item.date).format('L');

                if (!obj[item.ticker]) {
                    obj[item.ticker] = {};
                }

                if (!obj[item.ticker][date]) {
                    obj[item.ticker][date] = {};
                }

                if (item.operationType === 'Buy') {
                    item.price = -item.price;
                }

                if (!dObj[date]) {
                    dObj[date] = {
                        sumRUB: 0,
                        sumUSD: 0,
                        sumEUR: 0,
                        sumCom: 0,
                        tickers: {}
                    }
                }

                if (item.operationType !== 'BrokCom') {
                    sumOperations += 1;
                }

                if (item.operationType === 'BrokCom') {
                    switch (item.currency) {
                        case 'USD':
                            dObj[date].sumUSD += item.payment;
                            break;
                        case 'RUB':
                            dObj[date].sumRUB += item.payment;
                            break;
                        case 'EUR':
                            dObj[date].sumEUR += item.payment;
                            break;
                    }
                }

                if (['Buy', 'Sell'].includes(item.operationType)) {
                    if (!dObj[date].tickers[item.ticker]) {
                        dObj[date].tickers[item.ticker] = {
                            Buy: [],
                            Sell: []
                        }
                    }
                    dObj[date].tickers[item.ticker][item.operationType].push(item);
                    dObj[date].sumCom -= item.commissionRub ? item.commissionRub : 0;
                    item.commissionRub = 0;

                    if (item.quantity > 0) {
                        const unixDate = moment(item.date).unix();
                        obj[item.ticker][date][item.operationType] = obj[item.ticker][date][item.operationType] ? [...obj[item.ticker][date][item.operationType], item] : [item];
                        const opposite = item.operationType === 'Buy' ? 'Sell' : 'Buy';

                        items.forEach((oldItem) => {
                            if (oldItem.ticker === item.ticker && oldItem.operationType === opposite && unixDate > moment(oldItem.date).unix() && item.quantity > 0 && oldItem.quantity > 0) {
                                dObj[date].sumCom -= oldItem.commissionRub;
                                oldItem.commissionRub = 0;

                                let sum;

                                if (item.quantity - oldItem.quantity >= 0) {
                                    sum = oldItem.quantity * (oldItem.price + item.price);

                                    item.quantity -= oldItem.quantity;
                                    oldItem.quantity -= oldItem.quantity;
                                } else {
                                    sum = item.quantity * (oldItem.price + item.price);
                                    item.quantity -= item.quantity;
                                    oldItem.quantity -= item.quantity;
                                }

                                switch (oldItem.currency) {
                                    case 'USD':
                                        dObj[date].sumUSD += sum;
                                        break;
                                    case 'RUB':
                                        dObj[date].sumRUB += sum;
                                        break;
                                    case 'EUR':
                                        dObj[date].sumEUR += sum;
                                        break;
                                }
                            }

                            return oldItem
                        })
                    }
                }
            }

            return item;
        });

        dObj = Object.keys(dObj).sort().reduce((r, k) => (r[k] = dObj[k], r), {});

        let labels = [],
            debs = {
                'USD': {
                    label: 'USD',
                    backgroundColor: '#174e18',
                    data: []
                },
                'EUR': {
                    label: 'EUR',
                    backgroundColor: '#184d67',
                    data: []
                },
                'RUB': {
                    label: 'RUB',
                    backgroundColor: '#6e234d',
                    data: []
                }
            };

        let sumUSD = 0;
        let sumEUR = 0;
        let sumRUB = 0;

        for (const key in dObj) {
            const date = moment(key, 'L').format('DD.MM.YYYY');

            labels = [...labels, date];

            dObj[key].sumUSD = Math.round(dObj[key].sumUSD * 100) / 100
            dObj[key].sumEUR = Math.round(dObj[key].sumEUR * 100) / 100
            dObj[key].sumRUB = Math.round(dObj[key].sumRUB * 100) / 100

            debs.USD.data.push(dObj[key].sumUSD);
            debs.EUR.data.push(dObj[key].sumEUR);
            debs.RUB.data.push(dObj[key].sumRUB);

            sumUSD += dObj[key].sumUSD;
            sumEUR += dObj[key].sumEUR;
            sumRUB += dObj[key].sumRUB;
            sumCom += dObj[key].sumCom;
        }

        this._setChart(canvas, 'Доходы по дням за '+months+' мес. (руб.)', 'bar', Object.values(debs), labels);

        let wrapper = el.getElementsByClassName('stat-wrap');

        if (wrapper.length === 0) {
            wrapper = document.createElement('div');
            el.appendChild(wrapper);
        } else {
            wrapper = wrapper[0];
        }

        wrapper.className = 'stat-wrap';

        wrapper.innerHTML = '';
        wrapper.innerHTML += '<div class="stat-wrap_items">Доход за период: <span><b>' + sumUSD.toFixed(2) + ' $ / '+sumRUB.toFixed(2)+' ₽ / '+sumEUR.toFixed(2)+' €</b></span></div>';
        wrapper.innerHTML += '<div class="stat-wrap_items">Выплачено комиссии: <span><b>' + sumCom.toFixed(2) + ' ₽</b></span></div>';
        wrapper.innerHTML += '<div class="stat-wrap_items">Кол-во сделок: <span><b>' + sumOperations + '</b></span></div>';
    }

    _setChart(canvas, name, type, data, labels) {
        if (window.chart) {
            window.chart.type = type;
            window.chart.data.labels = labels;
            window.chart.data.datasets = data;
            window.chart.options.title.text = name;
            window.chart.update();
            return;
        }

        window.chart = new Chart(canvas.getContext('2d'), {
            responsive: true,
            type: type,
            data: {
                labels: labels,
                datasets: data
            },
            options: {
                legend: {
                    display: true
                },
                responsive: false,
                title: {
                    display: true,
                    text: name
                },
                tooltips: {
                    enabled: true,
                    mode: 'index',
                    inspect: true
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        display: true,
                        scaleLabel: {
                            display: false,
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        display: true,
                        position: 'right',
                        scaleLabel: {
                            display: false,
                        }
                    }]
                }
            }
        });
    }
}