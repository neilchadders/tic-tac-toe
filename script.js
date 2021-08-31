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

const cells = document.querySelectorAll('.cell'); // Creates an array of the cells//Scope


startGame();

function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys()) //This creates an array with the numbers 1-8
	
	for (var i = 0; i<cells.length; i++){
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false); //false here refers to useCapture - not needed in modern browsers and would normally always be false anyway- don't worry about it
	}
}


function turnClick(square) {
	turn(square.target.id, huPlayer)
}



function turn (squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText =player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

function checkWin(board,player){
	let plays = board.reduce((a,e,i)=> //Reduce method will go through the board array and give one value.
										//a = accumulator, e = element in board array that we are going through
										// i = index
										//Goes through cells that have already been played in

		(e = player)) ? a.concat(i) : a,[];
	let gameWon = null;
	for (let [index,win] of winCombos.entries()){  //index and win gives the index and winning array of winCombos
		if (win.every(elem => plays.indexOf(elem > -1)))
	}
}