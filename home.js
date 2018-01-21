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


        console.log(data.data[0].attributes);

    }, function error(err) {
        console.log(err);

    })

});


//trending anime
anime.get("GET", "https://kitsu.io/api/edge/trending/anime?limit=5").then(function success(anime) {
    
    let sortOrder = 'trending';
    let sortObj = {};
    var arr = [];
    
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
            
            this.data.forEach(function (item) {
                
                arr.push(item);
                
                sortObj[item.attributes.canonicalTitle] = item.attributes.averageRating;
            });
            return arr.map(function (val) {
                
                //shorten synopsis
                
                let synopsis = function synopsis(){
                    let synopsis = val.attributes.synopsis;
                    let tempArr =[];
                    for(var i=0;i<synopsis.length;i++) {
                        if(synopsis[i] === '.') tempArr.push(i+1);
                    }
                    
                    return synopsis.substr(0,tempArr[1]);
                    
                }
                
                // let categories = function categories(){
                    
                // }
                getCategories(val);
                
                return trendingAnime.component(val,synopsis);
            })
            
            
        }
        
        
        component(val,synopsis) {
            //   console.log(val)
            
            return `<div class='anime-cont'><div class='animeImg'>
            <img src='${val.attributes.posterImage.small}'>
            <div class='overlay'>
            <div class='categories'>
            ${val.relationships.categories.link}    
            </div>
            </div>
            </div>
            <div class='animeInfo'>
            <div class='animeTitle'>
            ${val.attributes.canonicalTitle}
            </div>
            <div class='animeSynopsis'>
            ${synopsis()}
            </div>
            </div>
            </div>`
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
            _("#comp").innerHTML = trendingAnime.render();
            
        } else if (e.target.classList.contains('sortDsc')) {
            sortOrder = 'dsc';
            _("#comp").innerHTML = trendingAnime.render();
        }
        
    });
}, function error() {});


function getCategories (val) {
    console.log(val.relationships.categories.links.related)
    anime.get("GET","https://kitsu.io/api/edge"+val.relationships.categories.links.related).then(function success(categories){
        // this.categories = categories;
        console.log(categories)
        
    },function error(){});
    
}