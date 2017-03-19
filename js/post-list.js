const compareFn = function(prop) {
    return function(obj1, obj2) {
        return new Date(obj2[prop]) - new Date(obj1[prop]);
    }
};

const render = function() {

    var ajax = new XMLHttpRequest();
    ajax.onload = function() {
        if (ajax.status == 200) {
            var response = JSON.parse(ajax.responseText).sort(compareFn('modTime'));
            console.log(new Date(response[0].modTime));
            renderList(response);

        }
    };
    ajax.open('GET', '../post-data.json', true);
    ajax.send(null);


};


const renderList = function(objArr) {
    const nav = document.querySelector('.nav');
    let listEl = '';
    for (let i = 0; i < objArr.length; i++) {
        const liEl = '<li><a class="row" href="' + objArr[i].url + '"> <span class="col-sm-9 col-xs-9">' + objArr[i].title + '</span><span class="col-sm-3 col-xs-3 update-data">' + objArr[i].modTime.split(' ')[0] + '</span></a></li>';
        listEl += liEl;
    }
    nav.innerHTML = listEl;
};

const init = function() {
    render();
};

init();