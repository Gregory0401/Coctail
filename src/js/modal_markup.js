import CocktailAPI from './service/getCocktail';
import { renderMarkup } from './service/create-markup';
import emptyHeart from '../images/hearts/empty-heart.png';
import fullHeart from '../images/hearts/full-heart.png';
import { shouldBeActivated } from '../js/service/create-markup';

export const refs = {
  cocktailsList: document.querySelector('.cocktails__list'),
  backdropT: document.querySelectorAll('[data-inner-modal]'),
  modalContainer: document.querySelector('.modal-coctails'),
  modalIngrContainer: document.querySelector('.backdrop-modal-components'),
  backdrop: document.querySelector('[data-inner-modal]'),
  closeBtn: document.querySelector('[data-inner-modal-close]'),
  openModalIngrdients: document.querySelectorAll('[data-modal-open]'),
  scaleModal: document.querySelector('[data-modal-scale]'),
};

const cocktailAPI = new CocktailAPI();

function createModalMarkup(response) {
  return response.data.drinks
    .map(drink => {
      return `
    <div class="modal-coctails dark--modal-back" data-modal-open data-modal-scale>
      <h2 class="modal-coctail-name dark--title">${drink.strDrink}</h2>
      <h3 class="modal-ingredients dark--title">Ingredients</h3>

      <p class="modal-per dark--text">Per cocktail</p>     

        <ul class="modal-coctail-components dark--text">
        </ul>
      <img src="${drink.strDrinkThumb}" alt="cocktail" class="modal-img" />
      <h3 class="modal-Instractions dark--title">Instructions:</h3>
      <p class="modal-text dark--text">
        ${drink.strInstructions}
      </p>
       <button class="modal-button" data-modal-a>Add to favorite</button>
      <button class="modal-button hidden_remove" data-modal-b>
        Remove from favorite
      </button>
    </div>`;
    })
    .join('');
}

function toIdentifyStrType(ingredient) {
  return ingredient.strType === null
    ? 'Type is not mentioned :('
    : ingredient.strType;
}

function toMakeDescriptionText(ingredient) {
  return ingredient.Description === null
    ? 'Sorry, description is not specified :('
    : ingredient.strDescription;
}

function createIngredientsMarkup(ingredients) {
  console.log(ingredients);
  return ingredients.data.ingredients
    .map(ingredient => {
      return `<div class="ingredient-modal-wrap">
  <img class="ingredient-modal-pic" src='https://www.thecocktaildb.com/images/ingredients/${
    ingredient.strIngredient
  }-Small.png'
  alt=${ingredient.strIngredient}></div>
      <div inner-modal-container dark--modal-back"><div class="ingr-modal-title-wrapper">
  <h3 class="inner-modal-name dark--title">${toIdentifyStrType(ingredient)}</h3>
  <h4 class="inner-modal-passage dark--text">
    ${ingredient.strIngredient}
  </h4>
  <div class="border"></div>
</div>
 <button type="button" class="modal-ingredients-close-btn" data-modal-close-ingr>
     <svg class="icon-modal-ingredients" height="32" width="32">
    <use href="#icon-close-modal-cocktail"></use>
  </svg>
  </button>
</div>
<div class="modal-ingredients-desc">

<p class="inner-modal-text">
  ${toMakeDescriptionText(ingredient)}
</p>
<ul class="ingredients-modal-list">

  <li class="inner-modal-ingredients dark--text"">
    ✶ Type: ${toIdentifyStrType(ingredient)}
  </li>
  <li class="inner-modal-ingredients dark--text">
    ✶ Country of origin: Sorry, not specified
  </li>
  <li class="inner-modal-ingredients dark--text">✶ Alcohol : ${
    ingredient.strAlcohol
  }</li>

</ul>
<button id=${
        ingredient.idIngredient
      } type="button" data-modal-c class="ingredients-modal-btn cocktails__btn dark--btn-back transparent ${shouldBeActivated(
        ingredient.idIngredient,
        'ingredients'
      )}">
              <span class="cocktails__button-text">Add to</span>  
              <img class="empty-heart" data-toggle="hidden-hearFt" src="${emptyHeart}" alt="" width="18" height="18"/>
              <img class="full-heart" data-toggle="empty-heart" src="${fullHeart}" alt="" width="18" height="18"/> 
            </button>
</div>`;
    })
    .join('');
}

export async function onOpenModalClick(e) {
  if (e.target.className === 'cocktails__button-text') {
    try {
      cocktailAPI.id = e.target.id;
      const responseID = await cocktailAPI.getCocktailsId();
      const modalMarkup = createModalMarkup(responseID);
      renderMarkup(refs.modalContainer, modalMarkup);

      const ingrWrap = document.querySelector('.modal-coctail-components');
      const backdrop = document.querySelector('[data-modal]');
      backdrop.classList.remove('is-hidden-modal-coctails');

      const markupIngredientsList =
        await createMarkupCocktailForModalListIngredients(responseID);
      renderMarkup(ingrWrap, markupIngredientsList);
      ingrWrap.addEventListener('click', onIngredientClick);

      (() => {
        const refs = {
          backdrop: document.querySelector('[data-modal]'),
          closeBtn: document.querySelector('[data-modal-close]'),
        };

        refs.closeBtn.addEventListener('click', closeModal);

        function closeModal() {
          refs.backdrop.classList.add('is-hidden-modal-coctails');
        }
      })();
      // document.addEventListener('keydown', onCloseEsc);
    } catch (error) {
      console.log(error.message);
    }
  }
}

function createMarkupCocktailForModalListIngredients(res) {
  const drink = res.data.drinks[0];
  console.log(drink);
  const ingredients = [];

  for (let i = 1; i <= 15; i += 1) {
    let ingredient = drink['strIngredient' + i];
    if (!ingredient) break;
    ingredients.push(ingredient);
    console.log(ingredients);
  }
  return ingredients
    .map(ingredient => {
      return /*html*/ `<li "${ingredient}" class="modal-coctail-component" data-modal-open>${ingredient}</li>`;
    })
    .join('');
}

async function onIngredientClick(e) {
  try {
    const ingredient = e.target.textContent;
    const responseIngredient = await cocktailAPI.getCocktailByIngredient(
      ingredient
    );
    const ingredientsContainer = document.querySelector(
      '.inner-modal-container'
    );
    const markup = createIngredientsMarkup(responseIngredient);
    renderMarkup(ingredientsContainer, markup);
    const backdrop = document.querySelector('[data-inner-modal]');
    backdrop.classList.remove('is-hidden-inner-modal');
  } catch (error) {
    throw new Error(error.message);
  }
}

// export function onCloseEsc(e) {
//   console.dir(e);
//   if (e.code === 'Escape') {
//     document.body.classList.remove('modal-open');
//     backdrop.classList.add('is-hidden');
//     // modalIngr.classList.add('is-hidden');
//     cocktailModalMain.classList.remove('is-hidden');
//     document.removeEventListener('keydown', onCloseEsc);
//   }
// }

refs.cocktailsList.addEventListener('click', onOpenModalClick);
