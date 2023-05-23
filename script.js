// ADD FOR PVP MODE

// player chooses the cell
// register the cell to the array
// check winning conditions.
//      if win, display winner and restore the whole board events
//      RESTORE
// display mark on cell
// disable activity on that cell

//WINNING CONDITION CHECK
//the board is represented implemented using an array with the check method. loop the array and check for winning conditions diagonally, horizontally, and vertically


//______________________________________________________________________________________________________________________________________________


const gameController = (() => {
    let scoreBoard = new Array(9);

    //true - playerX || false - playerY
    let turn = true;
    let turns = 0;
    let playerOne;
    let playerTwo;
    const sound = new Audio("sounds/cellSound.mp3");
    const winSound = new Audio("sounds/winSound.mp3");
    const drawSound = new Audio("sounds/drawSound.mp3");
    const playSound = () => sound.play();
    const playWinSound = () => winSound.play();
    const playDrawSound = () => drawSound.play();
    const increaseTurn = function() {
        this.turns++;
    }
    const resetTurn = function() {
        this.turns = 0;
    }
    return {
        scoreBoard,
        turn,
        playerOne,
        playerTwo,
        playWinSound,
        playSound,
        playDrawSound,
        increaseTurn,
        resetTurn,
        turns
    }    
})();

const playerX = () => {
    let score = 0;
    const addScore = () => score+=1;
    const place = () => {return "X"}
    return {
        place,
        addScore,
        score
    }
}

const player0 = () => {
    const {addScore, score} = playerX();
    const place = () => {return "0"};
    return {
        place,
        addScore,
        score
    }
}

function initializePVP() {
    gameController.playerOne = playerX();
    gameController.playerTwo = player0();
}

 function addCellEvents() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.addEventListener('click', (e) => {
            if (cell.getAttribute("data-marked") === "true") {
                return;
            }
             mainEvents(cell);
        })
    })
}

async function mainEvents(cell) {
    cell.setAttribute('data-marked', "true");
    const cellIndex = cell.getAttribute("data-index");
    const currentPlayer = returnPlayerTurn();
    playSound();
    addToScoreBoard(currentPlayer, cellIndex);
    await addMarktoDom(currentPlayer, cell);
    changeTurn();
    if (checkWinner(currentPlayer)){
        playWinningSound();
        displayWinner(currentPlayer);
        disableCells();
        setTimeout(() => {
            refreshGame();
        }, 5000);
    }else if (checkDraw()) {
        playDrawSound();
        displayDraw();
        disableCells();
        setTimeout(() => {
            refreshGame();
        }, 5000);
    }
}

function checkDraw() {
    return gameController.turns === 9;
}

function displayDraw() {
    const currentTurnIndicator = document.querySelector(".current-turn");
    currentTurnIndicator.textContent = "IT'S A DRAW!";
}

function disableCells() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.setAttribute('data-marked', "true");
    })
}

function playSound() {
    gameController.playSound();
}

function playWinningSound() {
    gameController.playWinSound();
}

function playDrawSound() {
    gameController.playDrawSound();
}

function displayWinner(player) {
    const currentTurnIndicator = document.querySelector(".current-turn");
    currentTurnIndicator.textContent = player.place() + " WINS!";

}

function refreshGame() {
    gameController.scoreBoard = new Array(9);
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.setAttribute('data-marked', "false");
        cell.textContent = "";
    })
    const currentTurnIndicator = document.querySelector(".current-turn");
    currentTurnIndicator.textContent = "X's turn!";
    gameController.turn = true;
    gameController.resetTurn();
}


function changeTurn() {
    const player = returnNextTurn();
    const currentTurnIndicator = document.querySelector(".current-turn");
    currentTurnIndicator.textContent = player.place() + "'s turn!";
    
    if (gameController.turn) {
        gameController.turn = false;
    } else {
        gameController.turn = true;
    }
}

function returnPlayerTurn() {
    if (gameController.turn) {
        return gameController.playerOne;
    }
    return gameController.playerTwo;
}

function returnNextTurn() {
    if (!gameController.turn) {
        return gameController.playerOne;
    }
    return gameController.playerTwo;
}

function addToScoreBoard(player, index) {
    gameController.scoreBoard[index] = player.place();
}

async function addMarktoDom(player, cell) { 
    return new Promise((resolve, reject) => {
        cell.textContent = player.place();
        cell.style.fontSize = "48px";
        if (gameController.turn) {
            cell.style.color = "var(--clr-red)";
            resolve();
            return;
        }
        cell.style.color = "var(--clr-blue)";
        resolve();
    })
   
}

function checkWinner(player) {
    const move = player.place();
    gameController.increaseTurn();
    return checkHorizontal(move) || checkVertical(move) || checkDiagonal(move);
}

function checkHorizontal(move) {
    return (gameController.scoreBoard[0] === move && gameController.scoreBoard[1] === move && gameController.scoreBoard[2] === move) ||
    (gameController.scoreBoard[3] === move && gameController.scoreBoard[4] === move && gameController.scoreBoard[5] === move) ||
    (gameController.scoreBoard[6] === move && gameController.scoreBoard[7] === move && gameController.scoreBoard[8] === move);
}

function checkVertical(move) {
    return (gameController.scoreBoard[0] === move && gameController.scoreBoard[3] === move && gameController.scoreBoard[6] === move) ||
    (gameController.scoreBoard[1] === move && gameController.scoreBoard[4] === move && gameController.scoreBoard[7] === move) ||
    (gameController.scoreBoard[2] === move && gameController.scoreBoard[5] === move && gameController.scoreBoard[8] === move);
}

function checkDiagonal(move) {
    return (gameController.scoreBoard[0] === move && gameController.scoreBoard[4] === move && gameController.scoreBoard[8] === move) ||
    (gameController.scoreBoard[2] === move && gameController.scoreBoard[4] === move && gameController.scoreBoard[6] === move);
}

initializePVP();
addCellEvents();


//implement AI