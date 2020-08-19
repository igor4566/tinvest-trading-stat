import StatChart from "./statChart";

export default class Menu {
    constructor(menuClassName) {
        this.className = menuClassName;
        window.menuChilds = [];
    }

    appendChild(title) {
        const div = document.createElement('div');
        div.classList.add('pt-popover-dismiss', 'src-components-Menu-styles-item-H03fq');
        div.innerHTML = '<svg width="14" height="11" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 11"><defs><style>.a{fill:#738594;}</style></defs><path class="a" d="M1.3,9.8.1,5.9A.9.9,0,0,1,0,5.4a.7.7,0,0,1,.8-.7.9.9,0,0,1,.9.6l1,3.8h.2l2.4-8A1.5,1.5,0,0,1,6.9,0h6.3a.7.7,0,0,1,.8.8.7.7,0,0,1-.8.8H7L4.3,9.8A1.5,1.5,0,0,1,2.8,11C2,11,1.6,10.5,1.3,9.8Zm6.2-.5c0-.2.1-.3.2-.5l1.5-2L7.8,4.9a.6.6,0,0,1-.2-.5c0-.4.3-.6.7-.6a.7.7,0,0,1,.6.4l1.2,1.7h.1l1.1-1.7a.8.8,0,0,1,.7-.4c.4,0,.7.2.7.6a.8.8,0,0,1-.2.4L11,6.8l1.5,2a.9.9,0,0,1,.1.5.6.6,0,0,1-.6.6.8.8,0,0,1-.7-.4L10.1,7.7h0L8.9,9.5c-.3.3-.4.4-.7.4A.7.7,0,0,1,7.5,9.3Z"/></svg><div class="src-components-Menu-styles-text-MezDi"><div class="src-components-Menu-styles-textInner-1y92e">'+title+'</div></div>'
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