'use strict';

/* **************************MENU************************************ */

/*  DOM ELEMENTS */

const cardsSelector = document.querySelector('.select-cards');
const inputBtns = document.querySelectorAll(
  '.choose-cards-n-buttons-container button'
);
const scoreSection = document.querySelector('.score-section');
const currentScoreElm = document.querySelector('.current-score');
const highestScoreElm = document.querySelector('.highest-score');
const timerElm = document.querySelector('.timer');

/*  VARIABLES  */

let currentScore;
let highestScore;
let time;

/* FUNCTIONS */

// Hide / Show the menù
const toggleCardsSelector = function (toggle) {
  if (toggle === 'on') {
    cardsSelector.classList.remove('hidden');
  } else if (toggle === 'off') {
    cardsSelector.classList.add('hidden');
  }
};

// Hide / Show the score section
const toggleScoreSection = function (toggle) {
  if (toggle === 'on') {
    scoreSection.classList.remove('hidden');
  } else if (toggle === 'off') {
    scoreSection.classList.add('hidden');
  }
};

/* TODO timer


let minutes = 0;
let seconds = 0;

const timerCount = function () {
  if (seconds < 60) {
    seconds += 1;
  } else if (seconds === 60) {
    seconds = 0;
    minutes += 1;
  }

  renderTime(minutes, seconds);
};

// renders time in DOM
const renderTime = function (minutes, seconds) {
  timerElm.innerHTML = `
  <div class="minutes">${minutes} min </div>
  
  <div class="seconds">${seconds} sec</div>
  `;
};
 */
// Check the user selection (menu)
const checkInput = function (button) {
  toggleScoreSection('on');
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

const updateScore = function () {
  currentScore += 100;

  // score calcolando con l'ipotetico timer
  // currentScore += Math.floor(100 - minutes * 3 + cards.length * 10);

  currentScoreElm.textContent = currentScore;
};

/* **************************INITIALIZE THE GAME************************************ */

/* DOM ELEMENTS */

const cardGrid = document.querySelector('.card-grid');
let cards = [];

/* FUNCTIONS */

// Reset the cards in DOM
function resetCards() {
  cardGrid.innerHTML = '';
  cards = [];
}

const init = function () {
  // TODO Check for highscore in localstorage and show it
  currentScore = 0;
  toggleCardsSelector('on');
  toggleScoreSection('off');
  resetCards();
};
init();

// CHECKING PLAYER MENU INPUT

// Add handlers to menù buttons
for (let i = 0; i < inputBtns.length; i++) {
  inputBtns[i].addEventListener('click', () => {
    checkInput(i);
    // Remove the cards selector
    toggleCardsSelector('off');
  });
}

/* **************************RENDERING CARDS************************************ */

/* VARIABLES AND OBJECT CONSTRUCTORS */

const CardConstructor = function () {
  this.cardId, this.coupleValue, this.imgSrc, this.state, this.domRef;
};

/* FUNCTIONS */

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

// RENDERING CARDS

const renderCards = function (cardsNumber) {
  // We are gonna push a couple inside the cards array, so we need to iterate for half the cardsNumber to avoid duplicates

  for (let i = 0; i < cardsNumber / 2; i++) {
    // Create card objects from prototype and set the properties
    let currentCard = new CardConstructor();
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
    // define ID of card object
    cards[i].cardId = i + 1;

    const cardDomElm = `
    <div class="card" id="card-${i}">
      <div class="content">
          <div class="card-front">?</div>
          <div class="card-back">              
            <img src="images/img-${cards[i].imgSrc}.jpg" alt="">
          </div>
      </div>`;

    // Render the selected number of cards in DOM in a grid
    const RenderDomElm = function () {
      cardGrid.innerHTML += cardDomElm;
    };
    RenderDomElm();

    // add DOM reference to card object (notice the .id)
    cards[i].domRef = document.querySelector(`#card-${i}`).id;
  }
};

/* **************************PLAYER ROUND************************************ */

function compareCards(cards) {
  if (
    cards[0].imgSrc === cards[1].imgSrc &&
    cards[0].cardId !== cards[1].cardId
  ) {
    handleAnimation.validateCard(cards[0]);
    handleAnimation.validateCard(cards[1]);
    cards.splice(0, 2);
    updateScore();
    checkForEndGame();
  } else if (cards[0].imgSrc !== cards[1].imgSrc) {
    handleAnimation.coverCard(cards[0]);
    handleAnimation.coverCard(cards[1]);
    cards.splice(0, 2);
  }
}

// Create an array that will contain the cards to check equality for
const cardsToCompare = [];

document.addEventListener('click', function (e) {
  // get the DOM node
  let selectedCardElm = e.target.parentNode.parentNode;

  cards.forEach(card => {
    // Check if the domRef stored into the object equals the node id and if card is covered
    if (card.domRef === selectedCardElm.id && card.state === 'covered') {
      // uncover the card
      handleAnimation.uncoverCard(card);

      // Push a copy of selected card (object) into an array in order to be compared

      cardsToCompare.push(card);

      if (cardsToCompare.length === 2) {
        setTimeout(function () {
          compareCards(cardsToCompare);
        }, 500);
      }
    }
  });
});

/* **************************END GAME************************************ */

/* DOM ELEMENTS */
const endGameScreen = document.querySelector('.endgame-screen');
const btnStartNewGame = document.querySelector('.start-new-game');
const endGameScoreElm = document.querySelector('.modal h3');

/* FUNCTIONS */

const toggleEndScreen = function () {
  endGameScreen.classList.toggle('hidden');
};

const displayEndScore = function () {
  endGameScoreElm.textContent += ` ${currentScore} points!`;
};

// check if cards are all validated and end game
const checkForEndGame = function () {
  let count = 0;

  for (let i = 0; i < cards.length; i++) {
    if (cards[i].state === 'validated') count += 1;
  }

  if (count === cards.length) {
    toggleEndScreen();
    displayEndScore();
  }
};

// PLAY AGAIN

btnStartNewGame.addEventListener('click', function () {
  toggleEndScreen();
  init();
});

/* **************************ANIMATIONS************************************ */

const handleAnimation = {
  // Get the card content DOM elm (the element on which to apply the rotation)
  getCardContent: function (card) {
    this.cardContent = document.querySelector(`#${card.domRef} .content`);
  },

  cardContent: '',

  // Rotate a card
  cardRotate: function (cardContent, deg) {
    cardContent.style.transform = `rotateY(${deg})`;
  },

  // Reveal a card
  uncoverCard: function (card) {
    card.state = 'uncovered';
    this.getCardContent(card);
    this.cardRotate(this.cardContent, '180deg');
  },

  // Hide a card
  coverCard: function (card) {
    card.state = 'covered';
    this.getCardContent(card);
    this.cardRotate(this.cardContent, '0deg');
  },

  // Validate a card
  validateCard: function (card) {
    card.state = 'validated';
    this.getCardContent(card);
    this.cardContent.children[1].style.borderColor = '#DAA53B';
  },
};
