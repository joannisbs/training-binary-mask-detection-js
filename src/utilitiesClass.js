
const fs = require('fs')
class Utilities {
  shuffle(array) {
    let index_i = array.length, index_j, index_k;

    // While there remain elements to shuffle…
    while (index_i) {

      // Pick a remaining element…
      index_k = Math.floor(Math.random() * index_i--);

      // And swap it with the current element.
      index_j = array[index_i];
      array[index_i] = array[index_k];
      array[index_k] = index_j;
    }

    return array;
  }

  getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }

  // escreve um arquivo
  async makeJsonFile(json, fileName) {
    await fs.writeFileSync(fileName + ".json", json)
    console.log('arquivo criado?')
  }

}

module.exports = Utilities;
