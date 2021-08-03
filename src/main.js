const SettingDataClass = require('./setDataClass');
const ReadImageClass = require('./readImageClass');
const { makeAmountTrainTest } = require('./makeAmountTrainTest');
const NeuralKnnClassForImage = require('./neuralClass');
const Utilities = require('./utilitiesClass');

const main = async () => {
  const uttils = new Utilities();
  const reader = new ReadImageClass();
  const DataSetterEngine = new SettingDataClass(reader);
  const iaClass = new NeuralKnnClassForImage();
  await iaClass.setup();

  DataSetterEngine.setPathToTag('./data-set2/with_mask', 'mask');
  DataSetterEngine.setPathToTag('./data-set2/without_mask', 'face');

  const dataSet = await DataSetterEngine.getDataSet();

  const { train, test } = makeAmountTrainTest(dataSet, 1);

  for (let item of train){
    await iaClass.addExempleToModel(item.data, item.class);
  }

  const modelJson = await iaClass.getModel();
  await uttils.makeJsonFile(modelJson, 'modelFullDataset');

}

main();