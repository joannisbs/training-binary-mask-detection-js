const fs = require('fs');
const { Image, createCanvas } = require('canvas');

class readImage {
  canvas = undefined;
  ctx = undefined;
  
  constructor () {
    this.canvas = createCanvas(800, 600);
    this.ctx = canvas.getContext('2d');
  }

  loadLocalImageAndPreprocessing(dir, filename) {
    try {
      var img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.onerror = err => { throw err };
      img.src = dir + '/' + filename;

      // colocando a imagem no canvas e transformando em pixels
      image = tf.browser.fromPixels(canvas);
      return image; // retorna imagem em pixels
    } catch (err) {
      console.log('erro em abrir e pré-processar a imagem', err);
    }
  }

}

