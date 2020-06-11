var numSquares = 6;
var colors = [];
var pickedColor;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.getElementById('colorDisplay');
var msgDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var playAgain = document.querySelector(".reset");
var modeBtns = document.querySelectorAll(".mode");

init();

//Add rest (Play Again) event
playAgain.addEventListener("click", function(){
  reset();
});



// Function Definitions
function init(){
  modeSetups();
  squaresColorsSetup();
  reset();
}

function modeSetups(){
  for (var i = 0; i < modeBtns.length; i++) {
    modeBtns[i].addEventListener("click", function(){
      modeBtns[0].classList.remove("selected");
      modeBtns[1].classList.remove("selected");
      this.classList.add("selected");
      this.textContent === "EASY" ? numSquares = 3 : numSquares = 6;
      reset();
    });
  };
};

function squaresColorsSetup(){
  for (var i = 0; i < squares.length; i++) {

    //Add click events listeners to squares
    squares[i].addEventListener("click", function(){

      var clickedColor = this.style.backgroundColor;
      if (clickedColor === pickedColor) {
          msgDisplay.textContent = "Correct!";
          msgDisplay.style.color = "#048b55";
          playAgain.textContent = "Play Again ?"
          changeColor(clickedColor);
          h1.style.backgroundColor = clickedColor;
      }else{
        this.style.backgroundColor = "#232323";
        msgDisplay.textContent = "Try Again!";
        msgDisplay.style.color = "#f93f37";
      };
    });
  };
};

function reset(){
  msgDisplay.textContent = "";
  playAgain.textContent = "New Colors";
  //generate all new colors
  colors = generateRandomColors(numSquares);
  //pick a new random color from array
  pickedColor = pickColor();
  //change colorDisplay to match picked Color
  colorDisplay.textContent = pickedColor;
  //change colors of squares
  for(var i = 0; i < squares.length; i++) {
    squares[i].style.background = colors[i];

    if(colors[i]) {
      squares[i].style.display = "block";
			squares[i].style.background = colors[i];
		} else {
			squares[i].style.display = "none";
		};
  }
  h1.style.background = "#647de8";
};

function changeColor(color){
  //Loop through all the squares
  for (var i = 0; i < colors.length; i++) {
    //Change each color to match given color
    squares[i].style.backgroundColor = color;
  }
}

function pickColor(){
  var random = Math.floor(Math.random() * colors.length);
  return colors[random];
}

function generateRandomColors(num){
  //Make an array
  var arr = [];
  //Add NUM RANDOM COLORS TO ARRAY
  for (var i = 0; i < num; i++) {
    //get random color and push into arr
    arr.push(randomColor());
  }
  return arr;
}

function randomColor(){
  //Pick a "red" from 0 - 255
  var r = Math.floor(Math.random()*256);

  //Pick a "green" from 0 - 255
  var g = Math.floor(Math.random()*256);

  //Pick a "blue" from 0 - 255
  var b = Math.floor(Math.random()*256);

  return "rgb("+ r + ", " + g +", "+ b +")";
}
