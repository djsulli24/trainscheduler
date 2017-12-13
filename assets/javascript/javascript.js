$(document).ready(function() {

// Initialize Firebase
var config = {
    apiKey: "AIzaSyDdmemfTCkhBHFkQ6ZUR_xpzjVX0sZJ_-g",
    authDomain: "train-schedule-424da.firebaseapp.com",
    databaseURL: "https://train-schedule-424da.firebaseio.com",
    projectId: "train-schedule-424da",
    storageBucket: "",
    messagingSenderId: "639845252675"
  };
  firebase.initializeApp(config);

//---------------APP OBJECT--------------

var database = firebase.database()

var trainSchedule = {
    currentTrains: [],
    initializeApp: function() {
        database.ref('trains').once('value').then(function(snapshot){

            if (snapshot.val() === null) {
                database.ref().set({trains: "[]"});
            }
            else {
                trains.currentTrains = JSON.parse(snapshot.val());;
            }
        });
    },
    addTrain: function() {

    },

};

//------------EVENT LISTENERS------------

$("#submitButton").click(function() {
    event.preventDefault();
    // database.ref().set({"time": moment().format("LLLL")});
    database.ref('time').once('value').then(function(snapshot){
        console.log(snapshot.val());
    });
});

//-------------ONLOAD FUNCTIONS-------------

// Initialize the application. If there are trains saved to the db on pageload, they are
// pulled into the application. Else, an empty array is saved to the database.
trainSchedule.initializeApp();


});