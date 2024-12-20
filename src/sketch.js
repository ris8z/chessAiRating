const squareSize = 50;

let currentPlayer = "w";
let isGameOver = false;
let waitingForMove = false; // to prevent duplicate moves.

let maxMoves = 50; // to get an actual winner
let moveCount = 0;

let isSimulationOn = false;

const aiWhite = "https://chess-stockfish-16-api.p.rapidapi.com/chess/api";
const aiBlack = "https://chess-move-maker.p.rapidapi.com/chess";

function setup() {
    const canvas = createCanvas(8 * squareSize, 8 * squareSize);
    canvas.parent("sketch"); // attach the canvas to the container
}

function draw() {
    background(220);
    drawBoard();
    drawPieces();

    if (!isGameOver && !waitingForMove && isSimulationOn) {
        waitingForMove = true; // lock until current move is done.

        setTimeout(() => {
            playTurn();
        }, 2000); // wait 1s between calls so we do not get banned.
    }
}

function drawBoard() {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if ((x + y) % 2 === 0) {
                fill(215); // white
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

    const pieceSymbols = {
        p: "♟", n: "♞", b: "♝", r: "♜", q: "♛", k: "♚", // Bold pieces
        P: "♙", N: "♘", B: "♗", R: "♖", Q: "♕", K: "♔"  // Slim pieces
      };

    for (let y = 0; y < 8; y++) {
        for (let x = 0; x < 8; x++) {
            const piece = board[y][x];
            if (piece) {
                const symbol =  pieceSymbols[piece.type];
                stroke(0); // bord color black 
                fill(piece.color === "w" ? 255 : 0);
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
        
        console.log(`(${moveCount}) -> ${currentPlayer === "w" ? "White" : "Black"} played {from:${move.from} to:${move.to}}`);

        moveCount++;
        if (moveCount >= maxMoves){
            evaluateMaterialWinner();
            return;
        }

        
        if (chess.isGameOver()){
            evaluateWinner();
            return;
        }
         
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
    if(url == "https://chess-stockfish-16-api.p.rapidapi.com/chess/api"){
        return stockfishJS(fen);
    }else{
        return chessmovemakerJS(fen);
    }
}

async function chessmovemakerJS(fen){
    const url = "https://chess-move-maker.p.rapidapi.com/chess";

    function fenToBoard(fen) {
        const pieceMap = {
            'p': 'bP', 'r': 'bR', 'n': 'bN', 'b': 'bB', 'q': 'bQ', 'k': 'bK',
            'P': 'wP', 'R': 'wR', 'N': 'wN', 'B': 'wB', 'Q': 'wQ', 'K': 'wK',
        };

        const rows = fen.split(' ')[0].split('/');
        return rows.map(row => {
            const expandedRow = [];
            for (const char of row) {
                if (isNaN(char)) {
                    expandedRow.push(pieceMap[char] || '');
                } else {
                    expandedRow.push(...Array(parseInt(char)).fill(''));
                }
            }
            return expandedRow;
        });
    }

    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": "a4fef1ee6fmshb40f31ccdbfdd52p19565bjsn14ca66e0e06f",
            "x-rapidapi-host": "chess-move-maker.p.rapidapi.com",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            color: "BLACK", 
            positions: fenToBoard(fen), 
        }),
    };

    const response = await fetch(url, options);
    const moves = await response.json();

    if (moves.length > 0) {
        const { from, to } = moves[0];
        return { from, to };
    } else {
        throw new Error("No moves returned by the API");
    }
}

async function stockfishJS(fen) {
    const url = "https://chess-stockfish-17-api.p.rapidapi.com/chess/api";
    const data = new FormData();
    //const peppeKey1 = "a4fef1ee6fmshb40f31ccdbfdd52p19565bjsn14ca66e0e06f"; // the one with github (giving problems)
    const peppekey2 = "b6afcf768dmsh065db0d82936420p13e2f4jsn04b3f64caa77"; // the one with 59299 (hopefully not giving problems)
    data.append("fen", fen);

    const options = {
        method: "POST",
        headers: {
            "x-rapidapi-key": peppekey2,
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

    console.log("PGN: ", chess.pgn());
}

function evaluateMaterialWinner(){
    isGameOver = true;
    console.log("GameOver -:- Rached the max numbers of moves");

    const board = chess.board();
    const material = { "w":0, "b":0 };
    const values = {
        "p": 1,
        "n": 3,
        "b": 4,
        "r": 5,
        "q": 9,
        "k": 0,
    };

    //this is just an idea bc in reality some pices have more value in the corners like the king
    const positionBonus = [
        [-0.50, -0.40, -0.40, -0.40, -0.40, -0.40, -0.40, -0.50],
        [-0.40, -0.20,  0.00,  0.00,  0.00,  0.00, -0.20, -0.40],
        [-0.40,  0.00,  0.10,  0.20,  0.20,  0.10,  0.00, -0.40],
        [-0.40,  0.00,  0.20,  0.25,  0.25,  0.20,  0.00, -0.40],
        [-0.40,  0.00,  0.20,  0.25,  0.25,  0.20,  0.00, -0.40],
        [-0.40,  0.00,  0.10,  0.20,  0.20,  0.10,  0.00, -0.40],
        [-0.40, -0.20,  0.00,  0.00,  0.00,  0.00, -0.20, -0.40],
        [-0.50, -0.40, -0.40, -0.40, -0.40, -0.40, -0.40, -0.50],
    ]

    board.forEach((row, i) => {
        row.forEach((piece, j) => {
            if (piece){ 
                const pieceVal = values[piece.type] ?? 0;
                const positionVal = positionBonus[i][j];
                material[piece.color] += pieceVal + positionVal; 
            }
        })
    });

    console.log(`Materials: White ${material["w"]}, Black ${material["b"]}`);
    if (material.w > material.b){
        console.log("White wins");
    }
    else if (material.w < material.b){
        console.log("Black wins");
    }else{
        console.log("Draws!!!");
    }

    console.log("PGN: ", chess.pgn());
}


//Event listener
document.getElementById("startBtn").addEventListener("click", () => {
    if (!isGameOver && !isSimulationOn){
        isSimulationOn = true;
        console.log("Simulation started now");
    }
});


document.getElementById("pauseBtn").addEventListener("click", () => {
    if (isSimulationOn){
        isSimulationOn = false; 
        console.log("Simluation paused now");
    }
});
