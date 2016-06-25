'use strict';
var Events = require('events');
var EventEmitter = Events.EventEmitter;
var util = require('util');

function TypeSwitch(opts) {
	opts = opts || {};
	EventEmitter.call(this);
	var timer = null;

	this.string = '';
	this.gameClock = 0;
	this.incorrect = 0;
	this.position = 0;
	this.currentGameStats = {
		time: 0,
		incorrectTotal: this.incorrect,
		position: this.position,
		answer: ''
	};

	function setGameStats(answer) {
		var gameStats = {
			time: this.gameClock,
			incorrectTotal: this.incorrect,
			position: this.position,
			answer: answer
		};
		return gameStats;
	}

	function compareValues(pressedKey) {
		var correctCharCode = this.string.charCodeAt(this.position);
		if (pressedKey === correctCharCode) {
			this.emit('correct');
			this.currentGameStats = setGameStats('correct');
			this.position++;
		} else {
			this.emit('incorrect');
			this.incorrect++;
			this.currentGameStats = setGameStats('incorrect');
		}
	}

	this.handleKeyPress = function (e) {
		var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
		compareValues(pressedCharCode);
	};

	this.timerSwitch = function (click) {
		if (click === 'on') {
			timer = setInterval(function () {
				this.gameClock++;
				this.currentGameStats = setGameStats(this.currentGameStats.answer);
			}, 1000);
		} else {
			clearInterval(timer);
			this.currentGameStats = setGameStats('');
		}
	};
}

util.inherits(TypeSwitch, EventEmitter);

TypeSwitch.prototype.start = function (str) {
	this.addListener('keypress', this.handleKeyPress);
	this.string = str;

	this.timerSwitch('on');
};

TypeSwitch.prototype.getGameStats = function () {
	return this.currentGameStats;
};

TypeSwitch.prototype.changePosition = function (num) {
	this.position += num;
};

TypeSwitch.prototype.changeTime = function (newTime) {
	this.gameClock = newTime;
};

TypeSwitch.prototype.changePrompt = function (newString) {
	this.string = newString;
};

TypeSwitch.prototype.pauseGameClock = function () {
	this.timerSwitch('off');
};

TypeSwitch.prototype.resumeGameClock = function () {
	this.timerSwitch('on');
};

TypeSwitch.prototype.pauseGame = function () {
	this.pauseGameClock();
	this.removeListener('keypress', this.handleKeyPress);
};

TypeSwitch.prototype.resumeGame = function () {
	this.addListener('keypress', this.handleKeyPress);
	this.resumeGameClock();
};

module.exports = TypeSwitch;
