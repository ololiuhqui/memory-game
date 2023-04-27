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
let cards = [];

const cardConstructor = function () {
  this.cardId, this.coupleValue, this.imgSrc, this.state, this.domRef;
};

/*  GAME FUNCTIONS */

// Shuffle array with Fisher-Yates modern shuffle
const shuffleArray = function (a) {
  for (let i = a.length - 1; i > 0; i--) {
    // Create a random number integer j such that 0 ≤ j ≤ i
    const j = Math.floor(Math.random() * (i + 1));
    // Swap the element at position i with the element at position j (random)
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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

// CHECKING PLAYER MENU INPUT

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
    currentCard.state = 'covered';
    // Duplicate the currentCard
    const couple = duplicateCard(currentCard);
    // Push each of the 2 cards in the new couple inside the cards array
    couple.forEach(singleCard => {
      cards.push(singleCard);
    });
  }

  shuffleArray(cards);

  for (let i = 0; i < cardsNumber; i++) {
    // add ID to card object
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

    // add DOM reference to card object
    cards[i].domRef = document.getElementById(`card-${i}`);
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
    // Push a copy of currentCard into couple
    couple.push({ ...currentCard });
  }

  return couple;
};

// FIXME

// PLAYER ROUND

document.addEventListener('click', function (e) {
  let selectedCardElm = e.target.parentNode.parentNode;

  if (selectedCardElm) {
    console.log(selectedCardElm);
  }
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

/* ANIMATIONS AND HANDLERS */

//  Cards rotation handlers

const handleRotation = function () {
  for (let i = 0; i < cards.length; i++) {
    // select all cards in DOM
    const cardElms = document.querySelectorAll('.card');
    // select the card content for every card HTML id
    const currentCard = cards[i];
    const currentCardContent = document.querySelector(`#card-${i} .content`);

    const addHandlers = function () {
      // first add handler for revealing
      cardElms[i].addEventListener('click', function () {
        uncoverCard(currentCard, currentCardContent);

        // when the first event is fired, add the second handler
        cardElms[i].addEventListener('click', function () {
          coverCard(currentCard, currentCardContent);

          // when the second event is fired, restart function (re-add first handler)
          addHandlers();
        });
      });
    };
    addHandlers();
  }
};

// Remove rotation event handlers
const removeHandlers = function (cardContent) {
  cardContent.removeEventListener('click', cardRotate(cardContent, '180deg'));
  cardContent.removeEventListener('click', cardRotate(cardContent, '0deg'));
};

// Rotate a card
const cardRotate = function (cardContent, deg) {
  cardContent.style.transform = `rotateY(${deg})`;
};

// Reveal a card
const uncoverCard = function (card, cardContent) {
  card.state = 'uncovered';
  cardRotate(cardContent, '180deg');
};

// Hide a card
const coverCard = function (card, cardContent) {
  card.state = 'covered';
  cardRotate(cardContent, '0deg');
};

// Lock a card rotation
const lockCardRotation = function (cardContent) {
  removeHandlers(cardContent);
  cardRotate(cardContent, '180deg');
};

// Add handlers to menù buttons
for (let i = 0; i < inputBtns.length; i++) {
  inputBtns[i].addEventListener('click', () => {
    checkInput(i);
    // Remove the cards selector
    toggleCardsSelector('off');
  });
}
