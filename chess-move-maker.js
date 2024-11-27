// Funzione per convertire una FEN in una matrice compatibile con l'API e determinare il turno
function fenToBoardAndTurn(fen) {
    const pieceMap = {
        'p': 'bP', 'r': 'bR', 'n': 'bN', 'b': 'bB', 'q': 'bQ', 'k': 'bK', // pezzi neri
        'P': 'wP', 'R': 'wR', 'N': 'wN', 'B': 'wB', 'Q': 'wQ', 'K': 'wK', // pezzi bianchi
    };

    // Separare la scacchiera dalla FEN e il turno
    const [boardPart, turnPart] = fen.split(' ');

    // Determina il turno dal secondo elemento della FEN ('w' = bianco, 'b' = nero)
    const turn = turnPart === 'w' ? 'WHITE' : 'BLACK';

    // Generare la matrice della scacchiera
    const rows = boardPart.split('/');
    const board = rows.map(row => {
        const expandedRow = [];
        for (const char of row) {
            if (isNaN(char)) {
                // Se è un pezzo, mappalo
                expandedRow.push(pieceMap[char] || '');
            } else {
                // Se è un numero, aggiungi caselle vuote
                expandedRow.push(...Array(parseInt(char)).fill(''));
            }
        }
        return expandedRow;
    });

    return { board, turn };
}

// Esempio di utilizzo
const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const { board, turn } = fenToBoardAndTurn(fen);

// Stampa la board e il turno
console.log('Board:', board);
console.log('Turn:', turn);

// Usa la board e il turno nel body della richiesta
const url = "https://chess-move-maker.p.rapidapi.com/chess";
const options = {
    method: "POST",
    headers: {
        "x-rapidapi-key": "a4fef1ee6fmshb40f31ccdbfdd52p19565bjsn14ca66e0e06f",
        "x-rapidapi-host": "chess-move-maker.p.rapidapi.com",
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        color: turn, // Usa il turno determinato dalla FEN
        positions: board,
    }),
};

try {
    const response = await fetch(url, options);
    const result = await response.text();
    console.log(result);
} catch (error) {
    console.error(error);
}
