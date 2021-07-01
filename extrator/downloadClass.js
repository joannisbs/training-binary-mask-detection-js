const fs = require('fs');
const http = require('http');
const https = require('https');

class Downloader {

  __fileInfo = null;
  __filePath = null;

  constructor (filePath) {
    this.__filePath = filePath
  }

  download(url, fileName) {
    const proto = !url.charAt(4).localeCompare('s') ? https : http;

    return new Promise((resolve, reject) => {
      const file = this.createFile(this.__filePath + fileName);
      const responseCallback = this.makeFileByResponse(file);

      const request = proto.get(url, responseCallback);

      file.on('finish', () => resolve(this.__fileInfo));
      
      request.on('error', this.errorCallback);
      file.on('error', this.errorCallback);
      
      request.end();
    })
  }

  createFile (filePath) { 
    return fs.createWriteStream(filePath);
  }

  makeFileByResponse = (file) => (response) => {
    if (response.statusCode !== 200) {
      reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
      return;
    }

    this.__fileInfo = {
      mime: response.headers['content-type'],
      size: parseInt(response.headers['content-length'], 10),
    };

    response.pipe(file);
  }

  errorCallback = (err) => {
    fs.unlink(filePath, () => reject(err));
  }
}

module.exports = {
  Downloader,
}