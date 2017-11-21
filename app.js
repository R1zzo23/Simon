// global variables

var correctPattern       = [];
var correctPatternSounds = [];
var playerInput          = [];
var count                = 0;
var strictMode           = false;
var patternPlayback      = false;

$(document).ready(function() {

});

function playSoundArray(arr) {
  var audio = new Audio();
  var i = 0;
  var playlist = arr;
  audio.addEventListener('ended', function() {
    i = i++ < playlist.length ? i : 0;
    audio.src = playlist[i];
    audio.play();
  }, true);
  audio.volume = 0.3;
  audio.loop = false;
  audio.src = arr[0];
  audio.play();
  patternPlayback = false;
}

function toggleStrictMode() {
  var yesToggle;
  if (strictMode) {
    yesToggle = confirm("Are you sure you want to turn off strict mode? The game will reset.");
    if (yesToggle) {
      strictMode = false;
      document.getElementById('btnStrictMode').innerHTML = "Strict Mode: OFF";
    }
  } else if (!strictMode) {
    yesToggle = confirm("Are you sure you want to turn on strict mode? The game will reset.");
    if (yesToggle) {
      strictMode = true;
      document.getElementById('btnStrictMode').innerHTML = "Strict Mode: ON";
    }
  }
  startGame();
}
//starts the game
function startGame() {
  correctPattern = [];
  correctPatternSounds = [];
  playerInput = []
  count = 0;
  //#playerInput and #correctPattern are for developers only
  //both can be deleted once animations are added in properly
  //for now they are used to see the correct patterns and
  //player's input for testing purposes only
  document.getElementById('playerInput').innerHTML = playerInput;
  document.getElementById('correctPattern').innerHTML = correctPattern;
  document.getElementById('count').innerHTML = count;
  nextButton();
}
//randomly assign the next button to the pattern
function nextButton() {
  var nextButton = Math.floor(Math.random() * 4) + 1;
  //push correct audio clip to the array
  pushSoundToArray(nextButton, correctPatternSounds);
  correctPattern.push(nextButton);
  //show correctPattern sequence for testing
  //can delete this once we have animation for buttons
  document.getElementById('correctPattern').innerHTML = correctPattern
  patternPlayback = true;
  toggleButtonDisable();
  playSoundArray(correctPatternSounds);
  //timer to keep buttons disabled while playback is going on
  setTimeout(function() {
    toggleButtonDisable();
  }, (1300 * correctPattern.length));
}

//disables buttons to allow the pattern to play without
//user pushing buttons and having sounds overlap
function toggleButtonDisable() {
  if (patternPlayback) {
    document.getElementById('button1').disabled = true;
    document.getElementById('button2').disabled = true;
    document.getElementById('button3').disabled = true;
    document.getElementById('button4').disabled = true;
  }
  else if (!patternPlayback) {
    document.getElementById('button1').disabled = false;
    document.getElementById('button2').disabled = false;
    document.getElementById('button3').disabled = false;
    document.getElementById('button4').disabled = false;
  }
}

//plays a sound for each player pick
function playSound(num) {
  var singleArray = [];
  pushSoundToArray(num, singleArray);
  playSoundArray(singleArray);
}

//function to add correct audio clip to specific array
//created this because code below was used multiple times in file
function pushSoundToArray(number, targetArray){
  if (number == 1) {
    targetArray.push("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3");
  }
  else if (number == 2) {
    targetArray.push("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3");
  }
  else if (number == 3) {
    targetArray.push("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3");
  }
  else if (number == 4) {
    targetArray.push("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3");
  }
}

//plays sound, lights up piece and pushes that value to playerInput[]
function playerPress(num) {
  //code to light up piece that was pressed
  playerInput.push(num);
  playSound(num);
  document.getElementById('playerInput').innerHTML = playerInput;
  if (playerInput.length == correctPattern.length) {
    checkInput(playerInput, correctPattern);
  }
}

//comparison between playerInput[] and correctPattern[] to see if right or wrong
function checkInput(playerInput, correctPattern) {
  var patternIsCorrect = true;
  for (var i = 0; i < playerInput.length; i++) {
    if (playerInput[i] !== correctPattern[i]) {
      patternIsCorrect = false;
      break;
    }
  }
  if (patternIsCorrect == true) {
    count++;
    if (count == 20) {
      alert("Congratulations! You win!");
      startGame();
    } else {
      //allows player inputs to finish playing before playing they
      //pattern for the next turn
      setTimeout(function() {
        document.getElementById('count').innerHTML = count;
        playerInput.length = 0;
        document.getElementById('playerInput').innerHTML = playerInput;
        nextButton();
      }, 1500);
    }
  } else if (patternIsCorrect == false) {
    if (strictMode == true) {
      //game ends
      alert("Game over! Better luck next time!");
      startGame();
    } else {
      //empty playerInput so they can try again
      alert("Incorrect! Try again!");
      playerInput.length = 0;
      document.getElementById('playerInput').innerHTML = playerInput;
      playSoundArray(correctPatternSounds);
    }
  }
}
