'use strict';

/* DOM ELEMENTS */
const cardsSelector = document.querySelector('.select-cards');
const cardsSelectorInput = document.querySelector('.select-cards input');
const btnPlay = document.querySelector('.select-cards button');
const inputTooltip = document.querySelector('.input-container .tooltip');
const btnStartNewGame = document.querySelector('.start-new-game');
const cardGrid = document.querySelector('.card-grid');
let cardElms;

/* GAME VARIABLES */
let score;
let cards = [];
let cardTemplate = {
  cardId: 'x',
  coupleValue: '1 or 2',
  imgSrc: 'images/img-x',
};

/* GAME FUNCTIONS */

const init = function () {
  score = 0;
  cardsSelector.classList.remove('hidden');
  cardsSelectorInput.focus();
};
init();

const checkInput = function () {
  // if input is NaN
  if (!cardsSelectorInput.value) {
    // add tooltip
    inputTooltip.classList.remove('hidden');
    inputTooltip.textContent = 'Insert a number!';
  }
  // if input is not a valid number
  else if (cardsSelectorInput.value > 100) {
    // add tooltip
    inputTooltip.classList.remove('hidden');
    inputTooltip.textContent = 'Insert a valid number! (between 1 and 100)';
  }
  // if input is a valid number
  else if (0 < cardsSelectorInput.value && cardsSelectorInput.value <= 100) {
    // remove card selector, rendercards and show "start new game" btn
    cardsSelector.classList.add('hidden');
    btnStartNewGame.classList.remove('hidden');

    renderCards();
  }
};

const switchCardElmsHandler = function () {
  // first add handler for revelaing
  cardElms[i].addEventListener('click', function () {
    cardRotate(currentCardContent, '180deg');

    // if the first event is fired, add the second handler
    cardElms[i].addEventListener('click', function () {
      cardRotate(currentCardContent, '0deg');

      // if the second event is fired, restart function
      switchCardElmsHandler();
    });
  });
};

const renderCards = function () {
  // render the selected number of cards in DOM
  for (let i = 0; i < Number(cardsSelectorInput.value); i++) {
    // give all cards a unique id
    // give each card an img
    cardGrid.innerHTML += `
    <div class="card" id="card-${i}">
      <div class="content">
          <div class="card-front">?</div>
          <div class="card-back">              
            <img src="/images/img-${i}.jpg" alt="">
          </div>
      </div>`;
  }

  // select all cards in DOM
  cardElms = document.querySelectorAll('.card');

  for (let i = 0; i < cardElms.length; i++) {
    // populate the "cards" dedicated game variables array with "card" objects

    /* // create the object
    eval(`const card${i} = Object.create(cardTemplate)`);
    // overwrite objects template (cardTemplate) values
    eval(`card${i}`).cardId = i;
    eval(`card${i}`).coupleValue = Math.round(Math.random());
 */
    //push object into array

    cards[i] = `card-${i}`;

    // select the card content for the current generated card id
    const currentCardContent = document.querySelector(`#card-${i} .content`);

    // give any card in CardElms an event handler for revealing and hiding

    // handle the assignment of listeners for revealing or hiding card
    switchCardElmsHandler();
  }

  // attach to each card content a background img
};

const cardRotate = function (cardContent, deg) {
  cardContent.style.transform = `rotateY(${deg})`;
};

/* const cardHide = function (cardContent) {
  cardContent.style.transform = 'rotateY(0deg)';
}; */

btnPlay.addEventListener('click', checkInput);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Enter') {
    checkInput();
  }
});