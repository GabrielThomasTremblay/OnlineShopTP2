'use strict'
function openLogIn(Username, Password){
    
    let openRequest = indexedDB.open("Users", 1);

    openRequest.onupgradeneeded = function(){

        let db = openRequest.result;
        UserDataBase = db.createObjectStore('ListOfCurrentUsers', {keyPath: 'username'});

        UserDataBase.createIndex("username", "username", {unique: true});
        UserDataBase.createIndex("password", "password", {unique: false});
        
    }
    openRequest.onerror = function(){

        console.log("Probleme en ouvrant la base de donne");
    }
    openRequest.onsuccess = function(){

        console.log("Base de donner ouverte avec succes");
        let UserDataBase = openRequest.result;

        let transaction = UserDataBase.transaction("ListOfCurrentUsers", "readwrite");

        let ListOfCurentUsers = transaction.objectStore("ListOfCurrentUsers");

        let user = {

            username: Username, 
            password: Password,
        };

        let getRequest = ListOfCurentUsers.get('Username');
        getRequest.onsuccess = function() {
            if (getRequest.result) {
                console.log("User already exists:", getRequest.result);
            } else {
                let addRequest = ListOfCurentUsers.add(user);
                addRequest.onsuccess = function() {
                    console.log("User added to the list", addRequest.result);
                };
                addRequest.onerror = function() {
                    console.log("An error has occurred when trying to add a new user", addRequest.error);
                };
            }
        };

        request.onsuccess = function() {
            console.log("User added to the list", request.result);
        };
          
        request.onerror = function() {
            console.log("An error has occured when trying to add a new user", request.error);
        };
    }



}