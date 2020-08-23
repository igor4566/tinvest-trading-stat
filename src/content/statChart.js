import Chart from 'chart.js'
import Data from './data'
import moment from "moment"

export default class StatChart {
    constructor() {
    }

    async getStatChart(name) {
        const chart = document.createElement('div');

        chart.id = 'stat-chart'
        chart.setAttribute('class', 'src-containers-WidgetLayout-styles-rnd-3kI8E pt-card react-draggable react-draggable-dragged');
        chart.setAttribute('data-widget-type', 'STAT_WIDGET');
        chart.setAttribute('style', 'position: absolute; user-select: auto; touch-action: none; width: 1038px; height: 500px; display: inline-block; top: 0px; left: 0px; cursor: auto; z-index: 1; transform: translate(318px, 0px); max-width: 9.0072e+15px; max-height: 9.0072e+15px; min-width: 100px; min-height: 80px; box-sizing: border-box;');
        chart.innerHTML = '<div class="src-containers-WidgetLayout-styles-dragPanelWrapper-2EkSV"><div class="src-containers-WidgetLayout-styles-dragPanel-2YEn6"><div class="src-containers-WidgetLayout-styles-draggable-2VyiZ dragClass"><div class="src-containers-WidgetLayout-styles-text-16W1X">&nbsp;&nbsp;&nbsp;&nbsp;' + name + '</div></div><div class="src-containers-WidgetLayout-styles-icons-k4S9c static"><div class="src-containers-WidgetLayout-styles-iconBtn-1qzki"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.70711 3.29289C4.31658 2.90237 3.68342 2.90237 3.29289 3.29289C2.90237 3.68342 2.90237 4.31658 3.29289 4.70711L6.58579 8L3.29289 11.2929C2.90237 11.6834 2.90237 12.3166 3.29289 12.7071C3.68342 13.0976 4.31658 13.0976 4.70711 12.7071L8 9.41421L11.2929 12.7071C11.6834 13.0976 12.3166 13.0976 12.7071 12.7071C13.0976 12.3166 13.0976 11.6834 12.7071 11.2929L9.41421 8L12.7071 4.70711C13.0976 4.31658 13.0976 3.68342 12.7071 3.29289C12.3166 2.90237 11.6834 2.90237 11.2929 3.29289L8 6.58579L4.70711 3.29289Z" fill="currentColor"></path></svg></div></div></div></div><div class="src-containers-WidgetLayout-styles-widget-77iAy widget wrap-widget"><div class="src-modules-Chart-containers-styles-wrap-2dVt9"></div></div><span class="src-containers-WidgetLayout-styles-resize-3NmyN"><div style="position: absolute; user-select: none; width: 20px; height: 20px; right: -10px; bottom: -10px; cursor: se-resize;"></div></span>';

        this._addButtons(chart.getElementsByClassName('src-modules-Chart-containers-styles-wrap-2dVt9')[0]);
        this._addFilters(chart);

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
            delete window.chart;
        }
    }

    _addButtons(el) {
        const btns = [1, 2, 3, 6, 12];
        const wrapper = document.createElement('div');
        wrapper.className = 'src-modules-Chart-containers-components-SettingsPanel-styles-group-23mIT wrap-btns';
        wrapper.id = 'month-btn-wrapper'
        el.appendChild(wrapper);
        const $this = this;

        for (const item of btns) {
            const btn = document.createElement('button');
            btn.className = 'pt-button pt-minimal pt-small src-modules-Chart-containers-components-SettingsPanel-styles-optionsButton-3UGvF'
            btn.innerHTML = item + ' мес.';
            btn.setAttribute('data-month', item);

            if (item === 1) {
                btn.classList.add('pt-active');
            }

            btn.onclick = () => {
                const btns = wrapper.getElementsByClassName('pt-button');

                for (const el of btns) {
                    el.classList.remove('pt-active');
                }

                btn.classList.add('pt-active');

                $this._addChart(el, item).then().catch((e) => console.log(e));
            }

            wrapper.appendChild(btn);
        }
    }

    _addFilters(el) {
        const wrapper = document.createElement('div');
        wrapper.className = 'src-modules-Chart-containers-components-HeaderSettings-Settings-popover-20Ph1 sidebar-filter';

        const timeSector = document.createElement('div');
        timeSector.className = 'src-modules-Chart-containers-components-HeaderSettings-Settings-sector-1alCr';
        timeSector.innerHTML = '<div class="src-modules-Chart-containers-components-HeaderSettings-Settings-sectorTitle-2RjT3">Время торговли</div>' +
            '<div class="src-modules-Chart-containers-components-HeaderSettings-Settings-checkboxItem-2Tfvx">' +
            '<label class="pt-control pt-checkbox"><input id="morningTrade" type="checkbox" checked=""><span class="pt-control-indicator"></span>10:00-14:00' +
            '</div>' +
            '<div class="src-modules-Chart-containers-components-HeaderSettings-Settings-checkboxItem-2Tfvx">' +
            '<label class="pt-control pt-checkbox"><input id="eveningTrade" type="checkbox" checked=""><span class="pt-control-indicator"></span>14:00-19:00' +
            '</div>' +
            '<div class="src-modules-Chart-containers-components-HeaderSettings-Settings-checkboxItem-2Tfvx">' +
            '<label class="pt-control pt-checkbox"><input id="nightTrade" type="checkbox" checked=""><span class="pt-control-indicator"></span>19:00-02:00' +
            '</div>';
        wrapper.appendChild(timeSector);

        const commSector = document.createElement('div');
        commSector.className = 'src-modules-Chart-containers-components-HeaderSettings-Settings-sector-1alCr';
        commSector.innerHTML = '<div class="src-modules-Chart-containers-components-HeaderSettings-Settings-divider-37mua"></div>' +
            '<div class="src-modules-Chart-containers-components-HeaderSettings-Settings-checkboxItem-2Tfvx">' +
            '<label class="pt-control pt-checkbox"><input id="hideCommission" type="checkbox" checked=""><span class="pt-control-indicator"></span>Учитывать комиссию';
        wrapper.appendChild(commSector);

        const label = wrapper.querySelectorAll('input');
        const $this = this;

        label.forEach(item => {
            item.onchange = () => {
                const activeBtn = document.getElementById('month-btn-wrapper').getElementsByClassName('pt-active')[0];

                $this._addChart(el, activeBtn.getAttribute('data-month')).then().catch((e) => console.log(e));
            }
        });

        el.getElementsByClassName('wrap-widget')[0].appendChild(wrapper);
    }

    async _addChart(el, months) {
        const hideCommission = document.getElementById('hideCommission') !== null ? !document.getElementById('hideCommission').checked : false;
        const rubCommission = document.getElementById('rubCommission') !== null ? !document.getElementById('rubCommission').checked : true;
        const morningTrade = document.getElementById('morningTrade') !== null ? document.getElementById('morningTrade').checked : true;
        const eveningTrade = document.getElementById('eveningTrade') !== null ? document.getElementById('eveningTrade').checked : true;
        const nightTrade = document.getElementById('nightTrade') !== null ? document.getElementById('nightTrade').checked : true;

        let config = {
            hideCommission: hideCommission,
            morningTrade: morningTrade,
            eveningTrade: eveningTrade,
            nightTrade: nightTrade,
        }

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

        let sumOpRub = 0,
            sumOpUsd = 0,
            sumOpEur = 0,
            sumComRub = 0,
            sumComUsd = 0,
            sumComEur = 0;

        let sumUSD = 0;
        let sumEUR = 0;
        let sumRUB = 0;

        let items = await data.getOperations(months);
        const USDRUB = await data.getCurrency('USDRUB');
        const EURRUB = await data.getCurrency('EURRUB');
        let obj = {};
        let dObj = {};

        items.forEach((item) => {
            if (item.status === 'done' && (item.operationType === 'Buy' || item.operationType === 'Sell')) {
                switch (item.currency) {
                    case 'USD':
                        sumOpUsd += 1;
                        break;
                    case 'RUB':
                        sumOpRub += 1;
                        break;
                    case 'EUR':
                        sumOpEur += 1;
                        break;
                }
            }

            const hour = moment(item.date).hours();

            if (item.operationType === 'Buy') {
                item.price = -item.price;
            }

            if (
                (!config.morningTrade && (hour >= 10 && hour < 14)) ||
                (!config.eveningTrade && (hour >= 14 && hour < 19)) ||
                (!config.nightTrade && (hour <= 2 || hour >= 19))
            )
                item.status = 'false';

            return item;
        });

        items.forEach((item) => {
            if (item.ticker !== 'USDRUB' && item.status === 'done' && item.ticker && item.accountType === 'Tinkoff') {
                const date = moment(item.date).format('L');

                if (!obj[item.ticker]) {
                    obj[item.ticker] = {};
                }

                if (!obj[item.ticker][date]) {
                    obj[item.ticker][date] = {};
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

                if (item.operationType === 'BrokCom') {
                    switch (item.currency) {
                        case 'USD':
                            if (!config.hideCommission)
                                dObj[date].sumUSD += item.payment;

                            sumComUsd -= item.payment;
                            break;
                        case 'RUB':
                            if (!config.hideCommission)
                                dObj[date].sumRUB += item.payment;

                            sumComRub -= item.payment;
                            break;
                        case 'EUR':
                            if (!config.hideCommission)
                                dObj[date].sumEUR += item.payment;

                            sumComEur -= item.payment;
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
                                let sum;

                                if (item.quantity - oldItem.quantity >= 0) {
                                    sum = oldItem.quantity * (oldItem.price + item.price);

                                    item.quantity -= oldItem.quantity;
                                    oldItem.quantity -= oldItem.quantity;
                                } else {
                                    sum = item.quantity * (oldItem.price + item.price);

                                    oldItem.quantity -= item.quantity;
                                    item.quantity -= item.quantity;
                                }

                                switch (oldItem.currency) {
                                    case 'USD':
                                        dObj[date].sumUSD += sum;
                                        sumUSD += sum;
                                        break;
                                    case 'RUB':
                                        dObj[date].sumRUB += sum;
                                        sumRUB += sum;
                                        break;
                                    case 'EUR':
                                        dObj[date].sumEUR += sum;
                                        sumEUR += sum;
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
                    backgroundColor: 'hsl(36, 100%, 65%)',
                    hoverBackgroundColor: 'hsl(36, 95%, 65%)',
                    data: []
                },
                'EUR': {
                    label: 'EUR',
                    backgroundColor: 'hsl(198, 91%, 64%)',
                    hoverBackgroundColor: 'hsl(198, 86%, 64%)',
                    data: []
                },
                'RUB': {
                    label: 'RUB',
                    backgroundColor: 'hsl(254, 69%, 66%)',
                    hoverBackgroundColor: 'hsl(254, 64%, 66%)',
                    data: []
                }
            };

        for (const key in dObj) {
            const date = moment(key, 'L').format('DD.MM.YY');

            labels = [...labels, date];

            dObj[key].sumUSD = Math.round(dObj[key].sumUSD * 100) / 100
            dObj[key].sumEUR = Math.round(dObj[key].sumEUR * 100) / 100
            dObj[key].sumRUB = Math.round(dObj[key].sumRUB * 100) / 100

            debs.USD.data.push(dObj[key].sumUSD);
            debs.EUR.data.push(dObj[key].sumEUR);
            debs.RUB.data.push(dObj[key].sumRUB);
        }

        if (sumEUR === 0) {
            delete debs.EUR;
        }
        if (sumRUB === 0) {
            delete debs.USD;
        }
        if (sumRUB === 0) {
            delete debs.RUB;
        }

        this._setChart(canvas, 'Доходы по дням за ' + months + ' мес. (руб.)', 'bar', Object.values(debs), labels);

        this._addStatTable(el, {
            sumOpRub,
            sumOpUsd,
            sumOpEur,
            sumComRub,
            sumComUsd,
            sumComEur,
            sumUSD,
            sumEUR,
            sumRUB,
            USDRUB,
            EURRUB
        });
    }

    _addStatTable(el, obj) {
        let wrapper = el.getElementsByClassName('src-modules-Portfolio-containers-styles-wrapper-1zTYg');

        if (wrapper.length === 0) {
            wrapper = document.createElement('div');
            el.appendChild(wrapper);
        } else {
            wrapper = wrapper[0];
        }

        wrapper.className = 'src-modules-Portfolio-containers-styles-wrapper-1zTYg';

        const usdGroup = '<tr>' +
            '<td><div class="src-modules-Portfolio-containers-styles-flex-3UgL-"><div class="src-modules-Portfolio-containers-styles-logo-1KhYi" style="background: hsl(36, 100%, 65%)"></div><div>USD</div></div></td>' +
            '<td>' + obj.sumOpUsd + '</td>' +
            '<td>' + obj.sumUSD.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' $ (~ '+(obj.sumUSD * obj.USDRUB).toLocaleString('ru-RU', {maximumFractionDigits: 2})+' ₽)</td>' +
            '<td>' + obj.sumComUsd.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' $ (~ '+(obj.sumComUsd * obj.USDRUB).toLocaleString('ru-RU', {maximumFractionDigits: 2})+' ₽)</td>' +
            '<td>' + (obj.sumUSD - obj.sumComUsd).toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' $ (~ '+((obj.sumUSD - obj.sumComUsd) * obj.USDRUB).toLocaleString('ru-RU', {maximumFractionDigits: 2})+' ₽)</td>' +
            '</tr>';

        const rubGroup = '<tr>' +
            '<td><div class="src-modules-Portfolio-containers-styles-flex-3UgL-"><div class="src-modules-Portfolio-containers-styles-logo-1KhYi" style="background: hsl(254, 69%, 66%)"></div><div>RUB</div></div></td>' +
            '<td>' + obj.sumOpRub + '</td>' +
            '<td>' + obj.sumRUB.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽</td>' +
            '<td>' + obj.sumComRub.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽</td>' +
            '<td>' + (obj.sumRUB - obj.sumComRub).toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽</td>' +
            '</tr>';

        const eurGroup = '<tr>' +
            '<td><div class="src-modules-Portfolio-containers-styles-flex-3UgL-"><div class="src-modules-Portfolio-containers-styles-logo-1KhYi" style="background: hsl(198, 91%, 64%)"></div><div>EUR</div></div></td>' +
            '<td>' + obj.sumOpEur + '</td>' +
            '<td>' + obj.sumEUR.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' € (~ '+(obj.sumEUR * obj.EURRUB).toLocaleString('ru-RU', {maximumFractionDigits: 2})+' ₽)</td>' +
            '<td>' + obj.sumComEur.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' € (~ '+(obj.sumComEur * obj.EURRUB).toLocaleString('ru-RU', {maximumFractionDigits: 2})+' ₽)</td>' +
            '<td>' + (obj.sumEUR - obj.sumComEur).toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' € (~ '+((obj.sumEUR - obj.sumComEur) * obj.EURRUB).toLocaleString('ru-RU', {maximumFractionDigits: 2})+' ₽)</td>' +
            '</tr>';

        let sumOp = obj.sumOpRub + obj.sumOpEur + obj.sumOpUsd;
        let sumCom = obj.sumComRub + (obj.sumComUsd * obj.USDRUB) + (obj.sumComEur * obj.EURRUB);
        let sum = obj.sumRUB + (obj.sumUSD * obj.USDRUB) + (obj.sumEUR * obj.EURRUB);

        wrapper.innerHTML = '<div style="margin-top: 30px; display: flex; position: relative; overflow: hidden; width: 100%; height: 100%;"><div style="position: absolute; top: 0px; left: 0px; right: 0px; bottom: 0px; overflow: scroll; margin-right: -15px; margin-bottom: -15px; transform: translate3d(0px, 0px, 0px);">' +
            '<table class="table tableSortable"><thead><tr>' +
            '<th><div class="th"><div>Валюта</div></div></th>' +
            '<th><div class="th">Сделки</div></th>' +
            '<th><div class="th">Доход</div></th>' +
            '<th><div class="th">Комиссия</div></th><th>' +
            '<div class="th">Прибыль</div></th>' +
            '</tr></thead><tbody>' +
            '<tr class="group">' +
            '<td><div class="src-components-Table-styles-title-F30AN">Общая сумма</div></td>' +
            '<td>' + sumOp + '</td>' +
            '<td>~ ' + sum.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽</td>' +
            '<td>~ ' + sumCom.toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽</td>' +
            '<td>~ ' + (sum - sumCom).toLocaleString('ru-RU', {maximumFractionDigits: 2}) + ' ₽</td>' +
            '</tr>' +
            (obj.sumOpUsd > 0 ? usdGroup : '') +
            (obj.sumOpEur > 0 ? eurGroup : '') +
            (obj.sumOpRub > 0 ? rubGroup : '') +
            '</tbody></table></div><div style="position: absolute; height: 6px; transition: opacity 200ms ease 0s; opacity: 0; right: 2px; bottom: 2px; left: 2px; border-radius: 3px; visibility: hidden;"><div style="position: relative; display: block; height: 100%; background-color: rgba(255, 255, 255, 0.2); cursor: pointer; border-radius: inherit; z-index: 1000; right: 1px; bottom: 1px; width: 0px;"></div></div><div style="position: absolute; width: 6px; transition: opacity 200ms ease 0s; opacity: 0; right: 2px; bottom: 2px; top: 2px; border-radius: 3px; visibility: hidden;"><div style="position: relative; display: block; width: 100%; background-color: rgba(255, 255, 255, 0.2); cursor: pointer; border-radius: inherit; z-index: 1000; right: 1px; bottom: 1px; height: 0px;"></div></div></div>';
    }

    _setChart(canvas, name, type, data, labels) {
        const customTooltips = function (tooltip) {
            // Tooltip Element
            let tooltipEl = document.getElementById('chartjs-tooltip');

            if (!tooltipEl) {
                tooltipEl = document.createElement('div');
                tooltipEl.id = 'chartjs-tooltip';
                tooltipEl.innerHTML = '<div class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-wrapperFloat-2atwL"></div>';
                this._chart.canvas.parentNode.appendChild(tooltipEl);
            }

            // Hide if no tooltip
            if (tooltip.opacity === 0) {
                tooltipEl.style.opacity = 0;
                return;
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform');
            if (tooltip.yAlign) {
                tooltipEl.classList.add(tooltip.yAlign);
            } else {
                tooltipEl.classList.add('no-transform');
            }

            function getBody(bodyItem) {
                return bodyItem.lines;
            }

            // Set Text
            if (tooltip.body) {
                let titleLines = tooltip.title || [];
                let bodyLines = tooltip.body.map(getBody);

                let innerHtml = '<div class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-header-1lfq5">'

                titleLines.forEach(function (title) {
                    innerHtml += moment(title, 'DD.MM.YY').locale('ru').format('DD MMMM YYYY');
                });
                innerHtml += '</div><div class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-content-2S2s2">';
                bodyLines.forEach(function (body, i) {
                    let colors = tooltip.labelColors[i];
                    let style = 'color:' + colors.backgroundColor;
                    let type = body[0].substr(0, 3);
                    let num = parseFloat(body[0].substr(5));
                    let currency = '$';

                    if (type === 'RUB')
                        currency = '₽'
                    if (type === 'EUR')
                        currency = '€'

                    innerHtml += '<div class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-item-1EsOY">\n' +
                        '                <div class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-name-lJaF6" style="' + style + '">' + type + '</div>\n' +
                        '                <div class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-value-3zcWM">\n' +
                        '                    <span class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-number-RHJFH" style="' + style + '">\n' +
                        num.toLocaleString('ru-RU', {maximumFractionDigits: 2, minimumFractionDigits: 2}) +
                        '                    </span>\n' +
                        '                    <span class="src-modules-Chart-containers-components-ModernChart-options-helpers-styles-formatter-currency-BINsw">' + currency + '</span>\n' +
                        '                </div>\n' +
                        '            </div>'
                });
                innerHtml += '</div>';

                let tableRoot = tooltipEl.querySelector('div');
                tableRoot.innerHTML = innerHtml;
            }

            let positionY = this._chart.canvas.offsetTop;
            let positionX = this._chart.canvas.offsetLeft;

            tooltipEl.style.opacity = 1;
            tooltipEl.style.display = 'block';
            tooltipEl.style.left = positionX + tooltip.x + 10 + 'px';
            tooltipEl.style.top = positionY + 20 + 'px';
            tooltipEl.style.fontFamily = tooltip._bodyFontFamily;
            tooltipEl.style.fontSize = tooltip.bodyFontSize + 'px';
            tooltipEl.style.fontStyle = tooltip._bodyFontStyle;
            tooltipEl.style.padding = tooltip.yPadding + 'px ' + tooltip.xPadding + 'px';
        };

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
                    display: true,
                    position: 'top',
                    align: 'end',
                    labels: {
                        fontColor: '#8a9ba8',
                        boxWidth: 10,
                        usePointStyle: true
                    }
                },
                responsive: false,
                title: {
                    display: false,
                    text: name
                },
                tooltips: {
                    enabled: false,
                    mode: 'index',
                    intersect: false,
                    position: 'nearest',
                    custom: customTooltips
                },
                scales: {
                    xAxes: [{
                        stacked: true,
                        display: true,
                        scaleLabel: {
                            display: false,
                        },
                        gridLines: {
                            color: '#34414C',
                            zeroLineColor: '#34414C'
                        },
                        ticks: {
                            fontColor: '#8a9ba8',
                        }
                    }],
                    yAxes: [{
                        stacked: true,
                        display: true,
                        position: 'right',
                        scaleLabel: {
                            display: false,
                        },
                        gridLines: {
                            color: '#34414C'
                        },
                        ticks: {
                            fontColor: '#8a9ba8',
                        }
                    }]
                }
            }
        });
    }
}