function wordCount(sentence) {
	if((sentence === undefined || sentence === null) || (sentence.constructor !== String || sentence.length < 1)) return null;
	var sentence_copy = sentence + ' ';
	var word = '';
	var counter = {};
	var break_chars = [' ','\n', '\t'];

	for (var i = 0; i < sentence_copy.length; i++){
		if (break_chars.indexOf(sentence_copy[i]) === -1) {
			word += sentence_copy[i];
		} else {
			
			if (word !== ''){
																			
				if ((counter[word] !== undefined && counter[word].constructor != Number)){
						counter[word] = 1;
						console.log(counter[word]);
						word = '';
					
				} else {
					counter[word] = (counter[word] !== undefined) ? counter[String(word)] + 1: 1;
					//console.log(counter);		
					word = '';	
				}
			}
		}
	}
	return counter;
}

module.exports = {words:wordCount}