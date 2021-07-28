const utilitiesClass = require("./utilitiesClass");
const setDataClass = require("./setDataClass");
const reaImageClass = require("./readImageClass");
const readImage = new reaImageClass();
const data = new setDataClass();
const utilities = new utilitiesClass();

function makeAmountTrainTest(dataSet, factor){

  dataSet = utilities.shuffle(dataSet);
    
  const testFactor = Math.ceil(dataSet.length * factor);

  const traningArray = dataSet.slice(0, testFactor);
  const testArray = dataSet.slice(testFactor, dataSet.length);

  return { train: traningArray, test: testArray };


}
