import * as service from './service.js';




var containerClass = 'trending';

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

    service.anime.get("GET", service.url + "?filter[slug]=" + query, true).then(function success(data) {


        console.log(data.data[0].attributes);

    }, function error(err) {
        // console.log(err);

    })

});


//trending anime
var trendingAnime;
var isSort = false;
let sortOrder;
var callAnimeType = function (animeDataType, whereToInsert) {
    
    
    
    service.anime.get("GET", animeDataType).then(function success(anime) {
   
sortOrder = 'trending';
        let sortObj = {};
        var arr = [];
        var limitData =[];
        // containerClass = containerClass
        class renderTrendingAnime {
            constructor() {
                
                for(var i=0;i<10;i++) {
                limitData.push(anime.data[i]);
                }
                

                
            }
            render() {
                // console.log(containerClass)

                if (sortOrder === 'asc' || sortOrder === 'dsc') {
                    document.querySelector("#trending").innerHTML = '';
                
                
                    return `<div class="${containerClass}">
                
                
                       ${this.sort().join('')}
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


                    return trendingAnime.component(val, synopsis);
                })
            }

            sort() {


                let sortedArray = [];
                sortedArray.push(Object.keys(sortObj).sort(function (a, b) {
                    if (sortOrder === 'asc') {
                        return sortObj[a] - sortObj[b];
                    } else { //descending
                        // console.log("yes")
                        return sortObj[b] - sortObj[a];
                    }
                }));

                // console.log(sortedArray)
                return sortedArray[0].map(function (animeTitle) {
                    sortedTrendingAnimeCall(animeTitle,containerClass)
                });
            }


            component(val) {
    setTimeout(function() {
                getCategory(val, containerClass);
    },3000) 

                return `<div class='anime-cont' id=${val.attributes.slug}>
                <div class='animeImg'>
                <img src='${val.attributes.posterImage.small}' class='poster'>
                <div class='overlay'>
                <div class='categories'>
                ${setTimeout(function(){getCategory(val)},300)}
                </div>
                </div>
                </div>
                <div class='animeInfo'>
                <div class='animeTitle'>
                <span class='anime-name'>
                ${val.attributes.canonicalTitle}</span>
                <span id="${val.attributes.slug}" class="set-bookmark star">&#9733</span>
                </div>
                
                </div>
                </div>`

            }
        }


        trendingAnime = new renderTrendingAnime(anime);
        service._(whereToInsert).innerHTML = trendingAnime.render();

        
    }, function error() {});
}




    
  
    
function sortedTrendingAnimeCall(animeTitle,containerClass) {
    // console.log(animeTitle)
    var xyz = [];
    service.anime.get("GET", "https://kitsu.io/api/edge/anime?filter[slug]="+animeTitle).then(function success(sortedData) {
        xyz.push(sortedData.data[0]);
    }, function err() {});
    
setTimeout(function() {
    document.querySelector(".trending").innerHTML += trendingAnime.component(xyz[0]);
},1300)

   
}




function getCategory(val, containerClass) {

   
        let slug;
        if (typeof val === 'object') {
            slug = val.attributes.slug;
        } else if (typeof val === 'string') {
            slug = val;
        }
        service.anime.get("GET", "https://kitsu.io/api/edge/anime?fields[categories]=title&filter[slug]=" + slug + "&include=categories").then(function success(res) {
            // console.log(res)
            service._(".trending >#" + slug + ">.animeImg").addEventListener("mouseenter", function (e) {
                
                
                
                
                service._(".trending > #" + slug + " .categories").innerHTML = '';
                
                for (var x = 0; x < 3; x++) {
                    service._(".trending > #" + slug + " .categories").innerHTML += " <span class='category-inline'><div class='categoryType'> " +res.included[x].attributes.title
                    + " " + " </div></span>";
                }
                
            });
            
            service._(".trending> #" + slug + ">.animeImg").addEventListener("mouseleave", function (e) {
                service._(".trending > #" + slug + " .categories").innerHTML = '';
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




getBookmark();
callAnimeType("https://kitsu.io/api/edge/trending/anime", "#trending", "trending");



service._(".sortTrendAsc").addEventListener("click", function (e) {
    
    sortOrder = 'asc';
    
    setTimeout(function(){
        
        service._("#trending").innerHTML = trendingAnime.render();
        
            
        enableBookmark();
    },1000)
}); 

service._(".sortTrendDsc").addEventListener("click", function (e) {
    
    setTimeout(function(){
        
        sortOrder = 'dsc';
        service._("#trending").innerHTML = trendingAnime.render();
        getBookmark();
    },1000)
});

