const gameContainer = document.getElementById("game");
let startButton = document.querySelector('.start-form');
const header = document.querySelector('.header');
const scoreBoard = document.createElement('div');
const highScore = document.createElement('div');
let pairs = 0;
let shuffledColors = [];
let COLORS = [];

function rndcolor(){
  let x = Math.floor(Math.random()*256);
  let y = Math.floor(Math.random()*256);
  let z = Math.floor(Math.random()*256);
  COLORS = COLORS.concat(`rgb(${x},${y},${z})`,`rgb(${x},${y},${z})`);
}

function rndColorArray(x){
  for (let i = 0; i < x; i++){
    rndcolor();
  }
}

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want to research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}



// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");
    newDiv.style.backgroundColor = 'white';
    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
    }
  //my scoreboard element
  if (localStorage.getItem('score') != undefined){
    highScore.innerText = `Highscore: ${localStorage.getItem('score')}`;
    highScore.classList.add('scoreboard');
    header.append(highScore);
    scoreBoard.innerText = `Attempts: ${score}`;
    scoreBoard.classList.add('scoreboard');
    header.append(scoreBoard);
  }
  else{
    scoreBoard.innerText = `Attempts: ${score}`;
    scoreBoard.classList.add('scoreboard');
    header.append(scoreBoard);
  }
}
// TODO: Implement this function!
function handleCardClick(event) {
  // you can use event.target to see which element was clicked
  // console.log("you just clicked", event.target);
  
  //my code:
  //keeps track of clicks
  clickCount ++;
//stops fucntion of they click too fast
  if (clickCount > 2 ){
    return console.log('too fast');
  }
//this is for first value to be input correctly
//without it the function wasn't running
  else if (!previousClick.classList){
    if (event.target.classList[1] === 'done'){
      clickCount = 0;
      previousClick = '';
      return console.log('already matched tile');
    }
    event.target.style.backgroundColor = event.target.classList[0];
    previousClick = event.target;
  }
//this is for when the colors don't match
  else if (clickCount === 2 && previousClick.classList[0] !== event.target.classList[0]){
    //to prevent already matched card from being used
    if (event.target.classList[1] === 'done'){
      clickCount = 1;
      return console.log('already matched tile');
    }

   else {
    event.target.style.backgroundColor = event.target.classList[0];
    console.log('no match');
    //this placeholder click is incase someone clicks during the delay and breaks
    let placeHolderClick = previousClick;
   setTimeout(function(){
        event.target.style.backgroundColor = 'white';
        placeHolderClick.style.backgroundColor = 'white';
        clickCount = 0;
   }, 1000)
    previousClick = '';
    score ++;
    scoreBoard.innerText = `Attempts: ${score}`;
  }}
//this is for when the colors do match, the click count and previous click value get cleared
  else if (previousClick.classList[0] === event.target.classList[0]){
    event.target.style.backgroundColor = event.target.classList[0];
    previousClick.classList.add('done');
    event.target.classList.add('done');
    clickCount = 0;
    previousClick = '';
    score ++;
    scoreBoard.innerText = `Attempts: ${score}`;
    console.log('score: ', score);
    //reset button creation
    for (let i in shuffledColors){
      //i had to use replace all because the rgb was getting spaces added to it, when it is applied as a background color
      if (gameContainer.children[i].style.backgroundColor.replaceAll(' ','') === shuffledColors[i]){
        colorCount ++;
      }
      else (colorCount = 0)

      if (colorCount === shuffledColors.length){
       
        let restartButton = document.createElement('button');
        restartButton.innerText = 'Restart';
        restartButton.classList.add('restart-button');
        gameContainer.append(restartButton);

        restartButton.addEventListener('click', function(e){
          restartButton.remove();
          gameContainer.innerHTML = '';
          createDivsForColors(shuffledColors);
          score = 0;
          scoreBoard.innerText = `Attempts: ${score}`;
        })
        
        //storing the high score
        if(!localStorage.getItem('score'))
          localStorage.setItem('score', score);
        if(score < parseInt(localStorage.getItem('score')))
          localStorage.setItem('score', score);
        
         //to stop the restart button from continued creation
         colorCount++;
      }
    }
  }
}

let score = 0;
let clickCount = 0;
let previousClick = '';
let colorCount = 0;

// start button
startButton.addEventListener('click', function(e){
    if (e.target.tagName === 'BUTTON'){
      numberOfPairs = document.querySelector('input[type=number]');
      pairs = parseInt(numberOfPairs.value);
      rndColorArray(pairs);
      shuffledColors = shuffle(COLORS);
      createDivsForColors(shuffledColors);
      startButton.remove();
      resetHighscore.remove();
    }
})

//reset highscore button effect
const resetHighscore = document.querySelector('#resethighscore');
resetHighscore.addEventListener('click', function(){
    localStorage.clear();
})