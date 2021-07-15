// generico, usa treds comuns, eh mais lento
// instalar antes de descometar essa linha
// npm install @tensorflow/tfjs 
// const tf = require('@tensorflow/tfjs');

// Para rodar na placa de video
// instalar antes de descomentar essa linha
// npm install @tensorflow/tfjs-node-gpu 
// const tf = require('@tensorflow/tfjs-node-gpu');

// Usando binarios de c no kernel - only linux


(async() => {

  
  const tf = require('@tensorflow/tfjs-node');

  const mobilenetModule = require('@tensorflow-models/mobilenet');
  const knnClassifier = require('@tensorflow-models/knn-classifier');
  
  const classifier = knnClassifier.create();

  const fs = require('fs')
  
  const filesMask = fs.readdirSync('with_mask');
  const filesFace = fs.readdirSync('without_mask');
  
  let trainingImageContainer = [];
  let testImageContainer = [];
  
  // Load mobilenet.
  const mobilenet = await mobilenetModule.load();

  const { Image, createCanvas } = require('canvas');
  const canvas = createCanvas(800, 600);
  const ctx = canvas.getContext('2d');
  
  async function loadLocalImageAndPreprocessing(dir, filename) {
    try {
      var img = new Image()
      img.onload = () => ctx.drawImage(img, 0, 0);
      img.onerror = err => { throw err };
      img.src = dir + '/' + filename;
      // console.log(img.src)
      image = tf.browser.fromPixels(canvas);
      return image;
    } catch (err) {
      console.log('erro em abrir e pré-processar a imagem', err);
    }
  }
  
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  console.time('preprocessingMask')
  console.log('preprocessing')
  let count = 0;
  for  (file of filesMask) {
    // console.log(`verbose: ${count++} of ${filesMask.length}`)
    // const file = filesMask[index];
    const imageLoaded = await loadLocalImageAndPreprocessing('with_mask', file);
    
    const randomNumber = getRandomInt(0, 100);
    if(randomNumber % 7 < 5){
      trainingImageContainer.push({ image: imageLoaded, class: 1 , imageName: file, path: 'with_mask'});
    }else{
      testImageContainer.push({ image: imageLoaded, class: 1 , imageName: file, path: 'with_mask'})
    }
  }
  console.timeEnd('preprocessingMask')
  console.time('preprocessingFace')
  
  count = 0;
  for (file of filesFace) {
    // console.log(`verbose: ${count++} of ${filesFace.length}`)
    // const file = filesFace[index];
    const imageLoaded = await loadLocalImageAndPreprocessing('without_mask', file);
    
    const randomNumber = getRandomInt(0, 100);
    if(randomNumber % 7 < 5){
      trainingImageContainer.push({ image: imageLoaded, class: 0 , imageName: file, path: 'without_mask'});
    }else{
      testImageContainer.push({ image: imageLoaded, class: 0 , imageName: file, path: 'without_mask' })
    }
  }
  
  console.timeEnd('preprocessingFace')

  console.log('embaralhando')
  console.time('embaralhando')

  trainingImageContainer = shuffle(trainingImageContainer)
  testImageContainer = shuffle(testImageContainer)


  console.timeEnd('embaralhando')




  console.log('training')

  console.time('training')
  // training
  count = 0;
  for (set of trainingImageContainer){
    // console.log(`verbose: ${count++} of ${trainingImageContainer.length}`)
    const modelLoaded = mobilenet.infer( set.image, 'conv_preds');
    classifier.addExample(modelLoaded, set.class);
  }
  
  console.timeEnd('training')
  
  console.time('predictions')
  console.log('predictions')
  
  const resultsTrue = []
  const resultsFalse = []

  count = 0;
  
  for(test of testImageContainer){
    // console.log(`verbose: ${count++} of ${testImageContainer.length}`)
    const modeledimage = mobilenet.infer( test.image, 'conv_preds');
    const predict = await classifier.predictClass(modeledimage);
    

    if(predict.label == String(test.class)){
      resultsTrue.push({predict, class: test.class});
    }else {
      resultsFalse.push({predict, class: test.class, imageName: test.imageName, path: test.path});
    }

  }

  console.log(`montante de treino ${trainingImageContainer.length}`)
  
  console.log(`acertos: ${resultsTrue.length} de ${testImageContainer.length}` +
  `- ${resultsTrue.length/ testImageContainer.length}%`)

  console.log(`erros: ${resultsFalse.length} de ${testImageContainer.length} ` +
  `- ${resultsFalse.length/ testImageContainer.length}%`)
  

  console.timeEnd('predictions')

  console.log('erros')

  resultsFalse.forEach(erro=>{
    console.log(erro)
  })

  async function makeFile(json) {
    await fs.writeFileSync("test.txt", json)
  }



  const dataset = classifier.getClassifierDataset();

  const jsonData = JSON.stringify(dataset);

  console.log(jsonData)

  await makeFile(jsonData);


  
})()



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




