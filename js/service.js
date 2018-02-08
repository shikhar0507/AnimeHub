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




function getWeather(position,callback){
 
   
    var mood = {"haze":"horror","dark":"demon","fog":"adventure","mist":"fantasy"};
    var weather;


    _(".btn-suggest").addEventListener("click",function(){
    
    anime.get("GET","https://api.openweathermap.org/data/2.5/weather?lat="+position.latitude+"&lon="+position.longitude+"&APPID=738818b9876673c608786a5055be1371").then(function success (forecast){
        
        forecast.weather.map(function(weatherType){
            weather = weatherType.main.toLowerCase();
            
        })  
        
            _(".suggestion-box").innerHTML = mood[weather];
             callback(mood[weather]);
            
        })
        
        
    },function error(err){});
    
}

getWeather(userCoords,computeAnime);

function computeAnime(val){ //callback for fetching anime based on category

    anime.get("GET","https://kitsu.io/api/edge/anime?filter[categories]="+val+"&sort=-averageRating").then(function(response){
    
    

    },function error(){})
    
}


function getPositionError(){
    return;
}





export {url,anime,_};


