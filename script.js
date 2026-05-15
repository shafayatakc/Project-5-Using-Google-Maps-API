
// CSUN Campus Map Quiz - script.js
//
// How it works:
//   Each location has a bounding box (north, south, east, west).
//   When the user double clicks, we check if the click is inside
//   that box. If yes = correct, if no = wrong.
//
// The offset (0.0005) creates a small box around each building center.

 
 
// ---- Quiz locations ----
// 5 locations: 1 required (Bookstein Hall) + 4 of my choice
var locations = [
  {
    name: "Bookstein Hall",
    bounds: {
      north: 34.24239836636929 + 0.0005,
      south: 34.24239836636929 - 0.0005,
      east:  -118.53101573516422 + 0.0005,
      west:  -118.53101573516422 - 0.0005
    }
  },
  {
    name: "Bayramian Hall",
    bounds: {
      north: 34.24122330121391 + 0.0005,
      south: 34.24122330121391 - 0.0005,
      east:  -118.53130775844306 + 0.0005,
      west:  -118.53130775844306 - 0.0005
    }
  },
  {
    name: "Jacaranda Hall",
    bounds: {
      north: 34.24200419298145 + 0.0005,
      south: 34.24200419298145 - 0.0005,
      east:  -118.52879691240929 + 0.0005,
      west:  -118.52879691240929 - 0.0005
    }
  },
  {
    name: "Manzanita Hall",
    bounds: {
      north: 34.23779666466137 + 0.0005,
      south: 34.23779666466137 - 0.0005,
      east:  -118.53028767383519 + 0.0005,
      west:  -118.53028767383519 - 0.0005
    }
  },
  {
    name: "Citrus Hall",
    bounds: {
      north: 34.239295332886314 + 0.0005,
      south: 34.239295332886314 - 0.0005,
      east:  -118.52799657115645 + 0.0005,
      west:  -118.52799657115645 - 0.0005
    }
  }
];
 
// ---- Game variables ----
var map;
var currentQ = 0;  // tracks which question we are on
var score = 0;     // tracks how many the user got correct
 
// ---- Timer variables ----
var timerInterval = null;
var seconds = 0;
 
// ---- Best time for extra credit ----
var bestTime = null;
 
 
// Initialize the map when the page loads
function initMap() {
 
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 34.2414, lng: -118.5289 },
    zoom: 15,
 
    // Turn off all panning and zooming
    disableDefaultUI: true,
    scrollwheel: false,
    draggable: false,
    disableDoubleClickZoom: true,
    gestureHandling: "none",
 
    // Lock the map to CSUN campus only
    restriction: {
      latLngBounds: {
        north: 34.2470,
        south: 34.2355,
        east: -118.5190,
        west: -118.5390
      },
      strictBounds: false
    }
  });
 
  // Listen for double click on the map
  map.addListener("dblclick", function(event) {
    handleAnswer(event.latLng);
  });
 
  // Start timer and show first question
  startTimer();
  showQuestion();
}
 
 
// Show the current question in the log panel
function showQuestion() {
  addLog("Where is " + locations[currentQ].name + "?", "question");
}
 
 
// Called when the user double clicks on the map
function handleAnswer(latLng) {
 
  // Stop if all questions are done
  if (currentQ >= locations.length) return;
 
  var loc = locations[currentQ];
  var b = loc.bounds;
  var lat = latLng.lat();
  var lng = latLng.lng();
 
  // Check if click is inside the correct bounding box
  var isCorrect = lat >= b.south && lat <= b.north &&
                  lng >= b.west  && lng <= b.east;
 
  // Draw rectangle on the map - green if correct, red if wrong
  new google.maps.Rectangle({
    bounds: {
      north: b.north,
      south: b.south,
      east: b.east,
      west: b.west
    },
    fillColor: isCorrect ? "green" : "red",
    fillOpacity: 0.4,
    strokeColor: isCorrect ? "green" : "red",
    strokeWeight: 2,
    map: map
  });
 
  // Alert the user and log the result
  if (isCorrect) {
    score++;
    alert("Your answer is correct!!");
    addLog("Your answer is correct!!", "correct");
  } else {
    alert("Sorry, wrong location.");
    addLog("Sorry, wrong location.", "wrong");
  }
 
  currentQ++;
 
  // Go to next question or end the game
  if (currentQ < locations.length) {
    showQuestion();
  } else {
    endGame();
  }
}
 
 
// Add a line to the answer log in the panel using jQuery
function addLog(text, type) {
  var div = $("<div>").addClass("log-item " + type).text(text);
  $("#log").append(div);
}
 
 
// Show the final score and stop the timer
function endGame() {
  stopTimer();
 
  var wrong = locations.length - score;
  var timeStr = formatTime(seconds);
 
  // Check if this is a new best time
  var bestMsg = "";
  if (bestTime === null || seconds < bestTime) {
    bestTime = seconds;
    bestMsg = " New best time!";
  }
 
  // Show final score in the panel using jQuery
  $("#final-score").text(score + " Correct, " + wrong + " Incorrect\nTime: " + timeStr + bestMsg);
 
  // Show the play again button using jQuery
  $("#play-again-btn").show();
 
  // Alert the final result
  alert(score + " Correct, " + wrong + " Incorrect! Time: " + timeStr + bestMsg);
}
 
 
// ---- Timer functions ----
 
function startTimer() {
  seconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(function() {
    seconds++;
    updateTimerDisplay();
  }, 1000);
}
 
function stopTimer() {
  clearInterval(timerInterval);
}
 
// Update timer display using jQuery
function updateTimerDisplay() {
  $("#timer-display").text(formatTime(seconds));
}
 
// Convert seconds into M:SS format
function formatTime(s) {
  var m = Math.floor(s / 60);
  var sec = s % 60;
  if (sec < 10) {
    sec = "0" + sec;
  }
  return m + ":" + sec;
}
 
 
// Reset everything and start a new game
function restartGame() {
  currentQ = 0;
  score = 0;
 
  // Clear the log and hide end game elements using jQuery
  $("#log").empty();
  $("#final-score").text("");
  $("#play-again-btn").hide();
 
  // Re-initialize map to clear the rectangles
  initMap();
}
 
 
// Start the game when the page loads
window.onload = initMap;