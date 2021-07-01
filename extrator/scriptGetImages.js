
const axios = require('axios');

const { Downloader } = require('./downloadClass');
const { GetImages } = require('./unplashPhotoUrlClass');

async function getUrlFiles(){

  const downloader = new Downloader('./photosMasked/');
  const searchClass = new GetImages('mask face')

  let counterTotal = 0;
  let maxPage = 10

  for (let page = 0; page < maxPage; page ++ ){
    const photosUrls = await searchClass.getNextPage();
  
    for (let i = 0; i < photosUrls.length; i++){
      const downloadUrl = photosUrls[i]
      
      await downloader.download(downloadUrl, 'foto_' + String(counterTotal) +'.jpeg')
  
      console.log('foto ' + String(counterTotal)+' ok of '+ String(30* maxPage))

      counterTotal++;
    }
  }
}


getUrlFiles()