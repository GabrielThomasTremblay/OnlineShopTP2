function openLogIn(username, password){
    
    let openRequest = indexedDB.open("Users")

    openRequest.onupgradeneeded = function(){

        let UserDataBase = openRequest.result;
        UserDataBase.createObjectStore('ListOfCurrentUsers', {keyPath: 'username'});

        UserDataBase.createIndex("username", "username", {unique: true});
        UserDataBase.createIndex("password", "password", {unique: false});
        UserDataBase.createIndex("JSONData", "JSONData", {unique: true});
    }
    openRequest.onerror = function(){

        console.log("Probleme en ouvrant la base de donne");
    }
    openRequest.onsuccess = function(){

        console.log("Base de donner ouverte avec succes");
        let UserDataBase = openRequest.result;

        let transaction = UserDataBase.transaction("Users", "readwrite");

        let ListOfCurentUsers = transaction.objectStrore("ListOfCurrentUsers");
    }



}