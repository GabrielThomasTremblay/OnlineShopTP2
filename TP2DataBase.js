function openLogIn(){
    
    let openRequest = indexedDB.open("Users")

    openRequest.onerror = function(){
        console.log("Problème en ouvrant la base de donné");
    }
    openRequest.onsuccess = function(){
        console.log("Base de donner ouverte avec succès");
    }
}