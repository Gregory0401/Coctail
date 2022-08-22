import CocktailAPI from './getCocktail';
import icons from '../../images/icon.svg';
import { setCocktailToLocalStorage } from './localStorage';
console.log('icons :>> ', icons);
const favorite = new CocktailAPI();
import { onAddBtnClick } from './localStorage';

import { refs } from './hero-refs';

const { addToFavBtn } = refs;

export function createMarkup(arr) {
  return arr.data.drinks
    .map(({ strDrink, strDrinkThumb, idDrink }) => {
      return `
      <li class="cocktails__item card-set-item">
        <img
          src="${strDrinkThumb}"
          alt="${strDrink}"
        />
        <div class="cocktails__box">
          <h2 class="cocktails__second-title">${strDrink}</h2>
          <div class="cocktails__button-box" id=${idDrink}>
            <button
              type="button"
              class="cocktails__btn"
              data-modal-cocktail-open
            >
              <span class="cocktails__button-text">Learn more</span>
            </button>
            <button type="button" class="cocktails__btn js-add-btn transparent">
              <span class="cocktails__button-text">Add to</span>
              // <svg class="cocktails__btn-icon" width="18" height="18">
              //   <use href="./images/icon.svg#icon-redlike"></use>
              // </svg>
            </button>
          </div>
        </div>
      </li>`;
    })
    .join('');
}

export function renderMarkup(element, markup) {
  element.innerHTML = markup;
}

export function addEvents() {
  console.log('addEvents');
  const refs = {
    modalOpenBtn: document.querySelectorAll('[data-modal-cocktail-open]'),
    backdrop: document.querySelector('[data-modal]'),
  };
  refs.modalOpenBtn.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      refs.backdrop.classList.remove('is-hidden-modal-coctails');
    });
  });
}

const cocktailList = document.querySelector('.cocktails__list');
cocktailList.addEventListener('click', onClickCard);

function onClickCard(e) {
  const btn = e.target.closest('.js-add-btn');
  if (btn) {
    setCocktailToLocalStorage(btn.dataset.id);
  }
}

console.log('cocktailList :>> ', cocktailList);

export function addFavoriteEvents() {
  // const refs = {
  //   addToFavBtn: document.querySelectorAll('.js-add-btn'),
  // };
  // // console.log(addToFavBtn);
  // refs.addToFavBtn.forEach(function (btn) {
  //   btn.addEventListener('click', function (e, idDrink) {
  //     console.log('1111 :>> ', 1111);
  //     // console.log(idDrink);
  //     favorite.addFavoriteDrinkById(idDrink);
  //     btn.addEventListener('click', onAddBtnClick);
  //   });
  // });
}

export function createRandomMarkup(arr) {
  return arr
    .map(item => {
      const { strDrink, strDrinkThumb, idDrink } = item.data.drinks[0];
      // console.log(item.data.drinks[0]);
      return `
      <li class="cocktails__item card-set-item">
        <img
          src="${strDrinkThumb}"
          alt="${strDrink}"
        />
        <div class="cocktails__box">
          <h2 class="cocktails__second-title">${strDrink}</h2>
          <div class="cocktails__button-box">
            <button
              type="button"
              class="cocktails__btn"
              data-modal-cocktail-open
            >
              <span class="cocktails__button-text">Learn more</span>
            </button>
            <button type="button" class="cocktails__btn js-add-btn transparent" data-id=${idDrink}>
              <span class="cocktails__button-text">Add to</span>
           
              <img src="${icons}" alt="image" width="18">
            </button>
          </div>
        </div>
      </li>`;
    })
    .join('');
}

export function markupFilter(markup) {
  if (window.screen.width < 768) {
    const markupFiltered = markup.filter((_, index) => index <= 3);
    return markupFiltered.join('');
  } else if (window.screen.width >= 768 && window.screen.width < 1280) {
    const markupFiltered = markup.filter((_, index) => index <= 6);
    return markupFiltered.join('');
  }
  const markupFiltered = markup.filter((_, index) => index <= 9);
  return markupFiltered.join('');
}
