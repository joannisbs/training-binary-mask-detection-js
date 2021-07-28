const fs = require('fs');

class SettingData {
  reader = undefined;
  tags = [];
  dataSet = [];
	constructor(reader){
    this.reader = reader;
  }

  setPathToTag(path, className){
    this.tags.push({ path, class: className });
  }

  getDataSet(){
    this.tags.forEach(tag => {
      const fileNames = fs.readdirSync(tag.path);
      fileNames.forEach(fileName => {
        this.dataSet.push({
          data: this.reader(tag.path, fileName),
          class: tag.class,
        });
      });
    })
    return this.dataSet;
  }
}