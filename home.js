
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
    
    service.anime.get("GET", url + "?filter[slug]=" + query,true).then(function success(data) {
        
        
        console.log(data.data[0].attributes);
        
    }, function error(err) {
        console.log(err);
        
    })
    
});


//trending anime
var arr = [];
var trendingAnime;
var isSort = false;
service.anime.get("GET", "https://kitsu.io/api/edge/trending/anime?limit=5",true).then(function success(anime) {
    
    let sortOrder = 'trending';
    let sortObj = {};
    
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
                
                sortObj[item.attributes.slug] = item.attributes.averageRating;                
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
                return  trendingAnime.component(val,synopsis,false);
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
    
                
                return sortedArray[0].map(function (animeTitle) {
                    sortedTrendingAnimeCall(animeTitle)
                });
            }        
            
            
            component(val,synopsis) {            
                
                    
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
                
                
                
            getCategory(val)

}   
    }
    trendingAnime = new renderTrendingAnime(anime);
        service._("#comp").innerHTML = trendingAnime.render();
    
    document.addEventListener("click", function (e) {
        
        if (e.target.classList.contains('sortAsc')) {
            sortOrder = 'asc';
            service._("#comp").innerHTML = trendingAnime.render();
            
        } else if (e.target.classList.contains('sortDsc')) {
            sortOrder = 'dsc';
            service._("#comp").innerHTML = trendingAnime.render();
        }
        
        
    });
}, function error() {});

function sortedTrendingAnimeCall(animeTitle) {
    var xyz = [];
    service.anime.get("GET","https://kitsu.io/api/edge/anime?filter[slug]="+animeTitle).then(function success(sortedData){

        xyz.push(sortedData.data[0]);
        
    },function err(){});
setTimeout(function() {
    component(xyz)        
},1000);
}

function component(xyz) {
    
    service._(".trending").innerHTML += `<div class='anime-cont' id=${xyz[0].attributes.slug}>
    <div class='animeImg'>
    <img src='${xyz[0].attributes.posterImage.small}' class='poster'>
    <div class='overlay'>
    <div class='categories'>
    ${getCategory(xyz[0].attributes.slug)}
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




var categoryData;

function getCategory(val){  
      
    let targetEl;
    if(typeof val === 'object') {
    targetEl = val.attributes.slug;
    }
    else if (typeof val === 'string') {
        targetEl = val;
    }

    setTimeout(function(){

        service._("#"+targetEl+">.animeImg").addEventListener("mouseenter",function(e){
            service._("#"+targetEl+" .categories").innerHTML = ''
            service.anime.get("GET","https://kitsu.io/api/edge/anime?fields[categories]=title&filter[slug]="+targetEl+"&include=categories").then(function success(res){
                categoryData = res.included.map(function(s) {

            return s.attributes.title;
            
        });
        categoryData = categoryData.slice(0,3);   //limit categories to 3
            categoryData.map(function(category){ 
                service._("#"+targetEl+" .categories").innerHTML += " <span class='category-inline'><div class='categoryType'> " + category + " " + " </div></span>";
        })            
        },function err(){});
        
        
    });
    
    service._("#"+targetEl+">.animeImg").addEventListener("mouseleave",function(e){
        service._("#"+targetEl+" .categories").innerHTML = '';                                   
    });

},0);
}

var DOMobserver;

var transition = function (mutation) {
    for(var i=0; i < mutation.length;i++) {        
        for(var j =0; j <mutation[i].addedNodes.length; j++) {
            var node = mutation[i].addedNodes[j];            
            if ((node.nodeType === 1)){
                drawCanvas();
                DOMobserver.disconnect();
                return;
            }
        }
    }
    
}

DOMobserver = new MutationObserver(transition);
var parent = service._("#comp");
DOMobserver.observe(parent,{
    childList:true,
    subtree:true
})

function drawCanvas() {
    var c = service._("#canvas");    
    var img = service._(".poster");
    c.width = img.width;
    c.height = img.height;
    var ctx = c.getContext("2d");

    console.log(c.toDataURL());
    ctx.drawImage(img,0,0);


    try {
        var data = ctx.getImageData(0,0,img.width,img.height);
    }
    catch(e) {
        console.log(e);
        
    }
    // console.log(data);
    
}
