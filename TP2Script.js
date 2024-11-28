'use strict'
function openLogIn(Curr_Username, Curr_Password){
    
    let openRequest = indexedDB.open("Users", 1);

    openRequest.onupgradeneeded = function(){

        let db = openRequest.result;
        const UserDataBase = db.createObjectStore('ListOfCurrentUsers',{keyPath:"username"});

        UserDataBase.createIndex("username", "username", {unique: true});
        UserDataBase.createIndex("password", "password", {unique: false});
        UserDataBase.createIndex("Item1", "Item1", {unique: true});
        UserDataBase.createIndex("Item2", "Item2", {unique: false});
        UserDataBase.createIndex("Item3", "Item3", {unique: true});
        UserDataBase.createIndex("NekoToken", "NekoToken", {unique: false});
        
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
            password: Curr_Password,
            Item1: false,
            Item2: 0,
            Item3: false,
            NekoToken: 0
        };
        if(Curr_Username != "" && Curr_Password != ""){
            let getRequest = store.get(Curr_Username);
            getRequest.onerror = function(event){
                store.put(user,Curr_Username);
            };
            getRequest.onsuccess = function() {
                if (getRequest.result) {
                    console.log("User already exists:");
                    if(getRequest.result.password == Curr_Password){
                        window.location.href='Game.html';
                    }
                    else{
                        alert("Wrong Password");
                    }
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
        else{
            alert("You can't log in with nothing silly!");
        }
    }
}
let Token = 0;
let Mult = 1.0;
let CatFood = 0;
let BlueYarn = false;
let BlueToad = false;
function Click(){
    let VisToken = document.getElementById("Token");
    ActiveMult();
    Token = Token + ((1 + CatFood) * Mult);
    Token = Math.round(Token*100)/100;
    VisToken.textContent = Token
}
function ActiveMult(){
    if(BlueYarn == true){
        let itemprice = document.getElementById("Item2");
        itemprice.textContent = "Bought";

        Mult = Mult + 0.1;
    }
    if(BlueToad == true){
        let itemprice = document.getElementById("Item3");
        itemprice.textContent = "Bought";
        
        Mult = Mult + 0.5;
    }
}
function UpdatePrice(Price){
    let VisToken = document.getElementById("Token");
    Token = Token - Price;
    Token = Math.round(Token*100)/100;
    VisToken.textContent = Token;
}
function UpdateCat(Image){
    let cat = document.getElementById("Cat");
    cat.style.backgroundImage="url("+Image+")";
}
function BuyItem(Curr_Item){

    switch(Curr_Item){
        case "Item1":
            if(Token >= 10){
                UpdatePrice(10);
                CatFood = CatFood + 1;
                break;
            }
        case "Item2":
            if(Token >= 50 && BlueYarn == false){
                UpdatePrice(50);
                BlueYarn = true;
                ActiveMult();
                break;
            }
        case "Item3":
            if(Token >= 200 && BlueToad == false){
                UpdatePrice(200);
                BlueToad = true;
                ActiveMult();
                UpdateCat('https://static.wikia.nocookie.net/marioinlife/images/2/28/Cat_Toad_Artwork_-_Super_Mario_3D_World.png/revision/latest?cb=20210304154856');
                break;
            }
    }
}