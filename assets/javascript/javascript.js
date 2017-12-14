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
        console.log(database.ref('trains'));
        database.ref('trains').once('value').then(function(snapshot){
            console.log(snapshot.val());
            if (snapshot.val() === null) {
                database.ref().set({trains: "[]"});
            }
            else {
                trainSchedule.currentTrains = JSON.parse(snapshot.val());
                trainSchedule.writeAllRows();
            }
        });
        
    },
    // Adds a single train to the currentTrains Array, writes the new array to the db,
    // and adds a row in the table with this new train's info
    addTrain: function() {
        this.currentTrains.push(
            {
                'name': $("#trainName").val(),
                destination: $("#destination").val(),
                firstTrainTime: $("#firstTrainTime").val(),
                frequency: $("#frequency").val()
            }
        );
        database.ref().set({
            trains: JSON.stringify(this.currentTrains)
        });
        this.addRow(this.currentTrains[this.currentTrains.length - 1])
    },
    // Adds a row to the table for the newly added train
    addRow: function(trainObject) {
        $("#trainsTable").append(`
        <tr>
            <td>` + trainObject.name + `</td>
            <td>` + trainObject.destination  + `</td>
            <td>` + trainObject.frequency  + `</td>
            <td>` + this.nextArrival(trainObject.firstTrainTime, trainObject.frequency) + `</td>
            <td>` + this.minutesAway(trainObject.firstTrainTime, trainObject.frequency) + `</td>
        </tr>
    `);
    },
    // Writes a table row for each train in the currentTrains array
    writeAllRows: function() {
        if (this.currentTrains.length > 0) {
            this.currentTrains.map(function(value) {
                $("#trainsTable").append(`
                    <tr>
                        <td>` + value.name + `</td>
                        <td>` + value.destination  + `</td>
                        <td>` + value.frequency  + `</td>
                        <td>` + trainSchedule.nextArrival(value.firstTrainTime, value.frequency) + `</td>
                        <td>` + trainSchedule.minutesAway(value.firstTrainTime, value.frequency) + `</td>
                    </tr>
                `);
            });
        }
    },
    nextArrival: function(firstTrainTime, frequency) {
        // create variable for current time moment (now)
        // create variable for firstTrainTime moment - time of first train with today's date (firstTime)
        // IF (firstTime.diff(now) > 0), we are past first time, so nextArrival will be current time + difference % frequency
        // ELSE, first time hasn't come yet, so nextArrival is firstTime
        let currentTime = moment();
        let firstTrain = moment(moment().format('MM/DD/YYYY') + " " + firstTrainTime);
        let difference = currentTime.diff(firstTrain, 'minutes');
        console.log("Current Time: " + currentTime.format("LLLL"));
        console.log("First Train: " + firstTrain.format("LLLL"));
        if (difference >= 0) {
            currentTime.add(frequency - (difference%frequency), 'minutes');
            console.log("Next Arrival: " + currentTime.format('H:mm A'));
            return currentTime.format('h:mm A');
        }
        else {
            console.log("Next Arrival: " + firstTrain.format('H:mm A'));            
            return firstTrain.format('h:mm A');
        }
    },
    minutesAway: function(firstTrainTime, frequency) {
        // create variable for current time moment (now)
        // create variable for firstTrainTime moment - time of first train with today's date (firstTime)
        // IF (firstTime.diff(now) > 0), we are past first time, so minutes away will be difference % frequency
        // ELSE, first time hasn't come yet, so minutes away is absolute value of difference
        let currentTime = moment();
        let firstTrain = moment(moment().format('MM/DD/YYYY') + " " + firstTrainTime);
        let difference = currentTime.diff(firstTrain, 'minutes');
        if (difference >= 0) {
            return (frequency - (difference % frequency)) + " minutes";
        }
        else {
            return Math.abs(difference) + " minutes";
        }
    },
};

//------------EVENT LISTENERS------------

$("#submitButton").click(function() {
    event.preventDefault();
    trainSchedule.addTrain();
});

//-------------ONLOAD FUNCTIONS-------------

// Initialize the application. If there are trains saved to the db on pageload, they are
// pulled into the application. Else, an empty array is saved to the database.
trainSchedule.initializeApp();


});