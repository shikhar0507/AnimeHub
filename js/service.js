const url = "https://kitsu.io/api/edge/anime";

var anime = (function () { //XHR   

    return {
        get: function (methodType, url) {
            var promise = new Promise(function (resolve, reject) {

                var xhr = new XMLHttpRequest();

                xhr.open(methodType, url, true);
                xhr.send(null);

                xhr.onreadystatechange = function () {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.responseText));
                        } else {
                            reject(xhr.status);
                        }
                    } else {
                        console.log("process continuing"); //if readyState != 4
                    }
                };

            });
            return promise;

        }
    }

})();



function _(idName) { //shorthand for getting elements

    return document.querySelector(idName);

}

function makeEl(type, text, prop, child) {
    let el = document.createElement(type);
    let textContent = document.createTextNode(text);
    el.appendChild(textContent);

    if (!child) {
        return el;

    } else {
        let children = document.createElement(child);
        el.appendChild(children);
    }
    Object.keys(prop).forEach(function (pr) {
        el[pr] = prop[pr]


    })
    return el;
}


export {anime,_,makeEl};


