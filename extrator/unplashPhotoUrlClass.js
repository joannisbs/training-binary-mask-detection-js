const axios = require('axios');

const urlUnsplash = 'https://unsplash.com/napi/search/photos';

class GetImages {
  __page = 1;
  __querySearch = 0;
  
  constructor(querySearch, initPage = 1){
    this.__page = initPage;
    this.__querySearch = querySearch;
  }

  async getNextPage(){
    const params = {
      query: this.__querySearch,
      per_page: 30,
      page: this.__page++,
    }
    const response = await axios.get(urlUnsplash, { params } );
  
    const { results } = response.data

    return results.map(foto => foto.urls.small);
  }
}

module.exports = {
  GetImages,
}