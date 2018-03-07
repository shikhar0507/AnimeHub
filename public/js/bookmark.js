var db = firebase.firestore();
var bookmarks = {};

setTimeout(function(){

    var stars = document.querySelectorAll(".set-bookmark");
    for(var i =0;i<stars.length;i++) {

        stars[i].addEventListener("click",function(e){
            
            console.log("Add")
            if(e.target.classList.contains("bookmarked")) {
                removeBookmark(e.target.id);
                e.target.classList.remove("bookmarked");
            }
            else {
                e.target.classList.add("bookmarked");
                setBookmark(e.target.id)

            }
    });
}
},1000)

function setBookmark(title){

    
    
    db.collection("users").add({
        title: title,
        
    })
    .then(function(docRef) {
        console.log("Document written with ID: ", docRef.id);
        
        bookmarks[title] = docRef.id;
    })
    .catch(function(error) {
        console.error("Error adding document: ", error);
    });
    
}




function getBookmark(){
db.collection("users").get().then(function(document) {
    document.forEach(function(doc) {
        enableBookmark(doc.data())
        setTimeout(function(){

                bookmarks[doc.data().title] = doc.id;
            },100)
        })
    })
}

getBookmark();



function enableBookmark(data){
    
    var stars = document.querySelectorAll(".set-bookmark");
    
    for(var i =0;i<stars.length;i++) {
        if(stars[i].id === data.title) {
            stars[i].classList.add("bookmarked");
        }
    }
}



// console.log(bookmarks)
function removeBookmark(name) {
 db.collection("users").doc(bookmarks[name]).delete().then(function(){
 }); 
}