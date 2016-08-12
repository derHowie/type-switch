# type-switch
type-switch is a keypress event module that makes creating typing games a breeze. API documentation coming shortly.

## Installation
```
npm install --save 'type-switch'
```

## Usage
```js
var TypeSwitch = require('type-switch');

var myTypeSwitch = new TypeSwitch();
```

## API

### TypeSwitch({options})

#### options

Type: `object`

Options set here will override the defaults in the constructor.

##### stubbornMode

One of the larger distinctions among typing games is whether or not an incorrect input will advance the user's position in the prompt. Setting stubbornMode to true will force the user to type the correct character before advancing further.

Type: `boolean`
Default: `false`

### typeSwitch.getGameStats()

returns an object containing your instance's current game stats

##### example
```js
observer.getGameStats();

/*{
  prompt: 'Hey Mr. User, type this prompt!',
  time: 23,
  paused: false,
  currentIndex: 5,
  lastExpectedInput: 'M',
  lastUserInput: 'M',
  result: 'correct',
  incorrectTotal: 2
  }*/
```

This should all be pretty self-explanatory, however it's important to note that 'currentIndex' is not the index when the key was pressed, but rather the index of the prompt resulting from the last keystroke. So in the case above, the user was at prompt[4] when they typed the correct answer leading to a currentIndex of 5.

### typeSwitch.start(prompt)

begins game clock and accepts prompt for user to type

#### prompt

Type: `string`

### typeSwitch.changeCurrentIndex(newIndex)

changes the users position in the game prompt

#### newIndex

*Required*
Type: `number`

### typeSwitch.changeTime(newTime)

changes the game time to provided value

#### newTime

*Required*
Type: `number`

### typeSwitch.changePrompt(newPrompt)

used to change the user's prompt mid-game

#### newPrompt

*Required*
Type: `string`

### typeSwitch.pauseGame()

pauses game clock and causes type-switch to refrain from listening to keystrokes

### typeSwitch.resumeGame()

resumes game clock and informs type-switch to continue listening for keystrokes

### typeSwitch.pauseGameClock()

pauses game clock, but type-switch continues to listen for keystrokes

### typeSwitch.resumeGameClock()

resumes game clock, but does not reinstitute type-switch's keypress event listener

### typeSwitch.restartGame()

This method resets the user's current index, game clock, and incorrect total, then begins the game anew with the most recently provided prompt.

### typeSwitch.resetGame()

This method is useful if you want to restart the game, but have some other code you want to run beforehand. All game stats will be reset except the most recent prompt and the game will not immediately begin again.

### typeSwitch.broadcast(event)

type-switch is an EventEmitter. Use this method to create your own custom hooks.

#### event

*Required*
Type: `string`

type-switch has 3 hooks by default: 'correct', 'incorrect', and 'complete'. Calling typeSwitch.getGameStats() within these hooks is a powerful way of monitoring the user's progress and running your own code in synchrony with each keypress.

##### example
```js
var myTypeSwitch = new TypeSwitch();
var points = 0;
var failureMessage = 'Oh man! You stink! You should have typed ';
var successMessage = 'Great job, good sir! *tips hat*';
function partyTime() {...};

myTypeSwitch.on('incorrect', function() {
  var stats = myTypeSwitch.getGameStats();
  if (stats.incorrectTotal > 4) {
    alert(failureMessage + stats.lastExpectedInput + ', but you typed ' + stats.lastUserInput + ', time to start over!');
    points = 0;
    myTypeSwitch.restartGame();
  }
});

myTypeSwitch.on('correct', function() {
  points++;
});

myTypeSwitch.on('complete', function() {
  alert(successMessage);
  partyTime();
});
```

## License

MIT © [Christopher Howard]
