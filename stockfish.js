const url = 'https://chess-stockfish-16-api.p.rapidapi.com/chess/api';
const data = new FormData();
data.append('fen', 'nbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR');

const options = {
	method: 'POST',
	headers: {
		'x-rapidapi-key': 'a4fef1ee6fmshb40f31ccdbfdd52p19565bjsn14ca66e0e06f',
		'x-rapidapi-host': 'chess-stockfish-16-api.p.rapidapi.com'
	},
	body: data
};

try {
	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);
} catch (error) {
	console.error(error);
}
