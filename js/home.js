import {
    url,
    anime,
    _
} from './service.js';

let query;
var beautifyQuery = function (rawStr) {
    rawStr = rawStr.toLowerCase();
    query = rawStr.replace(/[\s]/g, '-');
    const regex = /[:]/g;
    if (regex.test(query)) {
        query = query.replace(regex, '');

    }
    return query;
}

//search bar

document.querySelector(".getText").addEventListener("click", function () {
    var rawQuery = document.querySelector(".queryText").value;

    beautifyQuery(rawQuery);

    anime.get("GET", url + "?filter[slug]=" + query).then(function success(data) {


        console.log(data.data[0].attributes.canonicalTitle);

    }, function error(err) {
        console.log(err);

    })

});


//trending anime
anime.get("GET", "https://kitsu.io/api/edge/trending/anime").then(function success(anime) {
    let sortOrder = 'trending';
    let sortObj = {};
    var arr = [];;
    class renderTrendingAnime {
        constructor() {
            this.data = anime.data;
        }
        render() {

            if (sortOrder === 'asc' || sortOrder === 'dsc') {

                return `<div class="trending">
                ${this.sort().join('')}
                </div>`
            } else {

                return `<div class="trending">
                ${this.modify().join('')}
                </div>`
            }

        }

        modify() {

            this.name = this.data.forEach(function (item) {

                arr.push(item);

                sortObj[item.attributes.canonicalTitle] = item.attributes.averageRating;
            });
            return arr.map(function (val) {
                return `<h3>${val.attributes.canonicalTitle}</h3>`
            })


        }


        sort() {


            let sortedArray = [];
            sortedArray.push(Object.keys(sortObj).sort(function (a, b) {
                if (sortOrder === 'asc') {
                    return sortObj[a] - sortObj[b];
                } else {                                                    //descending
                    return sortObj[b] - sortObj[a];
                }
            }));


            return sortedArray[0].map(function (val) {
                return `<h3>${val}</h3>`
            })
        }

    }


    var trendingAnime = new renderTrendingAnime(anime);

    _("#comp").innerHTML = trendingAnime.render();

    document.addEventListener("click", function (e) {
       
        if (e.target.classList.contains('sortAsc')) {
            sortOrder = 'asc';
        } else if (e.target.classList.contains('sortDsc')) {
            sortOrder = 'dsc';
        }
        _("#comp").innerHTML = trendingAnime.render();

    });

}, function error() {});