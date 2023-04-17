'use strict';

/*  DOM ELEMENTS */

const cardsSelector = document.querySelector('.select-cards');
const inputBtns = document.querySelectorAll(
  '.choose-cards-n-buttons-container button'
);
const btnStartNewGame = document.querySelector('.start-new-game');
const cardGrid = document.querySelector('.card-grid');
let cardElms;

/*  GAME VARIABLES AND OBJECTS PROTOTYPES*/

let score;
// create a set to ensure only unique card objects will be in the cards array
let cards = [];

const cardConstructor = function () {
  this.cardId, this.coupleValue, this.imgSrc;
};

/*  GAME FUNCTIONS */

const init = function () {
  // TODO Check for highscore in localstorage and show it
  score = 0;
  cardsSelector.classList.remove('hidden');
};
init();

const checkInput = function (button) {
  if (button === 0) {
    renderCards(10);
  } else if (button === 1) {
    renderCards(20);
  } else if (button === 2) {
    renderCards(30);
  } else if (button === 3) {
    renderCards(50);
  }
};

const renderCards = function (cardsNumber) {
  // We are gonna push a couple inside the cards array, so we need to iterate for half the cardsNumber to avoid duplicates

  for (let i = 0; i < cardsNumber / 2; i++) {
    // Create card objects from prototype and set the properties
    let currentCard = new cardConstructor();
    currentCard.imgSrc = i;
    // Duplicate the currentCard
    const couple = duplicateCard(currentCard);
    // Push each of the 2 cards in the new couple inside the cards array
    couple.forEach(singleCard => {
      cards.push(singleCard);
    });

    // TODO shuffle the array
  }

  for (let i = 0; i < cardsNumber; i++) {
    cards.forEach(card => {
      card.cardId = [i];
    });

    // DOM ELEMENTS RENDERING
    // render the selected number of cards in DOM in a grid

    cardGrid.innerHTML += `
    <div class="card" id="card-${i}">
      <div class="content">
          <div class="card-front">?</div>
          <div class="card-back">              
            <img src="images/img-${cards[i].imgSrc}.jpg" alt="">
          </div>
      </div>`;
  }

  handleAnimation();
};

//  CREATE A COUPLE FROM A CARD

const duplicateCard = function (currentCard) {
  // Define a couple
  let couple = [];

  for (let i = 0; i < 2; i++) {
    // Define card couple value (0 first and then 1)
    currentCard.coupleValue = i;
    // Push card into couple
    couple.push(currentCard);
    console.log(couple);
  }

  return couple;
};

//  REVEAL/HIDE CARD ANIMATION EVENTS

const handleAnimation = function () {
  for (let i = 0; i < cards.length; i++) {
    // select all cards in DOM
    const cardElms = document.querySelectorAll('.card');
    // select the card content for every card id
    const currentCardContent = document.querySelector(`#card-${i} .content`);

    const switchCardElmsHandler = function () {
      // first add handler for reveling
      cardElms[i].addEventListener('click', function () {
        cardRotate(currentCardContent, '180deg');

        // when the first event is fired, add the second handler
        cardElms[i].addEventListener('click', function () {
          cardRotate(currentCardContent, '0deg');

          // when the second event is fired, restart function (re-add first handler)
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

for (let i = 0; i < inputBtns.length; i++) {
  inputBtns[i].addEventListener('click', () => {
    checkInput(i);
    // TODO remove the input buttons with a function and show the start new game button, add score
  });
}
