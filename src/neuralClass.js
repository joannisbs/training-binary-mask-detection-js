

// mobilenet transforma imagem em vetor
const mobilenetModule = require('@tensorflow-models/mobilenet');
const knnClassifier = require('@tensorflow-models/knn-classifier');



class NeuralKnnClassForImage {
  classifier = undefined;
  mobilenet = undefined;
  
  constructor () {
    this.classifier = knnClassifier.create();
  }
  
  async setup(){
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
    if(tensor){
      const modelLoaded = await this.mobilenet.infer( tensor, 'conv_preds');
      await this.classifier.addExample(modelLoaded, className);
    }else{
      console.log('ue')
    }
  }

  async predictTensor(tensor) {
    return await this.classifier.predictClass(tensor);
  }


  async getModel() {
    const dataset = await this.classifier.getClassifierDataset();

    let datasetObj = {}
    Object.keys(dataset).forEach((key) => {
      let data = dataset[key].dataSync();
      datasetObj[key] = Array.from(data);
    });

    const jsonData = JSON.stringify(datasetObj);

    return jsonData;
  }
}

module.exports = NeuralKnnClassForImage;


