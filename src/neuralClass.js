const tf = require('@tensorflow/tfjs-node');

// mobilenet transforma imagem em vetor
const mobilenetModule = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');



class NeuralClassForImage {
  classifier = undefined;
  mobilenet = undefined;
  
  async constructor () {
    this.classifier = knnClassifier.create();
    this.mobilenet = await mobilenetModule.load();
  }

  makeDataAtTensor(imageInPixels) {
    try {
      return mobilenet.infer( imageInPixels, 'conv_preds');
    } catch (err) {
      console.log('erro to turn image at tensor', err);
    }
  }


  async addExempleToModel(tensor, className) {
    await classifier.addExample(tensor, className);
  }

  async predictTensor(tensor) {
    return await classifier.predictClass(tensor);
  }


  async getModel() {
    const dataset = await classifier.getClassifierDataset();

    let datasetObj = {}
    Object.keys(dataset).forEach((key) => {
      let data = dataset[key].dataSync();
      datasetObj[key] = Array.from(data);
    });

    const jsonData = JSON.stringify(datasetObj);

    return jsonData;
  }
}

