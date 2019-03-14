var config = {
    apiKey: "AIzaSyAsIncheV0khOdefq-xyzDZux6O5rmNd9U",
    authDomain: "trainschedule-7d9c4.firebaseapp.com",
    databaseURL: "https://trainschedule-7d9c4.firebaseio.com",
    projectId: "trainschedule-7d9c4",
    storageBucket: "",
    messagingSenderId: "627476563642"
};
firebase.initializeApp(config);

var database = firebase.database();


var trainName = "";
var destination = "";
var time = "";
var frequency = 0;



// Capture Button Click // ******
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text boxes
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    time = $("#first-train-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // Code for handling the push. puhs adds into database.
    database.ref().push({
        trainName: trainName,
        destination: destination,
        time: time,
        frequency: frequency,
    });

});

// Firebase watcher .on("child_added"
database.ref().on("child_added", function (snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    // Console.loging the last user's data
    console.log(sv.trainName);
    console.log(sv.destination);
    console.log(sv.time);
    console.log(sv.frequency);

    // makes frequency into a number you can use later.
    var freq = parseInt(sv.frequency)


    var dConverted = moment(snapshot.val().time, 'HH:mm').subtract(1, 'years');
    var trainTime = moment(dConverted).format('HH:mm');
    var tConverted = moment(trainTime, 'HH:mm').subtract(1, 'years');
    var tDifference = moment().diff(moment(tConverted), 'minutes');
    var tRemainder = tDifference % freq;
    var minsAway = freq - tRemainder;
    var nextTrain = moment().add(minsAway, 'minutes');


    //change the HTML to reflect, create new row.
    var newRow = $("<tr>").append(
        $("<td>").text(sv.trainName),
        $("<td>").text(sv.destination),
        $("<td>").text(sv.frequency),
        $("<td>").text(moment(nextTrain, 'HH:mm').format('hh:mm a')),
        $("<td>").text(minsAway + ' Minutes Away'),
    )


    //append the new row to the table.
    $("#train-table > tbody").append(newRow);


    // Prints the current day and time in this particular format.
    console.log(moment().format("MM/DD/YY hh:mm A"));



    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});