const init = function() {
    const title = decodeURI(location.pathname.split('/')[2]);
    document.querySelector('head title').textContent = title;
};

init();