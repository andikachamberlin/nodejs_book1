function random_character(length) {

	let result = '';
	let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let charactersLength = characters.length;

	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}

	return result;

}

function convertDateDBtoIndo(string) {
	bulanIndo = ['', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September' , 'Oktober', 'November', 'Desember'];
 
    tanggal = string.split("-")[0];
    bulan = string.split("-")[1];
    tahun = string.split("-")[2];
 
    return tanggal + " " + bulanIndo[Math.abs(bulan)] + " " + tahun;
}

// Verify Token
function verify_token(request, response, next) {
	// Get auth header value
	const bearerHeader = request.headers['authorization'];
	// Check if bearer is undefined
	if(typeof bearerHeader !== 'undefined') {
	  	// Split at the space
	  	const bearer = bearerHeader.split(' ');
	  	// Get token from array
	  	const bearerToken = bearer[1];
	  	// Set the token
	  	request.token = bearerToken;
	  	// Next middleware
	  	next();
	} else {
	  	// Forbidden
	  	response.json({
			error: 'Token Denied'
		})
	}  
}

module.exports = {
    random_character,
	convertDateDBtoIndo,
	verify_token,
};