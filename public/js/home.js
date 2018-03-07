import * as service from './service.js';


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

    service.anime.get("GET", url + "?filter[slug]=" + query, true).then(function success(data) {


        console.log(data.data[0].attributes);

    }, function error(err) {
        console.log(err);

    })

});


//trending anime
var trendingAnime;
var isSort = false;
let sortOrder;

var callAnimeType = function (animeDataType, whereToInsert, containerClass) {


    service.anime.get("GET", animeDataType).then(function success(anime) {

sortOrder = 'trending';
        let sortObj = {};
        var arr = [];
        var limitData =[];
        class renderTrendingAnime {
            constructor() {
                
                for(var i=0;i<5;i++) {
                limitData.push(anime.data[i]);
                }
                

                
            }
            render(containerClass) {

                if (sortOrder === 'asc' || sortOrder === 'dsc') {

                    return `<div class="${containerClass}">
                
                
                       ${this.sort(containerClass).join('')}
                </div>`
                } else {

                    return `<div class="${containerClass}">
                ${this.modify().join('')}
                </div>`
                }

            }

            modify() {

                limitData.forEach(function (item) {

                    arr.push(item);

                    sortObj[item.attributes.slug] = item.attributes.averageRating; // for sorting into ascending or descending       
                });
                return arr.map(function (val) {

                    //shorten synopsis

                    let synopsis = function synopsis() {
                        let synopsis = val.attributes.synopsis;
                        let tempArr = [];
                        for (var i = 0; i < synopsis.length; i++) {
                            if (synopsis[i] === '.') tempArr.push(i + 1);
                        }

                        return synopsis.substr(0, tempArr[1]);

                    }


                    return trendingAnime.component(val, synopsis, containerClass);
                })
            }

            sort(containerClass) {


                let sortedArray = [];
                sortedArray.push(Object.keys(sortObj).sort(function (a, b) {
                    if (sortOrder === 'asc') {
                        return sortObj[a] - sortObj[b];
                    } else { //descending
                        return sortObj[b] - sortObj[a];
                    }
                }));


                return sortedArray[0].map(function (animeTitle) {
                    sortedTrendingAnimeCall(animeTitle,containerClass)
                });
            }


            component(val, synopsis, containerClass) {

                getCategory(val, containerClass);

                return `<div class='anime-cont' id=${val.attributes.slug}>
                <div class='animeImg'>
                <img src='${val.attributes.posterImage.small}' class='poster'>
                <div class='overlay'>
                <div class='categories'>
                ${getCategory(val)}
                </div>
                </div>
                </div>
                <div class='animeInfo'>
                <div class='animeTitle'>
                ${val.attributes.canonicalTitle}
                </div>
                <div class='animeSynopsis'>
                </div>
                </div>
                </div>`

            }
        }


        trendingAnime = new renderTrendingAnime(anime);
        service._(whereToInsert).innerHTML = trendingAnime.render();

        
    }, function error() {});
}

service._(".sortTrendAsc").addEventListener("click", function (e) {

    sortOrder = 'asc';
    callAnimeType("https://kitsu.io/api/edge/trending/anime?limit=5","#trending",'trending')
        service._("#trending").innerHTML = trendingAnime.render('trending');

    }); 
    service._(".sortTrendDsc").addEventListener("click", function (e) {
        sortOrder = 'dsc';
        service._("#trending").innerHTML = trendingAnime.render('trending');
    });


    
    // service._(".sortPopularAsc").addEventListener("click", function (e) {
        
    //     sortOrder = 'asc';
    //     callAnimeType("https://kitsu.io/api/edge/anime?sort=popularityRank","#popular","popular")

    //         service._("#popular").innerHTML = trendingAnime.render('popular');
    
    //     }); 
    //     service._(".sortPopularDsc").addEventListener("click", function (e) {
    //         sortOrder = 'dsc';

    //         service._("#popular").innerHTML = trendingAnime.render('popular');
    //     });
    


    



function sortedTrendingAnimeCall(animeTitle,containerClass) {
    console.log(animeTitle)
    var xyz = [];
    service.anime.get("GET", "https://kitsu.io/api/edge/anime?filter[slug]=" + animeTitle).then(function success(sortedData) {

        xyz.push(sortedData.data[0]);

    }, function err() {});
    setTimeout(function () {
        component(xyz,containerClass)
    }, 1000);
}

function component(xyz,containerClass) {
   
    service._("."+containerClass).innerHTML += `<div class='anime-cont' id=${xyz[0].attributes.slug}>
    <div class='animeImg'>
    <img src='${xyz[0].attributes.posterImage.small}' class='poster'>
    <div class='overlay'>
    <div class='categories'>
    ${getCategory(xyz[0].attributes.slug,containerClass)}
    </div>
    </div>
    </div>
    <div class='animeInfo'>
    <div class='animeTitle'>
    ${xyz[0].attributes.canonicalTitle}
    </div>
    <div class='animeSynopsis'>
    </div>
    </div>
    </div>`
}



function getCategory(val, containerClass) {

    console.log(containerClass)


    let slug;
    if (typeof val === 'object') {
        slug = val.attributes.slug;
    } else if (typeof val === 'string') {
        slug = val;
    }
    
    service.anime.get("GET", "https://kitsu.io/api/edge/anime?fields[categories]=title&filter[slug]=" + slug + "&include=categories").then(function success(res) {
        
        service._("."+containerClass + ">#" + slug + ">.animeImg").addEventListener("mouseenter", function (e) {
            console.log(res)
            
            
            service._("."+containerClass + "> #" + slug + " .categories").innerHTML = '';
            
            for (var x = 0; x < 3; x++) {
                service._("."+containerClass + "> #" + slug + " .categories").innerHTML += " <span class='category-inline'><div class='categoryType'> " +res.included[x].attributes.title
                + " " + " </div></span>";
            }
            
        });
        
        service._("."+containerClass + "> #" + slug + ">.animeImg").addEventListener("mouseleave", function (e) {
            service._("."+containerClass + "> #" + slug + " .categories").innerHTML = '';
        });
    }, function err() {});
    
    



}





// var DOMobserver;

// var transition = function (mutation) {
//     console.log(mutation)
//     for (var i = 0; i < mutation.length; i++) {
//         for (var j = 0; j < mutation[i].addedNodes.length; j++) {
//             var node = mutation[i].addedNodes[j];
//             console.log(node.nodeType)
//             if ((node.nodeType === 1)) {

//                 DOMobserver.disconnect();
//                 return;
//             }
//         }
//     }

// }

// DOMobserver = new MutationObserver(transition);
// var parent = service._("#popular");
// DOMobserver.observe(parent, {
//     childList: true,
//     subtree: true
// })





callAnimeType("https://kitsu.io/api/edge/trending/anime?limit=5", "#trending", "trending");

callAnimeType("https://kitsu.io/api/edge/anime?sort=popularityRank","#popular","popular");