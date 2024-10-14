/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
import { expect } from "chai";
import Uno from "../src/api.js";

describe("Uno.newGame", function () {
  it("should create a new game object with the provided players and deck", function () {
    // Arrange
    const players = [
      {
        name: "Player 1",
        human: true,
        hand: [
          { color: "red", value: "5" },
          { color: "blue", value: "9" },
        ],
      },
      {
        name: "Player 2",
        human: true,
        hand: [
          { color: "green", value: "3" },
          { color: "yellow", value: "7" },
        ],
      },
    ];
    const deck = [
      { color: "red", value: "2" },
      { color: "blue", value: "4" },
    ];

    // Act
    const game = Uno.newGame(players, deck);

    // Assert
    expect(game.players).to.deep.equal(players);
    expect(game.deck).to.deep.equal(deck);
    expect(game.discardPile).to.deep.equal([]);
    expect(game.currentPlayerIndex).to.equal(0);
    expect(game.direction).to.equal(1);
    expect(game.currentColor).to.equal(null);
  });
});

describe("Uno.getPlayableCards", function () {
  it("should return an array of playable cards for the given player, current color, and current value", function () {
    // Arrange
    const player = {
      name: "Player 1",
      human: true,
      hand: [
        { color: "red", value: "5" },
        { color: "blue", value: "9" },
        { color: "green", value: "3" },
        { color: "yellow", value: "7" },
      ],
    };
    const currentColor = "blue";
    const currentValue = "9";

    // Act
    const playableCards = Uno.getPlayableCards(
      player,
      currentColor,
      currentValue
    );

    // Assert
    expect(playableCards).to.deep.equal([{ color: "blue", value: "9" }]);
  });

  it("should return an empty array if there are no playable cards for the given player, current color, and current value", function () {
    // Arrange
    const player = {
      name: "Player 1",
      human: true,
      hand: [
        { color: "red", value: "5" },
        { color: "green", value: "3" },
        { color: "yellow", value: "7" },
      ],
    };
    const currentColor = "blue";
    const currentValue = "9";

    // Act
    const playableCards = Uno.getPlayableCards(
      player,
      currentColor,
      currentValue
    );

    // Assert
    expect(playableCards).to.deep.equal([]);
  });

  it("should include cards with special color in the playable cards", function () {
    // Arrange
    const player = {
      name: "Player 1",
      human: true,
      hand: [
        { color: "red", value: "5" },
        { color: "special", value: "Wild" },
      ],
    };
    const currentColor = "blue";
    const currentValue = "9";

    // Act
    const playableCards = Uno.getPlayableCards(
      player,
      currentColor,
      currentValue
    );

    // Assert
    expect(playableCards).to.deep.equal([{ color: "special", value: "Wild" }]);
  });
});

describe("Uno.isActionCard", function () {
  it("should return true if the card is an action card", function () {
    // Arrange
    const actionCard = { color: "red", value: "Skip" };

    // Act
    const isActionCard = Uno.isActionCard(actionCard);

    // Assert
    expect(isActionCard).to.be.true;
  });

  it("should return true if the card is a special card", function () {
    // Arrange
    const specialCard = { color: "special", value: "Wild" };

    // Act
    const isActionCard = Uno.isActionCard(specialCard);

    // Assert
    expect(isActionCard).to.be.true;
  });

  it("should return false if the card is not an action card or special card", function () {
    // Arrange
    const regularCard = { color: "blue", value: "5" };

    // Act
    const isActionCard = Uno.isActionCard(regularCard);

    // Assert
    // eslint-disable-next-line no-unused-expressions
    expect(isActionCard).to.be.false;
  });
});

describe("Uno.isTheFirstTurn", function () {
  it("should return true if the discard pile has only one card", function () {
    // Arrange
    const discardPile = [{ color: "red", value: "5" }];

    // Act
    const isFirstTurn = Uno.isTheFirstTurn(discardPile);

    // Assert
    expect(isFirstTurn).to.be.true;
  });

  it("should return false if the discard pile has more than one card", function () {
    // Arrange
    const discardPile = [
      { color: "blue", value: "3" },
      { color: "green", value: "Skip" },
    ];

    // Act
    const isFirstTurn = Uno.isTheFirstTurn(discardPile);

    // Assert
    expect(isFirstTurn).to.be.false;
  });
});

describe("Uno.getCurrentCard", function () {
  it("should return the last card in the discard pile", function () {
    // Arrange
    const discardPile = [
      { color: "blue", value: "3" },
      { color: "green", value: "Skip" },
      { color: "red", value: "8" },
    ];
    const expectedCard = { color: "red", value: "8" };

    // Act
    const currentCard = Uno.getCurrentCard(discardPile);

    // Assert
    expect(currentCard).to.deep.equal(expectedCard);
  });

  it("should return null if the discard pile is empty", function () {
    // Arrange
    const discardPile = [];

    // Act
    const currentCard = Uno.getCurrentCard(discardPile);

    // Assert
    expect(currentCard).to.be.null;
  });
});

describe("Uno.getCurrentValue", function () {
  it("should return the value of the current card in the discard pile", function () {
    // Arrange
    const discardPile = [
      { color: "blue", value: "3" },
      { color: "green", value: "Skip" },
      { color: "red", value: "8" },
    ];
    const expectedValue = "8";

    // Act
    const currentValue = Uno.getCurrentValue(discardPile);

    // Assert
    expect(currentValue).to.equal(expectedValue);
  });

  it("should return null if the discard pile is empty", function () {
    // Arrange
    const discardPile = [];

    // Act
    const currentValue = Uno.getCurrentValue(discardPile);

    // Assert
    expect(currentValue).to.be.null;
  });
});

describe("Uno.getCurrentPlayer", function () {
  it("should return the current player based on the currentPlayerIndex", function () {
    // Arrange
    const game = {
      players: [
        { name: "Player 1" },
        { name: "Player 2" },
        { name: "Player 3" },
      ],
      currentPlayerIndex: 1,
    };
    const expectedPlayer = { name: "Player 2" };

    // Act
    const currentPlayer = Uno.getCurrentPlayer(game);

    // Assert
    expect(currentPlayer).to.deep.equal(expectedPlayer);
  });
});

describe("Uno.getCurrentColor", function () {
  it("should return the current color if it exists in the game object", function () {
    // Arrange
    const game = {
      currentColor: "blue",
      discardPile: [],
    };
    const expectedColor = "blue";

    // Act
    const currentColor = Uno.getCurrentColor(game);

    // Assert
    expect(currentColor).to.equal(expectedColor);
  });

  it("should return the color of the current card if currentColor is not set", function () {
    // Arrange
    const game = {
      currentColor: null,
      discardPile: [
        { color: "red", value: "5" },
        { color: "green", value: "Skip" },
        { color: "blue", value: "2" },
      ],
    };
    const expectedColor = "blue";

    // Act
    const currentColor = Uno.getCurrentColor(game);

    // Assert
    expect(currentColor).to.equal(expectedColor);
  });
});

describe("Uno.setCurrentColor", function () {
  it("should set the current color of the game", function () {
    // Arrange
    const game = {
      currentColor: null,
    };
    const color = "blue";

    // Act
    Uno.setCurrentColor(game, color);

    // Assert
    expect(game.currentColor).to.equal(color);
  });
});

describe("Uno.playCard", function () {
  it("should return false if the card is not in the player's hand", function () {
    // Arrange
    const card = { color: "green", value: "2" };
    const player = {
      hand: [
        { color: "red", value: "5" },
        { color: "blue", value: "3" },
      ],
    };
    const game = {
      players: [player],
      discardPile: [],
    };

    // Act
    const result = Uno.playCard(card, player, game);

    // Assert
    expect(result).to.be.false;
    expect(game.discardPile).to.be.empty;
  });
});

describe("Uno.reverseDirection", function () {
  it("should reverse the direction of play in the game", function () {
    // Arrange
    const game = {
      direction: 1,
    };

    // Act
    Uno.reverseDirection(game);

    // Assert
    expect(game.direction).to.equal(-1);
  });

  it("should reverse the direction of play twice to restore the original direction", function () {
    // Arrange
    const game = {
      direction: 1,
    };

    // Act
    Uno.reverseDirection(game);
    Uno.reverseDirection(game);

    // Assert
    expect(game.direction).to.equal(1);
  });
});

describe("Uno.changeToRandomColor", function () {
  it("should change the current color to a random color from the available colors", function () {
    // Arrange
    const game = {
      currentColor: null,
    };

    // Mocking Math.random to always return 0.5 for predictable test
    const originalRandom = Math.random;
    Math.random = () => 0.5;

    // Act
    Uno.changeToRandomColor(game);

    // Assert
    expect(game.currentColor).to.equal("green");

    // Restore Math.random
    Math.random = originalRandom;
  });
});

describe("Uno.getNextPlayerIndex", function () {
  it("should calculate the next player index correctly when increment is 1", function () {
    // Arrange
    const currentPlayerIndex = 2;
    const direction = 1;
    const totalPlayers = 4;

    // Act
    const nextPlayerIndex = Uno.getNextPlayerIndex(
      currentPlayerIndex,
      direction,
      totalPlayers
    );

    // Assert
    expect(nextPlayerIndex).to.equal(3);
  });

  it("should calculate the next player index correctly when increment is 2", function () {
    // Arrange
    const currentPlayerIndex = 2;
    const direction = 1;
    const totalPlayers = 4;

    // Act
    const nextPlayerIndex = Uno.getNextPlayerIndex(
      currentPlayerIndex,
      direction,
      totalPlayers,
      2
    );

    // Assert
    expect(nextPlayerIndex).to.equal(0);
  });

  it("should calculate the next player index correctly when direction is -1", function () {
    // Arrange
    const currentPlayerIndex = 0;
    const direction = -1;
    const totalPlayers = 3;

    // Act
    const nextPlayerIndex = Uno.getNextPlayerIndex(
      currentPlayerIndex,
      direction,
      totalPlayers
    );

    // Assert
    expect(nextPlayerIndex).to.equal(2);
  });
});

describe("Uno.createDeck", function () {
  it("should create a deck with the correct number of cards", function () {
    // Act
    const deck = Uno.createDeck();

    // Assert
    expect(deck.length).to.equal(108);
  });

  it("should contain the correct number of cards for each color", function () {
    // Act
    const deck = Uno.createDeck();

    // Assert
    expect(countCardsByColor(deck, "red")).to.equal(25);
    expect(countCardsByColor(deck, "yellow")).to.equal(25);
    expect(countCardsByColor(deck, "green")).to.equal(25);
    expect(countCardsByColor(deck, "blue")).to.equal(25);
  });

  it("should contain the correct number of number cards for each color", function () {
    // Act
    const deck = Uno.createDeck();

    // Assert
    expect(countCardsByValue(deck, "0")).to.equal(4);
    expect(countCardsByValue(deck, "1")).to.equal(8);
    expect(countCardsByValue(deck, "2")).to.equal(8);
    expect(countCardsByValue(deck, "3")).to.equal(8);
    expect(countCardsByValue(deck, "4")).to.equal(8);
    expect(countCardsByValue(deck, "5")).to.equal(8);
    expect(countCardsByValue(deck, "6")).to.equal(8);
    expect(countCardsByValue(deck, "7")).to.equal(8);
    expect(countCardsByValue(deck, "8")).to.equal(8);
    expect(countCardsByValue(deck, "9")).to.equal(8);
  });

  it("should contain the correct number of action cards for each color", function () {
    // Act
    const deck = Uno.createDeck();

    // Assert
    expect(countCardsByValue(deck, "Skip")).to.equal(8);
    expect(countCardsByValue(deck, "Draw Two")).to.equal(8);
    expect(countCardsByValue(deck, "Reverse")).to.equal(8);
  });

  it("should contain the correct number of special cards", function () {
    // Act
    const deck = Uno.createDeck();

    // Assert
    expect(countCardsByValue(deck, "Wild")).to.equal(4);
    expect(countCardsByValue(deck, "Wild Draw Four")).to.equal(4);
  });

  it("should contain the correct number of special color cards", function () {
    // Act
    const deck = Uno.createDeck();

    // Assert
    expect(countCardsByColor(deck, Uno.specialColor)).to.equal(8);
  });
});

// Helper function to count the number of cards with a specific color in the deck
function countCardsByColor(deck, color) {
  return deck.filter((card) => card.color === color).length;
}

// Helper function to count the number of cards with a specific value in the deck
function countCardsByValue(deck, value) {
  return deck.filter((card) => card.value === value).length;
}

describe("Uno.shuffleDeck", function () {
  it("should shuffle the deck", function () {
    // Arrange
    const originalDeck = Uno.createDeck();
    const deck = originalDeck.slice();

    // Act
    Uno.shuffleDeck(deck);

    // Assert
    expect(deck).to.not.deep.equal(originalDeck);
  });

  it("should preserve the number of cards in the deck", function () {
    // Arrange
    const deck = Uno.createDeck();
    const originalLength = deck.length;

    // Act
    Uno.shuffleDeck(deck);

    // Assert
    expect(deck.length).to.equal(originalLength);
  });

  it("should preserve the cards in the deck", function () {
    // Arrange
    const originalDeck = Uno.createDeck();
    const deck = originalDeck.slice();

    // Act
    Uno.shuffleDeck(deck);

    // Assert
    expect(deck).to.have.members(originalDeck);
  });
});

describe("Uno.createCard", function () {
  it("should create a card with the specified color and value", function () {
    // Arrange
    const color = "red";
    const value = "5";

    // Act
    const card = Uno.createCard(color, value);

    // Assert
    expect(card).to.deep.equal({ color, value });
  });
});

describe("Uno.createPlayer", function () {
  it("should create a player with the specified name and human status", function () {
    // Arrange
    const name = "Player 1";
    const human = true;

    // Act
    const player = Uno.createPlayer(name, human);

    // Assert
    expect(player).to.deep.equal({ name, human, hand: [] });
  });

  it("should create a player with the specified name and default human status", function () {
    // Arrange
    const name = "Player 2";

    // Act
    const player = Uno.createPlayer(name);

    // Assert
    expect(player).to.deep.equal({ name, human: false, hand: [] });
  });
});

describe("Uno.createPlayers", function () {
  it("should create an array of players with the specified human player name and number of computer players", function () {
    // Arrange
    const humanPlayerName = "Player 1";
    const numOfComputerPlayers = 3;

    // Act
    const players = Uno.createPlayers(humanPlayerName, numOfComputerPlayers);

    // Assert
    expect(players.length).to.equal(numOfComputerPlayers + 1);
    expect(players[0]).to.deep.equal({
      name: humanPlayerName,
      human: true,
      hand: [],
    });
    for (let i = 1; i < players.length; i++) {
      expect(players[i]).to.deep.equal({
        name: `Computer ${i - 1}`,
        human: false,
        hand: [],
      });
    }
  });

  it("should create an array of players with the specified human player name and no computer players", function () {
    // Arrange
    const humanPlayerName = "Player 2";
    const numOfComputerPlayers = 0;

    // Act
    const players = Uno.createPlayers(humanPlayerName, numOfComputerPlayers);

    // Assert
    expect(players.length).to.equal(1);
    expect(players[0]).to.deep.equal({
      name: humanPlayerName,
      human: true,
      hand: [],
    });
  });
});

describe("Uno.addCardToPlayerHand", function () {
  it("should add the specified card to the player's hand", function () {
    // Arrange
    const player = Uno.createPlayer("Player 1");
    const card = Uno.createCard("red", "5");

    // Act
    Uno.addCardToPlayerHand(player, card);

    // Assert
    expect(player.hand.length).to.equal(1);
    expect(player.hand[0]).to.deep.equal(card);
  });
});

describe("Uno.addCardsToPlayerHand", function () {
  it("should add the specified cards to the player's hand", function () {
    // Arrange
    const player = Uno.createPlayer("Player 1");
    const cards = [
      Uno.createCard("red", "5"),
      Uno.createCard("blue", "7"),
      Uno.createCard("green", "Skip"),
    ];

    // Act
    Uno.addCardsToPlayerHand(player, cards);

    // Assert
    expect(player.hand.length).to.equal(3);
    expect(player.hand).to.deep.equal(cards);
  });
});

describe("Uno.removeAndReturnAllButLast", function () {
  it("should remove and return all but the last card from the discard pile", function () {
    // Arrange
    const discardPile = [
      Uno.createCard("red", "5"),
      Uno.createCard("blue", "7"),
      Uno.createCard("green", "Skip"),
    ];

    // Act
    const result = Uno.removeAndReturnAllButLast(discardPile);

    // Assert
    expect(result.length).to.equal(2);
    expect(result).to.deep.equal([
      Uno.createCard("red", "5"),
      Uno.createCard("blue", "7"),
    ]);
    expect(discardPile.length).to.equal(1);
  });
});

describe("Uno.setDeck", function () {
  it("should set the deck of the game", function () {
    // Arrange
    const game = Uno.newGame([], []);

    const deck = [
      Uno.createCard("red", "5"),
      Uno.createCard("blue", "7"),
      Uno.createCard("green", "Skip"),
    ];

    // Act
    Uno.setDeck(deck, game);

    // Assert
    expect(game.deck).to.deep.equal(deck);
  });
});
