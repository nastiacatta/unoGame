/**
 * @typedef {object} Player
 * @property {string} name - The name of the player.
 * @property {boolean} human - Indicates whether the player is human (true) or computer (false).
 * @property {Card[]} hand - An array of card objects representing the player's hand.
 */

/**
 * @typedef {object} Card
 * @property {string} color - The color of the card.
 * @property {string} value - The value of the card.
 */

/**
 * @typedef {object} Game
 * @property {Player[]} players - An array of player objects.
 * @property {Card[]} deck - An array of card objects representing the deck.
 * @property {Card[]} discardPile - An array of card objects representing the discard pile.
 * @property {number} currentPlayerIndex - The index of the current player in the players array.
 * @property {number} direction - The direction of play (-1 for reverse, 1 for forward).
 * @property {string} currentColor - The current color.
 */

/**
 * @namespace Uno
 * @description A namespace for the Uno game.
 * @version 1.0.0
 * @author Anastasia Cattaneo
 */
const Uno = Object.create(null);

// ----------------------------------------------------------------------------//
// Constants                                                                   //
// ----------------------------------------------------------------------------//

/**
 * The special color used for special cards.
 * @type {string}
 * @memberof Uno
 * @constant
 */
Uno.specialColor = "special";

/**
 * The available colors in the Uno game.
 * @type {string[]}
 * @memberof Uno
 * @constant
 */
Uno.colors = ["red", "yellow", "green", "blue"];

/**
 * The available numbers in the Uno game.
 * @type {string[]}
 * @memberof Uno
 * @constant
 */
Uno.numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * The available action cards in the Uno game.
 * @type {string[]}
 * @memberof Uno
 * @constant
 */
Uno.actions = ["Skip", "Draw Two", "Reverse"];

/**
 * The available special cards in the Uno game.
 * @type {string[]}
 * @memberof Uno
 * @constant
 */
Uno.specialCards = ["Wild", "Wild Draw Four"];

// ----------------------------------------------------------------------------//
// Methods                                                                     //
// ----------------------------------------------------------------------------//

/**
 * Creates a new Uno game.
 * @param {Player[]} players - An array of player objects.
 * @param {Card[]} deck - An array of card objects representing the deck.
 * @returns {Game} The created Uno game object.
 * @memberof Uno
 */
Uno.newGame = function (players, deck) {
  return {
    players,
    deck,
    discardPile: [],
    currentPlayerIndex: 0,
    direction: 1,
    currentColor: null,
  };
};

/**
 * Starts the Uno game by shuffling the deck, giving initial cards to players, and setting the first card on the discard pile.
 * @param {Game} game - The Uno game object.
 * @memberof Uno
 */
Uno.startGame = function (game) {
  Uno.shuffleDeck(game.deck);
  Uno.giveInitialCards(game);
  Uno.setTheFirstCard(game);
};

/**
 * Sets the first card on the discard pile.
 * @param {Game} game - The Uno game object.
 * @memberof Uno
 */
Uno.setTheFirstCard = function (game) {
  const cards = Uno.drawCardsFromDeck(game);
  if (cards.length > 0) {
    Uno.discardCard(cards[0], game);
  }
};

/**
 * Gets the playable cards for a player based on the current color and value.
 * @param {Player} player - The player object.
 * @param {string} currentColor - The current color.
 * @param {string} currentValue - The current value.
 * @returns {Card[]} An array of playable card objects.
 * @memberof Uno
 */
Uno.getPlayableCards = function (player, currentColor, currentValue) {
  const cards = player.hand;
  const playableCards = [];

  for (const card of cards) {
    if (
      card.color === Uno.specialColor ||
      card.color === currentColor ||
      card.value === currentValue
    ) {
      playableCards.push(card);
    }
  }

  return playableCards;
};

/**
 * Checks if the given card is an action card.
 * @param {Card} card - The card to check.
 * @returns {boolean} - True if the card is an action card, false otherwise.
 * @memberof Uno
 */
Uno.isActionCard = function (card) {
  return (
    Uno.actions.indexOf(card.value) !== -1 ||
    Uno.specialCards.indexOf(card.value) !== -1
  );
};

/**
 * Checks if it's the first turn of the game.
 * @param {Card[]} discardPile - An array of card objects on the discard pile.
 * @returns {boolean} True if it's the first turn, false otherwise.
 * @memberof Uno
 */
Uno.isTheFirstTurn = function (discardPile) {
  return discardPile.length === 1;
};

/**
 * Gets the current card on the discard pile.
 * @param {Card[]} discardPile - An array of card objects on the discard pile.
 * @returns {Card} The current card object.
 * @memberof Uno
 */
Uno.getCurrentCard = function (discardPile) {
  const lastCardIndex = discardPile.length - 1;
  return discardPile[lastCardIndex] || null;
};

/**
 * Gets the current value of the discard pile.
 * @param {Card[]} discardPile - An array of card objects on the discard pile.
 * @returns {string} The current value.
 * @memberof Uno
 */
Uno.getCurrentValue = function (discardPile) {
  return Uno.getCurrentCard(discardPile)?.value || null;
};

/**
 * Gets the current player in the game.
 * @param {Game} game - The Uno game object.
 * @returns {Player} The current player object.
 * @memberof Uno
 */
Uno.getCurrentPlayer = function (game) {
  return game.players[game.currentPlayerIndex];
};

/**
 * Gets the current color in the game.
 * @param {Game} game - The Uno game object.
 * @returns {string} The current color.
 * @todo check for refactoring later
 * @memberof Uno
 */
Uno.getCurrentColor = function (game) {
  return game.currentColor || Uno.getCurrentCard(game.discardPile).color;
};

/**
 * Sets the current color in the game.
 * @param {Game} game - The Uno game object.
 * @param {string} color - The color to set.
 * @memberof Uno
 */
Uno.setCurrentColor = function (game, color) {
  game.currentColor = color;
};

/**
 * Plays a card from a player's hand.
 * @param {Card} card - The card to play.
 * @param {Player} player - The player object.
 * @param {Game} game - The Uno game object.
 * @returns {boolean} True if the card was played successfully, false otherwise.
 * @memberof Uno
 */
Uno.playCard = function (card, player, game) {
  const index = player.hand.indexOf(card);

  if (index === -1) return false;

  const playedCards = player.hand.splice(index, 1);
  Uno.discardCard(playedCards[0], game);
  return true;
};

/**
 * Applies the action of the current card in the game.
 * @param {Game} game - The Uno game object.
 * @memberof Uno
 */
Uno.applyAction = function (game) {
  Uno.setNextPlayerIndex(game);
};

/**
 * Draws a card from the deck for the current player in the game.
 * @param {Game} game - The Uno game object.
 * @returns {boolean} True if a card was drawn, false otherwise.
 * @memberof Uno
 */
Uno.drawCardFromDeckForTheCurrentPlayer = function (game) {
  const currentPlayer = Uno.getCurrentPlayer(game);
  const currentColor = Uno.getCurrentColor(game);
  const currentValue = Uno.getCurrentValue(game.discardPile);
  const playableCards = Uno.getPlayableCards(
    currentPlayer,
    currentColor,
    currentValue
  );

  if (playableCards.length === 0) {
    const cards = Uno.drawCardsFromDeck(game);
    Uno.addCardsToPlayerHand(currentPlayer, cards);
    return true;
  } else {
    return false;
  }
};

/**
 * Applies the special action of the current card in the game.
 * @param {Game} game - The game object.
 * @memberof Uno
 */
Uno.applySpecialAction = function (game) {
  const currentCard = Uno.getCurrentCard(game.discardPile);
  const firstTurn = Uno.isTheFirstTurn(game.discardPile);

  switch (currentCard.value) {
    case "Skip": {
      Uno.setNextPlayerIndex(game, firstTurn ? 1 : 2);
      break;
    }
    case "Draw Two": {
      if (!firstTurn) Uno.setNextPlayerIndex(game);
      const cards = Uno.drawCardsFromDeck(game, 2);
      const currentPlayer = Uno.getCurrentPlayer(game);
      Uno.addCardsToPlayerHand(currentPlayer, cards);
      break;
    }
    case "Reverse": {
      Uno.reverseDirection(game);
      Uno.setNextPlayerIndex(game);
      break;
    }
    case "Wild": {
      Uno.changeToRandomColor(game);
      if (!firstTurn) Uno.setNextPlayerIndex(game);
      break;
    }
    case "Wild Draw Four": {
      if (!firstTurn) Uno.setNextPlayerIndex(game);
      const cards = Uno.drawCardsFromDeck(game, 4);
      const currentPlayer = Uno.getCurrentPlayer(game);
      Uno.addCardsToPlayerHand(currentPlayer, cards);
      Uno.changeToRandomColor(game);
      break;
    }
  }
};

/**
 * Changes the current color of the game to a random color.
 * @param {Game} game - The game object.
 * @memberof Uno
 */
Uno.changeToRandomColor = function (game) {
  const randomIndex = Math.floor(Math.random() * Uno.colors.length);
  const newColor = Uno.colors[randomIndex];
  Uno.setCurrentColor(game, newColor);
};

/**
 * Reverses the direction of play.
 * @param {Game} game - The Uno game object.
 * @memberof Uno
 */
Uno.reverseDirection = function (game) {
  game.direction *= -1;
};

/**
 * Sets the index of the next player in the game based on the current player index and direction.
 * @param {Game} game - The game object.
 * @param {number} [increment=1] - The increment value to determine the next player index. Defaults to 1.
 * @memberof Uno
 */
Uno.setNextPlayerIndex = function (game, increment = 1) {
  game.currentPlayerIndex = Uno.getNextPlayerIndex(
    game.currentPlayerIndex,
    game.direction,
    game.players.length,
    increment
  );
};

/**
 * Calculates and returns the index of the next player based on the current player index, direction, and total number of players.
 * @param {number} currentPlayerIndex - The index of the current player.
 * @param {number} direction - The direction of play (-1 for reverse, 1 for forward).
 * @param {number} totalPlayers - The total number of players in the game.
 * @param {number} [increment=1] - The increment value to determine the next player index. Defaults to 1.
 * @returns {number} The index of the next player.
 * @memberof Uno
 */
Uno.getNextPlayerIndex = function (
  currentPlayerIndex,
  direction,
  totalPlayers,
  increment = 1
) {
  currentPlayerIndex += direction * increment;

  while (currentPlayerIndex < 0) {
    currentPlayerIndex += totalPlayers;
  }
  while (currentPlayerIndex >= totalPlayers) {
    currentPlayerIndex -= totalPlayers;
  }

  return currentPlayerIndex;
};

/**
 * Creates and returns a new deck of Uno cards.
 * @returns {Card[]} An array of card objects representing the Uno deck.
 * @memberof Uno
 */
Uno.createDeck = function () {
  const deck = [];

  for (const color of Uno.colors) {
    // each suit consisting of one zero
    deck.push(Uno.createCard(color, ...Uno.numbers.slice(0, 1)));

    // two each of 1 through 9
    for (const number of Uno.numbers.slice(1)) {
      deck.push(Uno.createCard(color, number));
      deck.push(Uno.createCard(color, number));
    }

    // and two each of the action cards "Skip", "Draw Two", and "Reverse"
    for (const action of Uno.actions) {
      deck.push(Uno.createCard(color, action));
      deck.push(Uno.createCard(color, action));
    }
  }

  // The deck also contains four "Wild" cards, four "Wild Draw Four"
  for (let i = 0; i < 4; i++) {
    deck.push(
      ...Uno.specialCards
        .slice(0, 2)
        .map((card) => Uno.createCard(Uno.specialColor, card))
    );
  }

  // one "Wild Shuffle Hands"
  // deck.push(
  //   ...Uno.specialCards
  //     .slice(2, 3)
  //     .map((card) => Uno.createCard(Uno.specialColor, card))
  // );

  // and three "Wild Customizable"
  // for (let i = 0; i < 3; i++) {
  //   deck.push(
  //     ...Uno.specialCards
  //       .slice(-1)
  //       .map((card) => Uno.createCard(Uno.specialColor, card))
  //   );
  // }

  return deck;
};

/**
 * Shuffles a deck of cards using the Fisher-Yates algorithm.
 * @param {Array} deck - The array representing the deck of cards to shuffle.
 */
Uno.shuffleDeck = function (deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
};

/**
 * Creates a new card object with the specified color and value.
 * @param {string} color - The color of the card.
 * @param {string} value - The value of the card.
 * @returns {Card} The created card object.
 * @memberof Uno
 */
Uno.createCard = function (color, value) {
  return {
    color,
    value,
  };
};

/**
 * Creates a new player object with the specified name and human status.
 * @param {string} name - The name of the player.
 * @param {boolean} human - Indicates whether the player is human (true) or computer (false).
 * @returns {Player} The created player object.
 * @memberof Uno
 */
Uno.createPlayer = function (name, human = false) {
  return {
    name,
    human,
    hand: [],
  };
};

/**
 * Creates an array of player objects based on the specified name and number of computer players.
 * The first player in the array is always a human player.
 * @param {string} name - The name of the human player.
 * @param {number} numOfComputerPlayers - The number of computer players to create.
 * @returns {Player[]} An array of player objects, including the human player and computer players.
 * @memberof Uno
 */
Uno.createPlayers = function (name, numOfComputerPlayers) {
  const players = [Uno.createPlayer(name, true)];

  for (let i = 0; i < numOfComputerPlayers; i++) {
    players.push(Uno.createPlayer(`Computer ${i}`, false));
  }

  return players;
};

/**
 * Adds cards to a player's hand.
 * @param {Player} player - The player object.
 * @param {Card[]} cards - An array of card objects to add.
 * @memberof Uno
 */
Uno.addCardsToPlayerHand = function (player, cards) {
  for (let i = 0; i < cards.length; i++) {
    Uno.addCardToPlayerHand(player, cards[i]);
  }
};

/**
 * Adds a card to the player's hand.
 * @param {Player} player - The player to whom the card is added.
 * @param {Card} card - The card to add to the player's hand.
 * @memberof Uno
 */
Uno.addCardToPlayerHand = function (player, card) {
  player.hand.push(card);
};

/**
 * Removes all the items in the discard pile except the last one and returns them in a new array.
 * @param {Card[]} discardPile - The array representing the discard pile.
 * @returns {Card[]} An array containing all the items in the discard pile except the last one.
 * @memberof Uno
 */
Uno.removeAndReturnAllButLast = function (discardPile) {
  const allButLast = discardPile.slice(0, discardPile.length - 1);
  discardPile.length = 1; // Reset array to contain only the last element
  return allButLast;
};

/**
 * Sets the deck of the game to the specified deck.
 * @param {Card[]} deck - The new deck to set.
 * @param {Game} game - The current game object.
 * @memberof Uno
 */
Uno.setDeck = function (deck, game) {
  game.deck = deck;
};

/**
 * Draws cards from the deck.
 * @param {Game} game - The Uno game object.
 * @param {number} [numCards=1] - The number of cards to draw.
 * @returns {Card[]} An array of drawn card objects.
 * @memberof Uno
 */
Uno.drawCardsFromDeck = function (game, numCards = 1) {
  const drawnCards = [];

  for (let i = 0; i < numCards; i++) {
    if (game.deck.length > 0) {
      drawnCards.push(game.deck.pop());
    } else {
      const newDeck = Uno.removeAndReturnAllButLast(game.discardPile);
      Uno.shuffleDeck(newDeck);
      Uno.setDeck(newDeck, game);
      console.log("New deck created:", newDeck);
      return Uno.drawCardsFromDeck(game, numCards);
    }
  }

  return drawnCards;
};

/**
 * Discards a card to the discard pile.
 * @param {Card} card - The card to discard.
 * @param {Game} game - The Uno game object.
 * @memberof Uno
 */
Uno.discardCard = function (card, game) {
  game.discardPile.push(card);
  Uno.setCurrentColor(game, card.color);
};

/**
 * Gets seven initial cards for the game by drawing them from the deck.
 * @param {Game} game - The current game object.
 * @returns {Card[]} An array of seven initial cards.
 * @memberof Uno
 */
Uno.getSevenInitialCards = function (game) {
  return Uno.drawCardsFromDeck(game, 7);
};

/**
 * Assigns the initial cards to the players at the beginning of the game.
 * @param {Game} game - The current game object.
 * @memberof Uno
 */
Uno.giveInitialCards = function (game) {
  for (let i = 0; i < game.players.length; i++) {
    const currentPlayer = game.players[i];
    const cards = Uno.getSevenInitialCards(game);
    Uno.addCardsToPlayerHand(currentPlayer, cards);
  }
};

// ----------------------------------------------------------------------------//
// Exports                                                                     //
// ----------------------------------------------------------------------------//

export default Object.freeze(Uno);
