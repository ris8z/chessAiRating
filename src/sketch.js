const squareSize = 50;

let currentPlayer = "w";
let isGameOver = false;
let waitingForMove = false; // to prevent duplicate moves.

const aiWhite = "https://chess-stockfish-16-api.p.rapidapi.com/chess/api";
const aiBlack = "https://chess-stockfish-16-api.p.rapidapi.com/chess/api";

function setup() {
    createCanvas(8 * squareSize, 8 * squareSize);
}

function draw() {
    background(220);
    drawBoard();
    drawPieces();

    if (!isGameOver && !waitingForMove) {
        waitingForMove = true; // lock until current move is done.

        setTimeout(() => {
            playTurn();
        }, 200); // wait 1s between calls so we do not get banned.
    }
}

function drawBoard() {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if ((x + y) % 2 === 0) {
                fill(240); // white
            } else {
                fill(100); // black
            }
            rect(x * squareSize, y * squareSize, squareSize, squareSize);
        }
    }
}

function drawPieces() {
    const board = chess.board(); // get the board as matrix
    textSize(squareSize * 0.8);
    textAlign(CENTER, CENTER);

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece) {
                const symbol = piece.type.toUpperCase();
                fill(piece.color === "w" ? 0 : 255);
                text(
                    symbol,
                    x * squareSize + squareSize / 2,
                    y * squareSize + squareSize / 2,
                );
            }
        }
    }
}

async function playTurn() {
    const endpoint = currentPlayer === "w" ? aiWhite : aiBlack;
    const fen = chess.fen();

    try {
        const move = await getMove(fen, endpoint);

        if (!chess.move(move))
            throw new Error(`Invalid move from API: ${JSON.stringify(move)}`);
        
        console.log(`${currentPlayer === "w" ? "White" : "Black"} played {from:${move.from} to:${move.to}}`);

        if (chess.isGameOver())
            evaluateWinner();
         
        currentPlayer = currentPlayer === "w" ? "b" : "w"; //change the turn of the player
    } 
    catch (error) {
        console.log("Error while the api call: ", error);
    }
    finally {
        waitingForMove = false; // unlock so the next move can be done.
    }
}

async function getMove(fen, url) {
    const data = new FormData();
    data.append("fen", fen);

    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": "a4fef1ee6fmshb40f31ccdbfdd52p19565bjsn14ca66e0e06f",
            "x-rapidapi-host": "chess-stockfish-16-api.p.rapidapi.com",
        },
        body: data,
    };

    const response = await fetch(url, options);
    const dataBack = await response.json();
    const bestMove = dataBack.bestmove;
    const from = bestMove.slice(0, 2);
    const to = bestMove.slice(2, 4);

    return { from, to };
}

function evaluateWinner(){
    isGameOver = true;

    if(chess.isCheckmate()){
        const winner = currentPlayer === "w" ? "Balck": "White"; //whoever is the turn is not the winner
        console.log(`Game over: ${winner} wins by checkmate`);
    }
    else if (chess.isDraw()){
        console.log(`Game over due too draw`);
    }
    else{
        console.log(`Game over due too strange condition`);
    }

    console.log("PNG: ", chess.png());
}
