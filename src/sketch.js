const squareSize = 50;

function setup() {
    createCanvas(8 * squareSize, 8 * squareSize);
    console.log(chess.fen()); 
}

function draw() {
    background(220);
    drawBoard();
    drawPieces();
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
