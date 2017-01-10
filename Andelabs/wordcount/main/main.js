function wordCount(sentence) {
	var sentence_copy = sentence + ' ';
	var word = '';
	var counter = {};
	var break_chars = [' ','\n', '\t'];

	for (var i = 0; i < sentence_copy.length; i++){
		if (break_chars.indexOf(sentence_copy[i]) === -1) {
			word += sentence_copy[i];
		} else {
			console.log(word.toString());
			if (word !== ''){
				counter[word] = (counter[word] !== undefined) ? counter[word] + 1: 1;
				console.log(counter);
				word = '';
			}
		}
	}
	return counter;
}

module.exports = {words:wordCount}