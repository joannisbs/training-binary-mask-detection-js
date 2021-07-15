// generico, usa treds comuns, eh mais lento
// instalar antes de descometar essa linha
// npm install @tensorflow/tfjs 
// const tf = require('@tensorflow/tfjs');

// Para rodar na placa de video
// instalar antes de descomentar essa linha
// npm install @tensorflow/tfjs-node-gpu 
// const tf = require('@tensorflow/tfjs-node-gpu');

// Usando binarios de c no kernel - only linux
const tf = require('@tensorflow/tfjs-node');

const model = tf.sequential();
model.add(tf.layers.dense({units: 100, activation: 'relu', inputShape: [10]}));
model.add(tf.layers.dense({units: 1, activation: 'linear'}));
model.compile({optimizer: 'sgd', loss: 'meanSquaredError'});

const xs = tf.randomNormal([100, 10]);
const ys = tf.randomNormal([100, 1]);

model.fit(xs, ys, {
  epochs: 100,
  callbacks: {
    onEpochEnd: (epoch, log) => console.log(`Epoch ${epoch}: loss = ${log.loss}`)
  }
});