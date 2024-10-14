import Uno from "./api.js";

document.addEventListener("DOMContentLoaded", function () {
  // Find DOM elements
  const elemContainer = document.getElementById("container");
  const elemController = document.getElementById("controller");
  const elemWinner = document.getElementById("winner");
  const elemPlayerInputsContainer = document.getElementById("player-input");
  const elemStartButton = document.getElementById("start-button");
  const elemPlayerName = document.getElementById("player-name");
  const elemNumOfComputerPlayers = document.getElementById("computer-players");
  const elemGameBoard = document.getElementById("the-game");
  const elemGameTableDiv = document.querySelector("#the-game .game-table");
  const elemDeck = document.getElementById("deck");
  const elemCurrentPlayer = document.getElementById("current-player");
  const elemCurrentColor = document.getElementById("current-color");
  const elemContinueButton = document.getElementById("continue-button");

  // Function to enable/disable the "Start" button
  function toggleStartButton() {
    const playerName = elemPlayerName.value.trim();
    elemStartButton.disabled = playerName === "";
  }

  // Function to draw discard pile
  function drawDiscardPile(discardPile) {
    const lastCard = Uno.getCurrentCard(discardPile);
    if (lastCard !== null) {
      const existingDiscardPileDiv =
        elemGameTableDiv.querySelector(".discard-pile");
      if (existingDiscardPileDiv) {
        elemGameTableDiv.removeChild(existingDiscardPileDiv);
      }

      const discardPileDiv = document.createElement("div");
      discardPileDiv.classList.add("discard-pile", lastCard.color);

      const discardPileText = document.createElement("h3");
      discardPileText.classList.add("discard-pile-title");
      discardPileText.textContent = lastCard.value;

      discardPileDiv.appendChild(discardPileText);
      elemGameTableDiv.appendChild(discardPileDiv);
    }
  }

  // Function to draw cards
  function drawPlayersAndCards(game) {
    // Be sure to clean the previous content
    const playerElements = elemGameTableDiv.querySelectorAll(".player");
    playerElements.forEach((playerElement) => {
      elemGameTableDiv.removeChild(playerElement);
    });

    for (let i = 0; i < game.players.length; i++) {
      const player = game.players[i];
      const isHuman = player.human;
      const isCurrentPlayer = game.currentPlayerIndex === i;

      let playableCards = null;

      const playerDiv = document.createElement("div");
      playerDiv.classList.add("player", `player-${i}`);

      if (isCurrentPlayer) {
        playerDiv.classList.add("current");
      }

      if (isHuman) {
        playerDiv.classList.add("player-human");
        if (isCurrentPlayer) {
          const currentColor = Uno.getCurrentColor(game);
          const currentValue = Uno.getCurrentValue(game.discardPile);
          playableCards = Uno.getPlayableCards(
            player,
            currentColor,
            currentValue
          );

          if (playableCards.length === 0) {
            elemDeck.classList.add("clickable");
          } else {
            elemDeck.classList.remove("clickable");
          }
        }
      }

      const playerName = document.createElement("h3");
      playerName.classList.add("player-name");
      playerName.textContent = player.name;

      playerDiv.appendChild(playerName);
      elemGameTableDiv.appendChild(playerDiv);

      drawCards(player, playerDiv, isCurrentPlayer, playableCards, game);
    }
  }

  // Function to draw cards for a given player
  function drawCards(player, playerDiv, isCurrentPlayer, playableCards, game) {
    const isHuman = player.human;

    const cardsDiv = document.createElement("div");
    cardsDiv.classList.add("player-cards");
    playerDiv.appendChild(cardsDiv);

    for (let i = 0; i < player.hand.length; i++) {
      const card = player.hand[i];

      const cardDiv = document.createElement("div");
      cardDiv.classList.add("card", `${isHuman ? card.color : "computer"}`);

      if (isHuman) {
        const cardValue = document.createElement("h3");
        cardValue.textContent = card.value;
        cardDiv.appendChild(cardValue);

        if (isCurrentPlayer) {
          if (playableCards.indexOf(card) !== -1) {
            cardDiv.classList.add("playable");
          }
        }

        // Manage the click
        cardDiv.addEventListener("click", function () {
          playCard(card, player, game);
        });
      }

      cardsDiv.appendChild(cardDiv);
    }
  }

  function drawController(game) {
    const currentPlayer = Uno.getCurrentPlayer(game);
    const currentColor = Uno.getCurrentColor(game);
    elemCurrentPlayer.textContent = currentPlayer.name;
    elemCurrentColor.textContent = currentColor;
  }

  function draw(game) {
    drawPlayersAndCards(game);
    drawDiscardPile(game.discardPile); // TEMPORARY workaround to solve a graphical issue
    drawController(game);
  }

  function playCard(card, player, game) {
    const result = Uno.playCard(card, player, game);
    if (result) {
      console.log(
        `Player ${player.name} use the card ${card.value} with color ${card.color}`
      );

      if (player.hand.length === 0) {
        const winnerText = document.createElement("h1");
        winnerText.textContent = `The winner is ${player.name}`;
        elemWinner.appendChild(winnerText);
        elemWinner.classList.add("show");
        elemGameBoard.classList.remove("show");
        elemController.classList.remove("show");
        return;
      }

      Uno.isActionCard(card)
        ? Uno.applySpecialAction(game)
        : Uno.applyAction(game);

      draw(game);
    }
  }

  // Enable "Start" if the name is set
  toggleStartButton();

  // Add a listener for input event of the player name field
  elemPlayerName.addEventListener("input", toggleStartButton);

  // Add a listener for the click event of the Start button
  elemStartButton.addEventListener("click", function () {
    // Extract values from the inputs
    const playerName = elemPlayerName.value;
    const numOfComputerPlayers = parseInt(elemNumOfComputerPlayers.value);

    if (!playerName.trim()) {
      console.log("The player name is mandatory...");
      return;
    }

    const deck = Uno.createDeck();
    const players = Uno.createPlayers(playerName, numOfComputerPlayers);
    const game = Uno.newGame(players, deck);

    Uno.startGame(game);
    console.log("Game:", game);

    // Event: draw from deck
    elemDeck.addEventListener("click", function () {
      const result = Uno.drawCardFromDeckForTheCurrentPlayer(game);
      if (result) draw(game);
    });

    // Event: continue game
    elemContinueButton.addEventListener("click", function () {
      const currentPlayer = Uno.getCurrentPlayer(game);
      const currentColor = Uno.getCurrentColor(game);
      const currentValue = Uno.getCurrentValue(game.discardPile);
      const playableCards = Uno.getPlayableCards(
        currentPlayer,
        currentColor,
        currentValue
      );
      if (playableCards.length > 0) {
        const randomIndex = Math.floor(Math.random() * playableCards.length);
        const randomCard = playableCards[randomIndex];
        playCard(randomCard, currentPlayer, game);
      } else {
        const result = Uno.drawCardFromDeckForTheCurrentPlayer(game);
        if (result) draw(game);
      }
    });

    // Draw
    draw(game);

    // Apply action in case the first discarded card is an action
    Uno.applySpecialAction(game);

    // Draw players and cards again in case something happened
    setTimeout(function () {
      draw(game);
    }, 500);

    // Hide player input section and show the game board
    elemPlayerInputsContainer.style.display = "none";
    // Edit container before showing the table
    elemContainer.classList.add("with-game");
    // Show game and controller
    elemGameBoard.classList.add("show");
    elemController.classList.add("show");
  });
});
