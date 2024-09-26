import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { search } from './js/pixabay-api';
import { renderMarkup } from './js/render-functions';

const galleryListEl = document.querySelector('.gallery-list');
const formEl = document.querySelector('form');
const loaderEl = document.querySelector('.loader');
const loadBtnEl = document.querySelector('.load-more-btn-js');

let lightbox = new SimpleLightbox('.gallery-list a', {});

let page = 1;
let cardHeight = 0;
let foundValue = '';

// function//

const elementForSearch = async event => {
  try {
    event.preventDefault();

    foundValue = event.target.elements.choiceSearch.value.toLowerCase().trim();

    page = 1;
    galleryListEl.innerHTML = '';

    if (!foundValue) {
      iziToast.error({
        message: 'Please enter a search word.',
        position: 'topRight',
      });
      return;
    }

    loaderEl.style.display = 'block';

    const response = await search(foundValue, page);

    if (response.data.totalHits === 0) {
      loadBtnEl.classList.add('is-hidden');
      iziToast.info({
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      galleryListEl.innerHTML = '';
      return;
    }

    renderMarkup(response.data.hits, galleryListEl);

    const galleryCardEl = galleryListEl.querySelector('li');
    cardHeight = galleryCardEl.getBoundingClientRect().height;

    if (response.data.totalHits > 15) {
      loadBtnEl.classList.remove('is-hidden');
    } else {
      loadBtnEl.classList.add('is-hidden');
    }

    lightbox.refresh();

    formEl.reset();
  } catch (err) {
    iziToast.error({
      message: err.message,
      position: 'topRight',
    });
  } finally {
    loaderEl.style.display = 'none';
    formEl.reset();
  }
};

const onLoadMoreClick = async () => {
  try {
    page += 1;

    loadBtnEl.classList.add('is-hidden');

    loaderEl.style.display = 'block';

    const response = await search(foundValue, page);

    renderMarkup(response.data.hits, galleryListEl);

    lightbox.refresh();

    scrollBy({
      top: cardHeight * 2,
      behavior: 'smooth',
    });

    loadBtnEl.classList.remove('is-hidden');

    if (page === Math.ceil(response.data.totalHits / 15)) {
      loadBtnEl.classList.add('is-hidden');
      iziToast.warning({
        title: 'Info',
        message: 'Were sorry, but you have reached the end of search results.',
        position: 'topRight',
      });
    }
  } catch (err) {
    iziToast.error({
      message: err.message,
      position: 'topRight',
    });
  } finally {
    loaderEl.style.display = 'none';
  }
};

formEl.addEventListener('submit', elementForSearch);
loadBtnEl.addEventListener('click', onLoadMoreClick);
