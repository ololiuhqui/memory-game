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

// Shuffle array with Fisher-Yates modern shuffle
const shuffleArray = function (a) {
  // i has to be at max = the index of the last element in array
  // and at min = 1
  for (let i = a.length - 1; i > 0; i--) {
    // Create a random number integer j such that 0 ≤ j ≤ i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the element at position i with the element at position j (random)
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

// Rotate a card
const cardRotate = function (cardContent, deg) {
  cardContent.style.transform = `rotateY(${deg})`;
};

// Hide / Show the menù
const toggleCardsSelector = function (toggle) {
  if (toggle === 'on') {
    cardsSelector.classList.remove('hidden');
  } else if (toggle === 'off') {
    cardsSelector.classList.add('hidden');
  }
};

// INITIALIZE THE GAME

const init = function () {
  // TODO Check for highscore in localstorage and show it
  score = 0;
  toggleCardsSelector('on');
};
init();

// CHECKING INPUT

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

// RENDERING CARDS

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
  }

  shuffleArray(cards);

  for (let i = 0; i < cardsNumber; i++) {
    cards[i].cardId = i + 1;

    // Rendering cards in DOM
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

  handleRotation();
};

//  Create a couple from a card

const duplicateCard = function (currentCard) {
  // Define a couple
  let couple = [];

  for (let i = 0; i < 2; i++) {
    // Define card couple value (0 first and then 1)
    currentCard.coupleValue = i;
    // Push card into couple
    couple.push({ ...currentCard });
  }

  return couple;
};

// PLAYER ROUND

document.addEventListener('click', function (e) {
  console.log(e.target);
});

/*checkSelection(){

 };

if (card1 === card2) {
  validateCouple(card1, card2);
} else {
  cardRotate(card1, '0deg');
  cardRotate(card2, '0deg');
}

const validateCouple = function (card1, card2) {
  card1.style = yellow;
  card2.style = yellow;
}; */

/* HANDLERS */

//  Cards rotation handlers

const handleRotation = function () {
  for (let i = 0; i < cards.length; i++) {
    // select all cards in DOM
    const cardElms = document.querySelectorAll('.card');
    // select the card content for every card HTML id
    const currentCardContent = document.querySelector(`#card-${i} .content`);

    const addHandlers = function () {
      // first add handler for reveling
      cardElms[i].addEventListener('click', function () {
        cardRotate(currentCardContent, '180deg');

        // when the first event is fired, add the second handler
        cardElms[i].addEventListener('click', function () {
          cardRotate(currentCardContent, '0deg');

          // when the second event is fired, restart function (re-add first handler)
          addHandlers();
        });
      });
    };
    addHandlers();
  }
};

for (let i = 0; i < inputBtns.length; i++) {
  inputBtns[i].addEventListener('click', () => {
    checkInput(i);
    // Remove the cards selector
    toggleCardsSelector('off');
  });
}
