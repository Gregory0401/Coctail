import CocktailAPI from './service/getCocktail';
// import cardTmpl from '../tmp/random-card.hbs';
import {
  createMarkup,
  renderMarkup,
  markupFilter,
} from './service/create-markup';
import Notiflix from 'notiflix';

const throttle = require('lodash.throttle');

const refs = {
  searchForm: document.querySelector('.search__input'),
  loadMoreBtn: document.querySelector('.load__more'),
};

const cocktailAPI = new CocktailAPI();

async function onSearch(e) {
  const cocktailsList = document.querySelector('.cocktails__list');
  try {
    e.preventDefault();

    cocktailAPI.query = e.target.value.trim('');
    console.log(cocktailAPI.query);

    if (cocktailAPI.query === '') {
      return Notiflix.Notify.failure('Please, enter the name of cocktail');
    }
    cocktailAPI.resetPage();
    const responseSearch = await cocktailAPI.getCocktailByName();
    const markup = createMarkup(responseSearch);
    const filteredMarkup = markupFilter(markup);
    renderMarkup(cocktailsList, filteredMarkup);
  } catch (error) {
    console.log(error.text);
  }
}

function loadMore() {
  cocktailAPI.getCocktailByName();
}

// ---------Listeners---------

refs.searchForm.addEventListener('input', throttle(onSearch, 700));
refs.loadMoreBtn.addEventListener('click', loadMore);
