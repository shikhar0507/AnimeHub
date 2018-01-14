import {
    url,
    anime,
    _
} from './service.js';

//search bar

document.querySelector(".getText").addEventListener("click", function () {
    var rawQuery = document.querySelector(".queryText").value;
    let query;
    if (rawQuery.indexOf(" ") >= 0) {
        query = rawQuery.replace(/\s/g, "-");
    }
    anime.get("GET", url + "?filter[slug]=" + query).then(function success(data) {
        
        console.log(data.data[0].attributes.canonicalTitle);

    }, function error(err) {
        console.log(err);

    })

});


//trending anime
anime.get("GET", "https://kitsu.io/api/edge/trending/anime").then(function success(anime) {

let sortObj = {};

for(var i =0;i< anime.data.length;i++) {
    _(".trendCont").innerHTML += "<div class='trend"+i+"'><h3>"+anime.data[i].attributes.canonicalTitle+"</h3><p>"+anime.data[i].attributes.synopsis+"</p></div>";

    sortObj[anime.data[i].attributes.canonicalTitle] = anime.data[i].attributes.averageRating;
}

//sort ascending

let sortedArrayAsc = Object.keys(sortObj).sort(function(a,b) {
    return sortObj[a] - sortObj[b];
})

let sortedArrayDsc = Object.keys(sortObj).sort(function(a,b) {
    return sortObj[b] - sortObj[a];
})

_(".sortAsc").addEventListener("click",function(e){
    let sortData;
    for(var i=0;i<sortedArrayAsc.length;i++) 
{
    sortData += "<div class='trend'><h3>"+sortedArrayAsc[i]+"</h3></div>";

}
_(".trendCont").innerHTML = sortData.replace("undefined","");
 
})

//sort descending

_(".sortDsc").addEventListener("click",function(e){
    let sortData;
    for(var i=0;i<sortedArrayDsc.length;i++) 
{
    sortData += "<div class='trend'><h3>"+sortedArrayDsc[i]+"</h3></div>";

}
_(".trendCont").innerHTML = sortData.replace("undefined","");


});

}, function error() {})


