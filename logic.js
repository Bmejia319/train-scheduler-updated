 // Initialize Firebase
 var config = {
  apiKey: "AIzaSyCClyBvLv8mjuoompbARdiKoRMO9V5VTm4",
  authDomain: "my-awesome-project-8861a.firebaseio.com",
  databaseURL: "https://my-awesome-project-8861a.firebaseio.com/",
  storageBucket: "gs://my-awesome-project-8861a.appspot.com",
  messagingSenderId: "818275357299"
  };

  firebase.initializeApp(config);

  // Create a variable to reference the database.
  var dataRef = firebase.database();

  // Initial Values
  var name = "";
  var destination = "";
  var firstTime = "";
  var frequency = 0;
 


  $("#add-train").on("click", function(event) {
    event.preventDefault();

    // Grabbed values from text boxes
    name = $("#name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTime = $("#firstTime-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);
  
    // Current Time
    var currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
  
    // Difference between the times
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);
  
    // Time apart (remainder)
    var tRemainder = diffTime % frequency;
    console.log(tRemainder);
  
    // Minute Until Train
    var minutesAway = frequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minutesAway);
  
    // Next Train
    var nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
    console.log("ARRIVAL TIME: " + moment(nextArrival).format("hh:mm"));
     
  

    // Code for handling the push
    dataRef.ref().push({
      name: name,
      destination: destination,
      firstTime: firstTime,
      frequency: frequency,
      nextArrival: nextArrival, 
      minutesAway: minutesAway,
      dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
  });

      // Firebase watcher .on("child_added"
  dataRef.ref().on("child_added", function(snapshot) {
    // storing the snapshot.val() in a variable for convenience
    var sv = snapshot.val();

    
    // Console.loging the last user's data
    console.log(sv.name);
    console.log(sv.destination);
    console.log(sv.firstTime);
    console.log(sv.frequency);
    console.log(sv.nextArrival);
    console.log(sv.minutesAway);
   
  

    // Change the HTML to reflect
    $("#name-display").text(sv.name);
    $("#destination-display").text(sv.destination);
    $("#frequency-display").text(sv.frequency);
    $("#nextArrival-display").text(sv.nextArrival);
    $("#minutesAway-display").text(sv.minutesAway);
  
   


   // full list of items to the well
   $('tbody').append("<tr>" + "<div class='well'><span class='train-name'>"  + "<td>" + sv.name + 
   " </span> <span class='train-destination'> " + "<td>" + sv.destination + "</td>" +
     " </span><span class='train-frequency'>" + "<td>" + sv.frequency + "</td>" +
     "</span> <span class ='train-next'>" + "<td>" + sv.nextArrival + "</td>" +
       "</span> <span class='train-minutes'>" + "<td>" + sv.minutesAway + "</td>" + "</span></div>" + "</tr>");

    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  dataRef.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function(snapshot) {
    // Change the HTML to reflect
    $("#name-display").text(snapshot.val().name);
    $("#destination-display").text(snapshot.val().destination);
    $("#frequency-display").text(snapshot.val().frequency);
    $("#nextArrival-display").text(snapshot.val().nextArrival);
    $("#minutesAway-display").text(snapshot.val().minutesAway);
   
  });
