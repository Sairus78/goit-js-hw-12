import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';

const KEY = '46003151-fdbe84ecfff9a38ce8f04bf2a';

export function search(element, page) {
  const url = `${BASE_URL}?key=${KEY}&q=${element}&image_type=photo&orientation=horizontal&safesearch=true&per_page=15&page=${page}`;
  return axios.get(url);
}
