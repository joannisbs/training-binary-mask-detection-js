const utilitiesClass = require("./utilitiesClass");
const utilities = new utilitiesClass();

function makeAmountTrainTest(dataSet, factor){

  dataSet = utilities.shuffle(dataSet);
    
  const testFactor = Math.ceil(dataSet.length * factor);
  const traningArray = dataSet.slice(0, testFactor);
  const testArray = dataSet.slice(testFactor, dataSet.length);

  return { train: traningArray, test: testArray };
}
