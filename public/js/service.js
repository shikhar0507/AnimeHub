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


//Anime mood suggestion

navigator.geolocation.getCurrentPosition(getCoords,getPositionError);

var userCoords = {};
function getCoords(position) {
    if(position) {
     
        
    userCoords["latitude"] = position.coords.latitude;
    userCoords["longitude"] = position.coords.longitude;

    return userCoords;
    }
    else {
        return;
    }
    
}




// function getWeather(position,callback){
 
   
    var mood = {"haze":"horror","dark":"demon","fog":"adventure","mist":["fantasy","adventure"],"smoke":["thriller,science-fiction"]};
    var weather;
    var hasWeather = false;

    

    _(".btn-suggest").addEventListener("click",function(){
        if(!hasWeather) {
        
    anime.get("GET","https://api.openweathermap.org/data/2.5/weather?lat="+position.latitude+"&lon="+position.longitude+"&APPID=738818b9876673c608786a5055be1371").then(function success (forecast){
        forecast.weather.map(function(weatherType){
            weather = weatherType.main.toLowerCase();   
                
           
             callback(mood[weather]);
            hasWeather = true;    
        });
        
        
    },function error(err){});
}
else {
    return;
}

setInterval(function(){   // reseting for api call
    hasWeather = false;
},60000)

});
    
    
// }

// getWeather(userCoords,computeAnime);

function computeAnime(val){ //callback for fetching anime based on category
    console.log(val)
    var sugAnimeTitle;
    if(Array.isArray(val)) {
        sugAnimeTitle = val.map(function(q) {
            return q;
        })
    }
    else {
        sugAnimeTitle = val;
    }
    
    // console.log(sugAnimeTitle)

    var suggestionData;
    var modalObj = {};
    
    anime.get("GET","https://kitsu.io/api/edge/anime?filter[categories]="+sugAnimeTitle+"&sort=-averageRating").then(function(response){
    
        //limit data to 5;

        suggestionData = response.data.splice(0,5);
        
     _(".sug-list").innerHTML = suggestionData.map(function(val) {
        
        modalObj[val.attributes.slug] = val;
         
             return `<li class='sug-li' id="${val.attributes.slug}">${val.attributes.canonicalTitle} <span>${val.attributes.averageRating}<span>
        <br>
        </li>`
     }).join('');

        
        var numberOfLists = document.querySelectorAll(".sug-li");
        for(var i=0;i<numberOfLists.length;i++) {
            numberOfLists[i].addEventListener("click",function(e){
console.log(e.target.id)
                  var modal = new Modal(modalObj[e.target.id]);
                    _("#modalDom >.modal-interior").innerHTML = modal.createModal();
                    modal.mutateModal();
            });
        }

       

    },function error(){})

}



function getPositionError(){
    return;
}



//render modal. For close call seperate function is created.

class Modal {
    constructor(q) {
        this.modalData =q;
        console.log(this.modalData);
    }

    createModal(){

        

        var modalEl =   `<div class="modal">
            <div class="closeModal">X</div>
            <div class="modal-area">

            <div class="modal-image">
            <img src="
            ${this.modalData.attributes.posterImage.small}" class="grow"></div>
            <div class="modal-content">
            
            <div class="stats">
            <ul>
            <li> Popularity <span> ${this.modalData.attributes.popularityRank} </span></li>
            <li> Rating <span>${this.modalData.attributes.averageRating} </span></li>
            <li> Status <span>${this.modalData.attributes.status}</span></li>
            </ul>
            </div>
            <div class="synopsis">

            </div>
            </div>
            </div>
        </div>`


        return modalEl;  

    }

    mutateModal () {
        _(".closeModal").setAttribute("onclick",closeModal());


    
    }

}        
        

function closeModal () {
    _(".closeModal").addEventListener("click",function(){
        _(".modal").style.display = "none";
    });                               


}





export {url,anime,_};


