const init = function() {
    const title = decodeURI(location.pathname.split('/')[2].slice(0,-5));
    document.querySelector('head title').textContent = title;
};

init();