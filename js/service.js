/* This is where the individual services for GET/POST Requests will be handled*/

const api = "https://kitsu.io/api/edge/anime?";
const apiAnime = api+"filter[slug]=";

var searchEl = document.querySelector(".queryText.search");
var submitEl = document.querySelector(".getText");

var animeDataObj = {};

var checkString = function(str){
    let whiteSpaceCount =  str.split(" ").length -1;
    // console.log(str.indexOf(' '))
    for(var i=0;i < whiteSpaceCount;i++) {
       var newStr =  str.replace(" ","%20");
        console.log(newStr);
    }        
    return str;
};

submitEl.addEventListener("click",function(){

   var query = searchEl.value;
   checkString(query);
   var xhr = new XMLHttpRequest();
   xhr.open('GET',apiAnime+query);
   xhr.send(null);
   ajax.send(xhr);
});




var ajax = (function() {
   
    return {
       send : function(xhr){

            xhr.onreadystatechange = function(){
                const DONE =4;
                const OK = 200;
                if(xhr.readyState === DONE) {
                    if (xhr.status === OK) {
                       var response =  xhr.responseText;
                       ajax.parseData(response);
                    }
                    else {
                        alert("error");
                    }
                }
            };

       },

       parseData : function(response){
            var apiData = JSON.parse(response);
            if (apiData.meta.count == 0) {
                console.log(0);
            }
            else {
                 animeDataObj.data = apiData.data[0];          
            }
       },
    }
})();





console.log(animeDataObj);






