'use strict';

/* DOM ELEMENTS */
const cardsSelector = document.querySelector('.select-cards');
const cardsSelectorInput = document.querySelector('.select-cards input');
const btnPlay = document.querySelector('.select-cards button');
const inputTooltip = document.querySelector('.input-container .tooltip');
const btnStartNewGame = document.querySelector('.start-new-game');
const cardGrid = document.querySelector('.card-grid');
let cardElms;

/* GAME VARIABLES AND OBJECTS PROTOTYPES*/
let score;
let cards = [];

const cardConstructor = function (id) {
  (this.cardId = id), (this.coupleValue = 0), (this.imgSrc = 0);
};
cardConstructor.prototype.defineCardProperties = function () {
  for (let i = 0; i <= cards.length; i++) {
    while (this.imgSrc !== cards[i].imgSrc && cards[i].coupleValue !== 2) {
      this.imgSrc = Math.floor(
        Math.random() * Number(cardsSelectorInput.value)
      );
      this.coupleValue += 1;
    }
  }
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
    // add different tooltip
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

const checkIfDuplicates = function (arr) {
  let alreadySeen = {};

  arr.forEach(function (str) {
    if (alreadySeen[str]) {
      return true;
    } else {
      alreadySeen[str] = true;
      return false;
    }
  });
};

const renderCards = function () {
  for (let i = 0; i < Number(cardsSelectorInput.value); i++) {
    // populate cards array with card objects
    let currentCard = new cardConstructor(i);
    currentCard.defineCardProperties();
    cards.push(currentCard);

    // DOM ELEMENTS RENDERING
    // render the selected number of cards in DOM in a grid

    cardGrid.innerHTML += `
    <div class="card" id="card-${i}">
      <div class="content">
          <div class="card-front">?</div>
          <div class="card-back">              
            <img src="images/img-${cards[i].imgSrc}" alt="">
          </div>
      </div>`;

    // select the card content for the currently generated card id
    const currentCardContent = document.querySelector(`#card-${i} .content`);
    // select all cards in DOM
    cardElms = document.querySelectorAll('.card');

    // REVEAL/HIDE EVENTS

    const switchCardElmsHandler = function () {
      // first add handler for reveling
      cardElms[i].addEventListener('click', function () {
        cardRotate(currentCardContent, '180deg');

        // when the first event is fired, add the second handler
        cardElms[i].addEventListener('click', function () {
          cardRotate(currentCardContent, '0deg');

          // when the second event is fired, restart function
          switchCardElmsHandler();
        });
      });
    };
    switchCardElmsHandler();
  }
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
