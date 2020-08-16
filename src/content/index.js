import Menu from './menu'

(function () {
    const menu = new Menu('pt-menu');
    menu.appendDivider();
    menu.appendChild('Статистика сделок');
    menu.startObserver();
})();

