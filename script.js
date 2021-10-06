var origBoard;
const huPlayer = '0';
const aiPlayer = 'x';
const winCombos = [
[0,1,2],
[3,4,5],
[6,7,8],
[0,3,6],
[1,4,7],
[2,5,8],
[0,4,8],
[6,4,2]
]

const cells = document.querySelectorAll('.cell'); // Creates an array of the cells//remember scope


startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()) //This creates an array with the numbers 0-8
	
	for (var i = 0; i<cells.length; i++){
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false); //false here refers to useCapture - not needed in modern browsers and would normally always be false anyway- don't worry about it
	}
}

/* 	1) StartGame() selects the endgame element and set display to none.
	2) OrigBoard set to an array of 0-8
	3) Loops through the cells array and sets each index to an empty string,
	removes the background property colour - essentially makes the cell blank for the start of the game
	4) Finally, and adds event listener which triggers
	turnClick() function. */




function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkTie()) turn(bestSpot(), aiPlayer);
	}
}
/* The square argument is just the click event and so square.target.id is the square that's clicked on

Also, the reason turnClick calls the turn function and we dont just go from startGame function 
to the turn() function is that turn function cam be called either by human playe or AI player 


if (typeof origBoard[square.target.id] == 'number')  - remember that origboard is an array of numbers and that
the payers are either X or O - so if square.target.id = 'number' it means square not clicked on

*/ 


function turn (squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText =player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

/*	squareId == square.target.id and player == huPlayer / aiPlayer
  
  	origBoard[squareId] = player; - locates the square clicked on - origBoard is an array + squareId == index;
	document.getElementById(squareId).innerText =player; --- changes the html to O (huPlayer) or X (ai);

	
	let gameWon = checkWin(origBoard, player) - on each turn checks if a win by calling checkWin function
	if (gameWon) gameOver(gameWon) - then calls this funcion

	*/

function checkWin(board,player) {
	let plays = board.reduce((a,e,i) =>
		(e === player) ? a.concat(i) : a, []);
		let gameWon = null;
		for (let [index, win] of winCombos.entries()){
			if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
		return gameWon;

}

/* checkWin(board,player) - board refers to origBoard but not stating origBoard as later on this
function will take board arguments that are different versions of current origBoard 

let plays = board.reduce((a,e,i)=> 
(e === player)) ? a.concat(i) : a,[]);  /// this section of code tells us which squares have been played in


Reduce method will go through each element of the the board array and give one value.
a = accumulator. The single value we will get at the end, initialised to an empty array
e = element in board array that we are going through
i = index goes through cells that have already been played in

(e === player)) ? a.concat(i) : a,[]) 
- IF e is the player then index is added to the accumulator array,
if e is NOT the player then just the accumulator is returned

for (let [index, win] of winCombos.entries())
- This will loop through winCombos and .entries() will give both an index and value(ie the win combo as an array iterator)

if (win.every(elem => plays.indexOf(elem > -1))) 
- This part of the code tells you if the player has played on each part of the board that would count as a win

- Goes through each element of win  - ie the winCombo array that wins

- nb array.indexOf() - goes through an array and returns position of what is passed in. 
Returns -1 if not there

=> plays.indexOf(elem > -1))) - this part then checks all the places that the player has played in,
to see if they are greater than -1 - remember array.indexOf() will retrn -1 if the value passed in is not in the array


*/

function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
			gameWon.player == huPlayer ? "blue" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}


/*

 function gameOver(gameWon)  =gameWon is from checkWin() function  see -- gameWon = {index: index, player: player};

 So we have two for loops - 
 1) highlights all the squares that are part of the winning combination.
 2) We want to ensure user cannot click any more squares because game is over

for (let index of winCombos[gameWon.index]) - we are going to ge through every index of the win combo
then add the winners colour		

 */



function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return emptySquares()[0];
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}