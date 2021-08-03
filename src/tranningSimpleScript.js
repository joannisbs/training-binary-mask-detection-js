// existe 3 formas de importar o tensorflow no javascript


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

// mobilenet transforma imagem em vetor
const mobilenetModule = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');

const fs = require('fs')

// lista todos os arquivos do ditetório

// readsync ele lista todos os nomes dos arquivos no diretorio
const filesMask = fs.readdirSync('with_mask');
const filesFace = fs.readdirSync('without_mask');


async function main() {
  const classifier = knnClassifier.create();

  console.time('montFiles')
  console.log('montando os arrays')

  const { train, test } = makeArrayTrainingTest(filesMask, filesFace);

  console.timeEnd('montFiles')

  console.time('training')
  console.log('training')

  // train
  for (set of train){
    const modelLoaded = mobilenet.infer( set.image, 'conv_preds');
    await classifier.addExample(modelLoaded, set.class);
  }

  console.timeEnd('training')


  const resultsTrue = []
  const resultsFalse = []

  console.log('test')
  console.time('test')

  // test
  for (set of test){
    const modelLoaded = mobilenet.infer( set.image, 'conv_preds');
    const predict = await classifier.predictClass(modelLoaded);
    if(predict.label == String(test.class)){
      resultsTrue.push({predict, class: set.class});
    }else {
      resultsFalse.push({predict, class: set.class, imageName: set.fileName });
    }
  }

  console.timeEnd('test');

  showResults(test, train, resultsTrue, resultsFalse);
  showErros(resultsFalse);

  const modelJson = await getJsonModel(classifier);
  await makeJsonFile(modelJson, 'modeloTestMask');
}

function showResults(testContainer, trainingContaier, trueResutsContainer, errorResultContainer){
  console.log(`montante de treino ${trainingContaier.length}`)

  console.log(`acertos: ${trueResutsContainer.length} de ${testContainer.length}` +
  `- ${trueResutsContainer.length/ testContainer.length}%`)

  console.log(`erros: ${errorResultContainer.length} de ${testContainer.length} ` +
  `- ${errorResultContainer.length/ testContainer.length}%`)
}


function showErros(errorResultContainer){
  errorResultContainer.forEach(erro=>{
    console.log(erro)
  })
}


function openImageAndPreprocessing(dir, filename){
  const { Image, createCanvas } = require('canvas');
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');

  try {
    var img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0);
    img.onerror = err => { throw err };

    // aqui que a mágica acontece
    img.src = dir + '/' + filename;
    // console.log(img.src)

    // colocando a imagem no canvas e transformando em pixels
    const image = tf.browser.fromPixels(canvas);
    return image; // retorna imagem em pixels
  } catch (err) {
    console.log('erro em abrir e pré-processar a imagem', err);
  }
}

function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}


function setTagToFile(file, tag, fileName){
  return { image: file, class: tag , fileName: fileName}
}

function makeArrayTrainingTest(maskFiles, noMaskFiles){
  const maskArray = maskFiles.map((fileName) => {
    const image = openImageAndPreprocessing('with_mask', fileName);
    return setTagToFile(image, 'with_mask', fileName)
  });

  const noMaskArray = noMaskFiles.map((fileName) => {
    const image = openImageAndPreprocessing('without_mask', fileName);
    return setTagToFile(image, 'without_mask', fileName)
  });

  const allArray = {
    ...maskArray,
    ...noMaskArray,
  };

  const suffleArray = shuffle(allArray);

  const testFactor = Math.ceil(suffleArray.length * 0.8);

  const traningArray = suffleArray.slice(0, testFactor);
  const testArray = suffleArray.slice(testFactor, suffleArray.length);

  return { train: traningArray, test: testArray };
}


function getJsonModel(classifier){
  const dataset = classifier.getClassifierDataset();

  let datasetObj = {}
  Object.keys(dataset).forEach((key) => {
    let data = dataset[key].dataSync();
    datasetObj[key] = Array.from(data);
  });
    
  const jsonData = JSON.stringify(datasetObj);

  return jsonData;
}


// escreve um arquivo
async function makeJsonFile(json, fileName) {
  await fs.writeFileSync(fileName + ".json", json)
}




main();

