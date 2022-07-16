let allWords = require('../data/dictionary.json');

function getWords(numWords = 3){
    const response = []
    const len = allWords.length

    for (let i = 0; i < numWords; i++) {
        const word = allWords[Math.round(Math.random() * len)]
        response.push(word)
    }
    
    return response
}

module.exports = getWords;