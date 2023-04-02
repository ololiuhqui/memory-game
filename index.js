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

/* Randomize first card (needed to make the for loop work correctly). 
  NOTICE THAT without this hardcoding cards.length would be 0, so the loop won't even start,
  always assigning the default values this.coupleValue = 0 and this.imgSrc = 0
  to the first card therefore removing randomization.
  While using i <= cards.length would throw the exeption: cards[i] is undefined */

/* cards.push({
  cardId: 0,
  coupleValue: 0,
  imgSrc: Math.floor(Math.random() * Number(cardsSelectorInput.value)),
}); */

const cardConstructor = function (id) {
  (this.cardId = id), (this.coupleValue = 0), (this.imgSrc = 0);
};
cardConstructor.prototype.defineCardProperties = function (cardsNumber) {
  /* Checking every card in the array and handling the imgSrc and coupleValue assignement to get a new random card
  while making sure there's a couple for each card image */

  this.imgSrc = Math.floor((Math.random() * cardsNumber) / 2);
  this.coupleValue = 0;

  /* for (let i = 0; i < cards.length; i++) {
    if (this.imgSrc === cards[i].imgSrc && cards[i].coupleValue === 0) {
      this.coupleValue = 1;
    }
    while (this.imgSrc === cards[i].imgSrc && cards[i].coupleValue === 1) {
      this.imgSrc = Math.floor((Math.random() * cardsNumber) / 2);
    }
  } */
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

/* const checkIfDuplicates = function (arr) {
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
 */

const renderCards = function (cardsNumber) {
  for (let i = 0; i < cardsNumber; i++) {
    // Populate cards array with card objects from prototype

    let currentCard = new cardConstructor(i);
    currentCard.defineCardProperties(cardsNumber);
    // Give each card an ID
    currentCard.cardId = cards[i];

    console.log(currentCard);

    cards.push(currentCard);
  }

  for (let i = 0; i < cardsNumber; i++) {
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
