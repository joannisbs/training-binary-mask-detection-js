
const { Image, createCanvas } = require('canvas');
const tf = require('@tensorflow/tfjs-node');
class ReadImage {
  canvas = undefined;
  ctx = undefined;
  
  constructor () {
    this.canvas = createCanvas(800, 600);
    this.ctx = this.canvas.getContext('2d');
  }

  loadLocalImageAndPreprocessing(dir, filename) {
    try {
      var img = new Image()
      img.onload = () => this.ctx.drawImage(img, 0, 0);
      img.onerror = err => { throw err };
      img.src = dir + '/' + filename;

      // colocando a imagem no canvas e transformando em pixels
      return tf.browser.fromPixels(this.canvas); // retorna imagem em pixels
    } catch (err) {
      console.log('erro em abrir e pré-processar a imagem', err);
    }
  }

}

module.exports = ReadImage