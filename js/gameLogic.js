import { cols, csvToArray } from './csvReader.js'; // Adjust the path as needed
import { randomIndexGenerator } from './utilities.js'; // Adjust the path as needed

const MAX_HINTS = 10; 

var gameWon = false; 
var score = 99;
var correctAnswer = "";
var displayAnswer = "";

var players = [];
var numHints = 0;  // see line 25
var usedHints = [0, 1, 2];

var startButton = document.getElementById('start-button');
var hint = document.getElementById('hints');
var scoreText = document.getElementById('score');
var guessContainer = document.getElementById('guess-container');
var textInput = document.getElementById('text-input');
var guessButton = document.getElementById('guess-button');



// CLICK START
startButton.addEventListener('click', function() {
    console.log('button clicked');
    startGame();
});

async function startGame() {
    updateDOM();
    score = 99; 
    numHints = 0; 
    usedHints = [0, 1, 2];

    try {
        // Await the csvToArray promise to ensure players are loaded
        players = await csvToArray(cols);

        // Ensure players is defined and has content before proceeding
        if (players.length === 0) {
            throw new Error('No players loaded from CSV.');
        }

        const player = getRandomPlayer();
        gameLoop(player);

    } catch (error) {
        console.error('Error starting the game:', error);
    }
}

function updateDOM() {
    console.log("updating DOM");
    // show guess interface
    guessContainer.style.display = 'block';
    startButton.style.display = 'none';
    scoreText.innerText = score;
}

function gameLoop(player) {
    var guess;
    correctAnswer = player[2];
    displayAnswer = player[1];
    
    showNewHint(player);

    guessButton.addEventListener('click', () => {
        var isCorrectGuess = handleUserGuess(player);

        if (!isCorrectGuess) {
            guess = textInput.value.trim().toLowerCase();
            console.log("new score: "+score);
            updateDOM();
            updateIncorrectGuesses(guess);
            showNewHint(player);
            
            score -= 3; 
        }
        else {
            endGame();
        }
    });
}

function showNewHint(player) {
    numHints = numHints + 1; 

    if (numHints <= MAX_HINTS) {
        console.log('number of hints:' + numHints);
        hints.innerHTML += "<br><strong>" + numHints + "</strong>. " + getRandomHint(player) + "\n";
    }
}

function getRandomPlayer() {
    console.log('getting random player!');

    var randomRow = players[randomIndexGenerator(players.length)]

    console.log(randomRow);
    return randomRow; 
}

function getRandomHint(player) {
    console.log("Correct Answer: " + correctAnswer);

    var hintCategories = players[0];
    var playerCategories = player;

    var randomIndex = 0; 

    while (usedHints.includes(randomIndex)) {
        randomIndex = randomIndexGenerator(hintCategories.length);
    }

    usedHints.push(randomIndex);

    var randomCategory = hintCategories[randomIndex];

    if (hintCategories.length == 0) {
        return "NO MORE GUESSES"; 
    }

    if (randomCategory === null || randomCategory === undefined || randomCategory === "") {
        usedHints.push(randomIndex);
        getRandomHint(player);
    }

    console.log("Random Category: "+ randomCategory + "Matching Player Attribute: " + playerCategories[randomIndex]);
    
    return "<strong>" + randomCategory+ ": </strong>" + playerCategories[randomIndex];
}

function handleUserGuess(player) {
    var userInput = textInput.value.trim().toLowerCase(); // Get and trim the input to remove any extra spaces

    var answer = correctAnswer.toLowerCase();
    console.log("Answer: " + answer);
    var normalizedAnswer = normalizeText(answer); 

    var shortAnswer = displayAnswer.toLowerCase();
    var normalizedShortAnswer = normalizeText(shortAnswer); 


    var userInput = textInput.value.trim().toLowerCase(); // Get and trim the input to remove any extra spaces
    console.log("USER INPUT: " + userInput);

    if(((answer.includes(userInput) || normalizedAnswer.includes(userInput)) || (shortAnswer.includes(userInput) || normalizedShortAnswer.includes(userInput))) && userInput.length > 3) {
        alert("GAME OVER. YOU WIN!!! THE CORRECT ANSWER WAS: " + displayAnswer);
        return true; 
    }
    if (numHints == 10) {
        alert("GAME OVER. YOU LOSE!! THE CORRECT ANSWER WAS: " + displayAnswer);
        endGame();
    }
    alert("TRY AGAIN.");
    return false; 
}

function endGame() {
    console.log("ENDING GAME... Thanks for playing!!!");

    // hide guess container
    guessContainer.style.display = 'none';

    var playAgainButton = document.getElementById('play-again');
    playAgainButton.style.display = 'block';

    playAgainButton.addEventListener('click', function() {
        location.reload();
    });
}

function updateIncorrectGuesses(guess) {
    var userInput = textInput.value.trim(); // Get and trim the input to remove any extra spaces
    var badGuesses = document.getElementById('bad-guesses');

    badGuesses.innerHTML += "<br>" + guess; 
}

function normalizeText(text) {
    return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}