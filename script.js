

var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell'); // Creates an array of the cells//remember scope
startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()); //This creates an array with the numbers 0-8
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false); //false here refers to useCapture - not needed in modern browsers and would normally always be false anyway- don't worry about it
	}
}

	/*1) StartGame() selects the endgame element and set display to none.
	2) OrigBoard set to an array of 0-8
	3) Loops through the cells array and sets each index to an empty string,
	removes the background property colour - essentially makes the cell blank for the start of the game
	4) Finally, and adds event listener which triggers
	turnClick() function. */


function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

/* The square argument is just the click event and so square.target.id is the square that's clicked on

Also, the reason turnClick calls the turn function and we don't just go from startGame function 
to the turn() function is that turn function cam be called either by human playe or AI player 


if (typeof origBoard[square.target.id] == 'number')  - remember that origboard is an array of numbers and that
the players are either X or O - so if square.target.id = 'number' it means square not clicked on */

function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

/*	squareId == square.target.id and player == huPlayer / aiPlayer
  
  	origBoard[squareId] = player; - locates the square clicked on - origBoard is an array + squareId == index;
	document.getElementById(squareId).innerText =player; --- changes the html to O (huPlayer) or X (ai);

	
	let gameWon = checkWin(origBoard, player) - on each turn checks if a win by calling checkWin function
	if (gameWon) gameOver(gameWon) - then calls this funcion */

function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
		(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

/*checkWin(board,player) - board refers to origBoard but not stating origBoard as later on this
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
to see if they are greater than -1 - remember array.indexOf() will retrn -1 if the value passed in is not in the array*/



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
	document.querySelector(".endgame .text").innerText = who; // 'who' being you or AI
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

/* Filters every element in the original board to see if the 'typeof' element === number
if is a number we return that number - so all the square that === number are empty, but if X or O then not empty.
bestSpot() below will then search for first square that is NOT empty*/ 



function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}
// Result of minimax is an object


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

/* To check if a tie we use use emptySquares function. If length === 0 then all squares filled.
As after each turn a win is checked there will be a tie if by the time every square filled checkWin
has found no winner

for loop will go through each cell and change background to green, then remove event listener
so player can no longer click

if the'if' statement == true then declareWinner function called


*/


//Minimax Function

function minimax(newBoard, player) {
	var availSpots = emptySquares(); //find the available indexes on the board using empty squares function - makes list of empty spots

	if (checkWin(newBoard, huPlayer)) {  // Checks for terminal states ie win, lose
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) { // if huPlayer win  = -10, Ai = 10, tie = 0
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}

	//now we need to collect empty squares to evaluate later
	
	var moves = [];  //Empty Array
	for (var i = 0; i < availSpots.length; i++) { //Loops through empty spots
		var move = {};
		move.index = newBoard[availSpots[i]];  // Collect the info in empty object
		newBoard[availSpots[i]] = player; //Set the index number of empty spot that was stored as number on origboard to the index property of move object


		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);  // //set empty spot on newboard to current player + new board and call minimax
			move.score = result.score; // Store the info in move obj
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;  //IF MINIMAX DOES NOT FIND TERMINAL STATE - CALLED RECURSIVELY
		}

		newBoard[availSpots[i]] = move.index; // minimax resets new board and pushes move obj to move arr
		moves.push(move);
	}

	var bestMove;  // minmax now evaluates best move in moves array - should choose highest score when ai playing -- lowest when human playing
	if(player === aiPlayer) {
		var bestScore = -10000;  // So if AI playing sets very low number and loops through moves array
		for(var i = 0; i < moves.length; i++) {  //If move higher than bestScore, then minimax stores that move
			if (moves[i].score > bestScore) {  //If moves with similar score, only first one stored
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {  //SAme as above but opposite - so bestScore is high and minmax looks for lowest score 
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];  //At the end minmax returns the object stored in best move
}


/* FURTHER NOTES

