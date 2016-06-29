'use strict';
var Events = require('events');
var EventEmitter = Events.EventEmitter;
var util = require('util');

function TypeSwitch(opts) {
	opts = opts || {};
	EventEmitter.call(this);

	var timer = null;
	var currentGameStats = {
		prompt: '',
		time: 0,
		position: 0,
		correctInput: '',
		lastUserInput: '',
		result: '',
		incorrectTotal: 0
	};

	function setGameStats(statArray) {
		statArray.map(function (item) {
			currentGameStats[item[0]] = item[1];
		});
	}

	this.timerSwitch = function (click) {
		if (click === 'on') {
			setGameStats([
				['result', 'game-start'],
				['correctInput', currentGameStats.prompt.charAt(currentGameStats.position)],
				['lastUserInput', '']
			]);
			timer = setInterval(function () {
				currentGameStats.time++;
			}, 1000);
		} else {
			clearInterval(timer);
			setGameStats([
				['correctInput', 'game-paused'],
				['lastUserInput', 'game-paused'],
				['result', 'game-paused']
			]);
		}
	};

	this.replaceGameStat = function (statArray) {
		setGameStats(statArray);
	};

	this.returnGameStats = function () {
		return currentGameStats;
	};
}

util.inherits(TypeSwitch, EventEmitter);

TypeSwitch.prototype.start = function (str) {
	window.addEventListener('keypress', this.handleKeyPress.bind(this), 'false');
	this.replaceGameStat([['prompt', str]]);
	this.timerSwitch('on');
};

TypeSwitch.prototype.getGameStats = function () {
	return this.returnGameStats();
};

TypeSwitch.prototype.changePosition = function (num) {
	this.replaceGameStat([['position', num]]);
};

TypeSwitch.prototype.changeTime = function (newTime) {
	this.replaceGameStat([['time', newTime]]);
};

TypeSwitch.prototype.changePrompt = function (newPrompt) {
	this.replaceGameStat([['prompt', newPrompt]]);
};

TypeSwitch.prototype.pauseGameClock = function () {
	this.timerSwitch('off');
};

TypeSwitch.prototype.resumeGameClock = function () {
	this.timerSwitch('on');
};

TypeSwitch.prototype.pauseGame = function () {
	this.timerSwitch('off');
	window.removeEventListener('keypress', this.handleKeyPress.bind(this), 'false');
};

TypeSwitch.prototype.resumeGame = function () {
	window.addEventListener('keypress', this.handleKeyPress.bind(this), 'false');
	this.timerSwitch('on');
};

TypeSwitch.prototype.handleKeyPress = function (e) {
	var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
	var gameStats = this.returnGameStats();
	var pressedKeyChar = String.fromCharCode(pressedCharCode);
	var correctChar = gameStats.prompt.charAt(gameStats.position);
	var correctCharCode = correctChar.charCodeAt(0);
	if (pressedCharCode === correctCharCode) {
		this.replaceGameStat([
			['correctInput', correctChar],
			['lastUserInput', pressedKeyChar],
			['result', 'correct']
		]);
		this.emit('correct');
		this.replaceGameStat([['position', gameStats.position + 1]]);
	} else {
		this.replaceGameStat([
			['correctInput', correctChar],
			['lastUserInput', pressedKeyChar],
			['result', 'incorrect'],
			['incorrectTotal', gameStats.incorrectTotal + 1]
		]);
		this.emit('incorrect');
		this.replaceGameStat([['position', gameStats.position + 1]]);
	}
};

module.exports = TypeSwitch;
