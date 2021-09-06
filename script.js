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
	turn(square.target.id, huPlayer)
}

/* The square argument is just the click event and so square.target.id is the square that's clicked on

Also, the reason turnClick calls the turn function and we dont just go from startGame function 
to the turn() function is that turn function cam be called eitheby human playe or AI player*/ 


function turn (squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText =player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board,player){
	let plays = board.reduce((a,e,i)=> // see notes on reduce below

		(e === player)) ? a.concat(i) : a,[]);
	let gameWon = null;
	for (let [index,win] of winCombos.entries()){  //index and win gives the index and winning array of winCombos
		if (win.every(elem => plays.indexOf(elem > -1)) {
			gameWon = {index: index, player:player};
			break;
			})
		}
		return gameWon;
	}

/*Reduce method will go through the board array and give one value.
a = accumulator, e = element in board array that we are going through
i = index goes through cells that have already been played in*/

