var MatchGameTests = {};

MatchGameTests.runTests = function() {
  var errors = [];
  MatchGameTests.testGenerateCardValues(errors);
  MatchGameTests.testRenderCards(errors);
  MatchGameTests.testFlipCard(errors);
  MatchGameTests.logErrors(errors);
};

MatchGameTests.testGenerateCardValues = function(errors) {
  // Test that generateCardValues function exists.
  var hasGenerateCardValues = MatchGame.generateCardValues && typeof MatchGame.generateCardValues === 'function';
  if (!hasGenerateCardValues) {
    errors.push("generateCardValues: MatchGame object should have a function called generateCardValues.");
    // If generateCardValues function is missing, remaining tests will not work.
    return;
  }

  var values = MatchGame.generateCardValues();
  if (!values || values.constructor !== Array) {
    errors.push("generateCardValues: should return an array.");
    // If generateCardValues does not return an array, remaining tests will not work.
    return;
  }

  if (values.length !== 16) {
    errors.push("generateCardValues: should return an array containing 16 values.");
  }

  // Get number of each value.
  var valueCounts = {};
  values.forEach(function(value) {
    var valueCount = valueCounts[value];
    valueCounts[value] = valueCount ? valueCount + 1 : 1;
  });

  for (var i = 1; i <= 8; i++) {
    if (valueCounts[i] !== 2) {
      errors.push("generateCardValues: should return an array containing two copies of each card, values 1 through 8.");
    }
  }
};

MatchGameTests.testRenderCards = function(errors) {
  var hasRenderCards = MatchGame.renderCards && typeof MatchGame.renderCards === 'function';
  if (!hasRenderCards) {
    errors.push("renderCards: MatchGame object should have a function called renderCards.");
    // If renderCards function is missing, remaining tests will not work.
    return;
  }

  var $game = $('<div><h1>Old Game</h1></div>');
  var cardValues = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];

  MatchGame.renderCards(cardValues, $game);

  if ($game.find('h1').length) {
    errors.push("renderCards: Game should clear old HTML.");
  }

  var $cards = $game.find('.card');
  if ($cards.length !== 16) {
    errors.push("renderCards: Game should have sixteen .card objects.");
  }

  $cards.each(function(cardIndex, card) {
    var $card = $(card);
    if (!$card.data('value')) {
      errors.push("renderCards: All cards should have a data attribute called 'value'.");
    }
    if ($card.data('value') !== cardValues[cardIndex]) {
      errors.push("renderCards: Card data 'value' should equal corresponding value in cardValues.");
    }

    if (!$card.data('color')) {
      errors.push("renderCards: All cards should have a data attribute called 'color'.");
    }
  });
};

MatchGameTests.testFlipCard = function(errors) {
  var $game = $('<div>');
  var cardValues = [1, 1, 2];
  MatchGame.renderCards(cardValues, $game);
  var $cards = $game.find('.card');
  var $card0 = $($cards.get(0));
  var $card1 = $($cards.get(1));
  var $card2 = $($cards.get(2));
  var faceDownColor = $card0.css('background-color');

  if (!$cards.length) {
    errors.push("flipCard: Game should have '.card' objects to flip.");
    return;
  }

  MatchGame.flipCard($card0, $game);
  if ($card0.text() !== '1') {
    errors.push("flipCard: Flipping a card should set its data 'value' as its visible HTML text.");
  }
  if ($card0.css('background-color') === faceDownColor) {
    errors.push("flipCard: Flipping a card should change its background color.");
  }
  MatchGame.flipCard($card0, $game);
  if ($card0.text() !== '1' || $card0.css('background-color') === faceDownColor) {
    errors.push("flipCard: Flipping a flipped card should keep it flipped up.");
  }

  MatchGame.renderCards(cardValues, $game);
  $cards = $game.find('.card');
  $card0 = $($cards.get(0));
  $card1 = $($cards.get(1));
  $card2 = $($cards.get(2));

  var mockSetTimeout = MatchGameTests.mock(window, 'setTimeout');
  MatchGame.flipCard($card0, $game);
  MatchGame.flipCard($card2, $game);
  if (!mockSetTimeout.getCalls().length) {
    errors.push("flipCard: Flipping two different cards should call .setTimeout() before flipping back down.");
  } else {
    if (!mockSetTimeout.getCalls()[0][0] || typeof mockSetTimeout.getCalls()[0][0] !== 'function') {
      errors.push("flipCard: .setTimeout() should be called with a function as its first argument.");
    } else {
      mockSetTimeout.getCalls()[0][0]();
      if ($card0.text() || $card2.text()) {
        errors.push("flipCard: Flipping two different cards should clear their text after .setTimeout().");
      }
      if ($card0.css('background-color') !==  'rgb(32, 64, 86)' || $card2.css('background-color') !== 'rgb(32, 64, 86)') {
        errors.push("flipCard: Flipping two different cards should set their background color back to rgb(32, 64, 86) after .setTimeout().");
      }
    }
    if (!mockSetTimeout.getCalls()[0][1] || typeof mockSetTimeout.getCalls()[0][1] !== 'number') {
      errors.push("flipCard: .setTimeout() should be called with a number as its second argument.");
    }
  }
  mockSetTimeout.restore();

  MatchGame.renderCards(cardValues, $game);
  $cards = $game.find('.card');
  $card0 = $($cards.get(0));
  $card1 = $($cards.get(1));
  $card2 = $($cards.get(2));
  MatchGame.flipCard($card0, $game);
  MatchGame.flipCard($card1, $game);

  if (!$card0.text() || !$card1.text()) {
    errors.push("flipCard: Flipping two matching cards should keep their values.");
  }
  if ($card0.css('background-color') !==  'rgb(153, 153, 153)' || $card1.css('background-color') !== 'rgb(153, 153, 153)') {
    errors.push("flipCard: Flipping two matching cards should set their background color to rgb(153, 153, 153).");
  }
  if ($card0.css('color') ===  'rgb(32, 64, 86)' || $card1.css('color') === 'rgb(32, 64, 86)') {
    errors.push("flipCard: Flipping two matching cards should set their color to rgb(32, 64, 86).");
  }
};

MatchGameTests.mock = function(object, functionName) {
  var oldFn = object[functionName];
  var calls = [];
  object[functionName] = function() {
    calls.push(Array.prototype.slice.apply(arguments));
  };
  return {
    restore: function() {
      object[functionName] = oldFn;
    },
    getCalls: function() {
      return calls;
    }
  };
};

MatchGameTests.logErrors = function(errors) {
  if (errors.length === 0) {
    console.log('%cAll tests passed!', 'color: #30AD35');
  } else {
    errors = new Set(errors);
    var errorMessage = ' errors found:';
    if (errors.size === 1) {
      errorMessage = ' error found:';
    }
    console.log('%c' + errors.size + ' ' + errorMessage, 'color: #BA1222');
    errors.forEach(function(error) {
      console.log('%c  ' + error, 'color: #BA1222');
    });
  }
};



/* var MatchGame = {};



/*
  Sets up a new game after HTML document has loaded.
  Renders a 4x4 board of cards.
*/

$(document).ready(function() {
  var $game = $('#game');
  var values = MatchGame.generateCardValues();
  MatchGame.renderCards(values, $game);
});

/*
  Generates and returns an array of matching card values.
 */

MatchGame.generateCardValues = function () {
  var orderedValues = [];
  
  for (var value = 1; value <= 8; value++) {
    orderedValues.push(value);
  };
  
  var cardValues = [];
  
  while(orderedValues.length > 0) {
    var randomIndex = Math.floor(Math.random() * orderedValues.length);
    var randomValue = orderedValues.splice(randomIndex, 1)[0];
    cardValues.push(randomValue);
  };

  return cardValues;
};


/*
  Converts card values to jQuery card objects and adds them to the supplied game
  object.
*/

MatchGame.renderCards = function(cardValues, $game) {

  $game.empty();

  var colors = [
     'hsl(25, 85%, 65%)',
     'hsl(55, 85%, 65%)',
     'hsl(90, 85%, 65%)',
     'hsl(160, 85%, 65%)',
     'hsl(220, 85%, 65%)',
     'hsl(265, 85%, 65%)',
     'hsl(310, 85%, 65%)',
     'hsl(360, 85%, 65%)'
  ];

  for (valueIndex = 0; valueIndex < cardValues.length; valueIndex++) {
    var value = cardValue[valueIndex];
    var color = colors[value - 1];
    var data = {
      value: value,
      color: color,
      isFlipped: false
    };

    var $cardElement = $('<div class="col-xs-3 card"></div>');
    $cardElement.data(data);

    $game.append($cardElement);
  };

  $('.card').click(function () {
    MatchGame.flipCard($(this), $('#game'));
  })
};

/*
  Flips over a given card and checks to see if two cards are flipped over.
  Updates styles on flipped cards depending whether they are a match or not.
 */

MatchGame.flipCard = function($card, $game) {
  if ($card.data('isFlipped')) {
    return;
  };

  $card.css('background-color', $card.data('color'))
  .text($card.data('value'))
  .data('isFlipped', true);

  var flippedCards = $game.data('flippedCards');
  flippedCards.push($card);

  if (flippedCards.length === 2) {
    if (flippedCards[0].data('value') === flippedCards[1].data('value')) {
      var matchCss = {
        backgroundColor: 'rgb(153, 153, 153)',
        color: 'rgb(204, 204, 204)'
      };
      flippedCards[0].css(matchCss);
      flippedCards[1].css(matchCss);
    } else {
      var card1 = flippedCards[0];
      var card2 = flippedCards[1];
    }

    $game.data('flippedCards', []);
  } 
}; */