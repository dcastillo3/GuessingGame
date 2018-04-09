function generateWinningNumber () {
    let generatedNum = (Math.random() * 100) + 1;
    return Math.floor(generatedNum);
}

function shuffle (arr) {
    let range = arr.length;
    let randomIndex;
    let temp;

    while (range) {
        randomIndex = Math.floor(Math.random() * range--);

        temp = arr[range];
        arr[range] = arr[randomIndex];
        arr[randomIndex] = temp;

    }

    return arr;
}

function Game () {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.difference = function() {
        let diff = this.playersGuess - this.winningNumber
        return Math.abs(diff);
    }
    this.isLower = function () {
        let lower = this.playersGuess < this.winningNumber;
        if (lower) {
            return true;
        }
        return false;
    }
    this.playersGuessSubmission = function (num) {
        if (isNaN(num) || num < 1 || num > 100) {
            $('#subtitle').replaceWith('<h2 id="subtitle">Try a number from 1-100!</h2>');
            throw 'That is an invalid guess.';
        }
        this.playersGuess = num;
        return this.checkGuess();
        }
}

Game.prototype.checkGuess = function () {
    if (this.playersGuess === this.winningNumber) {
        $('#hint, #submit').prop("disabled",true);
        $('#subtitle').replaceWith('<h2 id="subtitle"><span class="highlight">Reset</span> to play again!</h2>');
        return 'You Win!'
    } else {
        if (this.pastGuesses.includes(this.playersGuess)) {
            return 'You have already guessed that number.';
        } else {
            this.pastGuesses.push(this.playersGuess);
            $('.app-guesses li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);

            if(this.pastGuesses.length === 5) {
                $('#hint, #submit').prop("disabled",true);
                $('#subtitle').replaceWith('<h2 id="subtitle"><span class="highlight">Reset</span> to play again!</h2>');
                return `You Lose, the winning number was ${this.winningNumber}.`;
            } else {
                let diff = this.difference();

                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!");
                } else {
                    $('#subtitle').text("Guess Lower!");
                }

                if (this.difference() < 10) {
                    return 'You\'re burning up!';
                } else if (this.difference() < 25) {
                    return 'You\'re lukewarm.';
                } else if (this.difference() < 50) {
                    return 'You\'re a bit chilly.';
                } else if (this.difference() < 100) {
                    return 'You\'re ice cold!';
                }
            }

        }
    }
}

function newGame() {
    return new Game();
}

Game.prototype.provideHint = function () {
    let hintArr = [this.winningNumber];
    for (let i = 2; i > 0; i--) {
        hintArr.push(generateWinningNumber());
    }

    return shuffle(hintArr);
}


/* ------------ jQuery -------------- */
function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
}

$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });
    
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Guessing Game!');
        $('#subtitle').replaceWith('<h2 id="subtitle"><span class="highlight">Guess</span> a number between 1-100.</h2>');
        $('.app-guesses li').text('-');
        $('#hint, #submit').prop("disabled",false);
    })
})