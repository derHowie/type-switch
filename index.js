'use strict';
var Events = require('events');
var EventEmitter = Events.EventEmitter;
var util = require('util');

function TypeSwitch(opts) {
	opts = opts || {};

	EventEmitter.call(this);

	this.string = '';
	this.timer = null;
	this.gameClock = 0;
	this.incorrect = 0;
	this.position = 0;
	this.currentGameStats = {};

	function createGameStats(answer) {
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
			this.currentGameStats = createGameStats('correct');
			this.position++;
		} else {
			this.emit('incorrect');
			this.incorrect++;
			this.currentGameStats = createGameStats('incorrect');
		}
	}

	this.handleKeyPress = function (e) {
		var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
		compareValues(pressedCharCode);
	};
}

util.inherits(TypeSwitch, EventEmitter);

TypeSwitch.prototype.start = function (str) {
	this.addListener('keypress', this.handleKeyPress);
	this.string = str;

	this.timer = setInterval(() => {
		this.gameClock++;
	}, 1000);
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
	clearInterval(this.timer);
};

TypeSwitch.prototype.resumeGameClock = function () {
	this.timer = setInterval(() => {
		this.gameClock++;
	}, 1000);
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
