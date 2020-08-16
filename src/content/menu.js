import StatChart from "./statChart";

export default class Menu {
    constructor(menuClassName) {
        this.className = menuClassName;
        window.menuChilds = [];
    }

    appendChild(title) {
        const div = document.createElement('div');
        div.classList.add('pt-popover-dismiss', 'src-components-Menu-styles-item-H03fq');
        div.innerHTML = '<div class="src-components-Menu-styles-text-MezDi"><div class="src-components-Menu-styles-textInner-1y92e">'+title+'</div></div>'
        div.onclick = () => {
            const statChart = new StatChart();
            const space = document.getElementById('SpaceVisibleArea');
            statChart.getStatChart(title).then((el) => {
                space.appendChild(el);
            });
        }

        window.menuChilds = [...window.menuChilds, div];
    }

    appendDivider() {
        const divider = document.createElement('div');
        divider.id = 'stat-divider';
        divider.className = 'src-components-Menu-styles-divider-3m_jp';

        window.menuChilds = [...window.menuChilds, divider];
    }

    startObserver() {
        const className = this.className;

        const menuObserver = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const menuEl = document.getElementsByClassName(className);

                if (menuEl.length > 0) {
                    for (const child of window.menuChilds) {
                        if (!menuEl[0].contains(child)) {
                            menuEl[0].appendChild(child);
                        }
                    }
                }
            }
        });

        menuObserver.observe(document.body, {
            childList: true,
        });

        const portalObserver = new MutationObserver((mutationList) => {
            for (const mutation of mutationList) {
                const portals = document.getElementsByClassName('pt-overlay');

                if (portals.length > 0 && document.body.classList.length === 0) {
                    menuObserver.observe(portals[0], {
                        childList: true,
                    });
                    portalObserver.disconnect();
                }
            }
        });

        portalObserver.observe(document.body, {
            childList: true,
        });
    }
}