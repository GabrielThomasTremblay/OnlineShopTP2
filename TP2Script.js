'use strict'
function openLogIn(Curr_Username, Curr_Password){
    
    let openRequest = indexedDB.open("Users", 1);

    openRequest.onupgradeneeded = function(){

        let db = openRequest.result;
        const UserDataBase = db.createObjectStore('ListOfCurrentUsers',{keyPath:"username"});

        UserDataBase.createIndex("username", "username", {unique: true});
        UserDataBase.createIndex("password", "password", {unique: false});
        UserDataBase.createIndex("Item1", "Item1", {unique: false});
        UserDataBase.createIndex("Item2", "Item2", {unique: false});
        UserDataBase.createIndex("Item3", "Item3", {unique: false});
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
            Item1: 0,
            Item2: false,
            Item3: false,
            NekoToken: 0
        };
        if(Curr_Username != "" && Curr_Password != ""){
            let getRequest = store.get(Curr_Username);
            getRequest.onerror = function(event){
                store.put(user,Curr_Username);
                document.cookie = "item1 = 0"
                document.cookie = "item2 = false"
                document.cookie = "item3 = false"
                document.cookie = "nekoToken = 0"
                document.cookie = "username ="+ Curr_Username;
                window.location.href='Game.html';
            };
            getRequest.onsuccess = function() {
                if (getRequest.result) {
                    console.log("User already exists:");
                    if(getRequest.result.password == Curr_Password){
                        document.cookie = "item1 =" + getRequest.result.Item1;
                        document.cookie = "item2 =" + getRequest.result.Item2;
                        document.cookie = "item3 =" + getRequest.result.Item3;
                        document.cookie = "nekoToken =" + getRequest.result.NekoToken;
                        document.cookie = "username ="+ Curr_Username;
                        window.location.href='Game.html';
                    }
                    else{
                        alert("Wrong Password");
                    }
                } else {
                    let addRequest = store.put(user);
                    addRequest.onsuccess = function() {
                        console.log("User added to the list", addRequest.result);
                        document.cookie = "item1 = 0"
                        document.cookie = "item2 = false"
                        document.cookie = "item3 = false"
                        document.cookie = "nekoToken = 0"
                        document.cookie = "username ="+ Curr_Username;
                        window.location.href='Game.html';
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
let Profile = "";

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

function LoadProfile(){
    Token = getCookie(nekoToken);
    CatFood = getCookie(item1);
    BlueYarn = getCookie(item2);
    BlueToad = getCookie(item3);
    Profile = getCookie(username);
}
function UpdateProfile(profile){
    let openRequest = window.indexedDB.open("Users", 1);
    openRequest.onsuccess = function(){
        const db = openRequest.result;
        const objectStore = db.transaction('ListOfCurrentUsers', 'readwrite').objectStore('ListOfCurrentUsers');

        let getRequest = objectStore.get(profile);
    
        getRequest.onsuccess = function(event) {
            let user = event.target.result; // Access the result here
    
            if (user) { // Check if user exists
                user.Item1 = CatFood;
                user.Item2 = BlueYarn;
                user.Item3 = BlueToad;
                user.nekoToken = Token;
    
                // Update the user object in the object store
                objectStore.put(user);
            } else {
                console.error("User not found");
            }
        };
        
        
    }


}

function Click(){
    let VisToken = document.getElementById("Token");
    ActiveMult();
    Token = Token + ((1 + CatFood) * Mult);
    Token = Math.round(Token*100)/100;
    VisToken.textContent = Token
    UpdateProfile(Profile);
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
        UpdateCat('Picture/CatToad.png');
    }
}
function UpdatePrice(Price){
    let VisToken = document.getElementById("Token");
    Token = Token - Price;
    Token = Math.round(Token*100)/100;
    VisToken.textContent = Token;
    UpdateProfile(Profile);
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
                break;
            }
    }
}