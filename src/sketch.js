let c = new Chess();
//let chess;
//let squareSize = 50;
//
//function setup() {
//    createCanvas(8 * squareSize, 8 * squareSize);
//}
//
//function draw() {
//    background(255); // Sfondo bianco
//    drawBoard();
//}
//
//function drawBoard() {
//    for (let x = 0; x < 8; x++) {
//        for (let y = 0; y < 8; y++) {
//            if ((x + y) % 2 == 0) {
//                fill(240);
//            } else {
//                fill(100);
//            }
//            rect(x * squareSize, y * squareSize, squareSize, squareSize);
//        }
//    }
//}
//
//function drawPieces() {
//    const board = chess.board(); // Ottieni lo stato della scacchiera da Chess.js
//    textSize(squareSize * 0.8);
//    textAlign(CENTER, CENTER);
//    for (let y = 0; y < 8; y++) {
//        for (let x = 0; x < 8; x++) {
//            const piece = board[y][x];
//            if (piece) {
//                const symbol = piece.type === "p" ? "P" : piece.type.toUpperCase();
//                fill(piece.color === "w" ? "black" : "white");
//                text(
//                    symbol,
//                    x * squareSize + squareSize / 2,
//                    y * squareSize + squareSize / 2,
//                );
//            }
//        }
//    }
//}
