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


navigator.geolocation.getCurrentPosition(getWeather,getPositionError);


function getWeather(position) {
    var mood = [{"haze":"horror"}];
    

    anime.get("GET","https://api.openweathermap.org/data/2.5/weather?lat="+position.coords.latitude+"&lon="+position.coords.longitude+"&APPID=738818b9876673c608786a5055be1371").then(function success (forecast){
        
        forecast.weather.map(function(weatherType){
                var weather = weatherType.main.toLowerCase();
                
                mood.map(function(moodCategory){                                      
                //    if( moodCategory[weather] = getCategory()) {;
                //         console.log("watch devil man cry baby");
                        
                // }
                });          
        })          

    },function error(err){});

}

function getPositionError(){
    return;
}





export {url,anime,_};


