
/**
 * Class to provide calculations of cards values and showing result to user.
 * @returns {CardsCounter}
 */
var CardsCounter = function(){};
CardsCounter.prototype = {
    /**
     * Returns value of card above 10
     * @param {String} faceCard
     * @throws When can't match card
     * @returns {Number}
     */
    getFaceCardValue : function(faceCard)
    {
        switch (faceCard) {
            case 'A':
                return 11;
            case 'K':
            case 'Q':
            case 'J':
                return 10;
            default:
                throw 'Can\'t match face card!';
        }
    },
    
    /**
     * Parses input value (eg. 5H) to blackjack value representation.
     * @param {String} rawValue
     * @throws When can't match proper card representation
     * @returns {Number}
     */
    parseCardValue : function(rawValue)
    {
        var cardPattern = new RegExp('^([2-9]?|10|[AKQJ]{1})([SCDH]{1})$', '');
        var rawCard = cardPattern.exec(rawValue);
        
        if (rawCard !== null) {
            var value = 0;
            if (isNaN(rawCard[1])) {
                value = CardsCounter.prototype.getFaceCardValue(rawCard[1]);
            } else {
                value = parseInt(rawCard[1]);
            }
            
            return value;
        } else {
            throw 'Card mismatch!';
        }
    },
    
    /**
     * Gets value of card from input searching by name attribute.
     * @param {string} inputName Name of DOM element where to get card value from.
     * @throws When could not find the DOM element with provided name.
     * @returns {integer}
     */
    getCardValueFromInput : function(inputName)
    {
        var inputValue = $('[name="' + inputName + '"]');
        if (inputValue.length > 0) {
            return CardsCounter.prototype.parseCardValue(inputValue.val());
        } else {
            throw 'I couldn\'t find the card!';
        }
    },
    
    /**
     * Returns color based on value close to 21 (blackjack)
     * @param {Number} value
     * @returns {String}
     */
    getColorForValue : function(value)
    {
        value = parseInt(value);
        switch (true) {
            case (value > 21):
                return 'danger';
            case (value == 21):
                return 'success';
            case (value >= 19):
                return 'warning';
            case (value >= 14):
                return 'info';
            case (value > 0):
                return 'primary';
            default:
                return 'default';
        }
    },
    
    /**
     * Updates score by calculationg provided card value
     * @returns void
     */
    updateValue : function()
    {
        var cardsValueSum = 0;
        $('[name^="card"]').each(function(i, element) {
            try {
                cardsValueSum += CardsCounter.prototype.getCardValueFromInput($(element).attr('name'));
            } catch (error) {
                cardsValueSum += 0;
            }
            
            if (i >= 1) {
                return false;
            }
        });
        
        var color = CardsCounter.prototype.getColorForValue(cardsValueSum);
        
        $('#cards-sum')
            .attr('class', 'label')
            .addClass('label-' + color)
            .html('<strong>' + String(cardsValueSum) + '</strong>');
    }
};

// bind calculations to DOM inputs events - get triggerd when card is entered
$(document).ready(function() {
    var Counter = new CardsCounter();
    var resultValue = 0;
    $('[name^="card"]').each(function(i, element) {
        $(element).on('change keyup keypress', function() {
            resultValue += Counter.updateValue();
        });
    });
});
