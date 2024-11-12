'use strict'
function openLogIn(Curr_Username, Curr_Password){
    
    let openRequest = indexedDB.open("Users", 1);

    openRequest.onupgradeneeded = function(){

        let db = openRequest.result;
        const UserDataBase = db.createObjectStore('ListOfCurrentUsers',{keyPath:"username"});

        UserDataBase.createIndex("username", "username", {unique: true});
        UserDataBase.createIndex("password", "password", {unique: false});
        
    }

    openRequest.onerror = function(){

        console.log("Probleme en ouvrant la base de donne");
    }
    openRequest.onsuccess = function(){

        console.log("Base de donner ouverte avec succes");
        let db = openRequest.result;

        let transaction = db.transaction("ListOfCurrentUsers", "readwrite");

        let store = transaction.objectStore("ListOfCurrentUsers");
        
        let user = {
            username: Curr_Username, 
            password: Curr_Password
        };
        let getRequest = store.get(Curr_Username);
        getRequest.onerror = function(event){
            store.put(user,Curr_Username);
        };
        getRequest.onsuccess = function() {
            if (getRequest.result) {
                console.log("User already exists:", getRequest.result);
            } else {
                let addRequest = store.put(user);
                addRequest.onsuccess = function() {
                    console.log("User added to the list", addRequest.result);
                };
                addRequest.onerror = function() {
                    console.log("An error has occurred when trying to add a new user", addRequest.error);
                };
            }
        };
    }



}