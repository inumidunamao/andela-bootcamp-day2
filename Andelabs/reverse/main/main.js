function reverse(string){
	if((string === undefined || string === null) || (string.constructor !== String || string.length < 1)) return null;
	var reversed = '';
	for (var i = 0; i< string.length; i++){
		reversed = string[i] + reversed;
	}
	return (string === reversed) ? true : reversed;
}

module.exports = {reverseString: reverse}