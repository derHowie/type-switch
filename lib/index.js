'use strict';
var Events = require('events');
var EventEmitter = Events.EventEmitter;
var util = require('util');

function TypeSwitch(opts) {
	opts = opts || {};
	EventEmitter.call(this);

	var timer = null;
	var prompt = '';
	var gameClock = 0;
	var incorrect = 0;
	var position = 0;
	var currentGameStats = {
		prompt: '',
		time: 0,
		position: 0,
		correctInput: '',
		lastUserInput: '',
		result: '',
		incorrectTotal: 0
	};

	function setGameStats(answer, correctKey, pressedKeyChar) {
		var gameStats = {
			prompt: prompt,
			time: gameClock,
			position: position,
			correctInput: correctKey,
			lastUserInput: pressedKeyChar,
			result: answer,
			incorrectTotal: incorrect
		};
		return gameStats;
	}

	function compareValues(pressedKey) {
		var pressedKeyChar = String.fromCharCode(pressedKey);
		var correctChar = prompt.charAt(position);
		var correctCharCode = correctChar.charCodeAt(0);
		if (pressedKey === correctCharCode) {
			this.emit('correct');
			currentGameStats = setGameStats('correct', correctChar, pressedKeyChar);
			position++;
		} else {
			this.emit('incorrect');
			incorrect++;
			currentGameStats = setGameStats('incorrect', correctChar, pressedKeyChar);
			position++;
		}
	}

	this.handleKeyPress = function (e) {
		var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
		compareValues(pressedCharCode);
	};

	this.timerSwitch = function (click) {
		if (click === 'on') {
			currentGameStats = setGameStats('game-start', prompt.charAt(position), 'game-start');
			timer = setInterval(function () {
				gameClock++;
			}, 1000);
		} else {
			clearInterval(timer);
			currentGameStats = setGameStats('game-paused', 'game-paused', 'game-paused');
		}
	};

	this.replacePrompt = function (string) {
		prompt = string;
	};

	this.replaceGameStat = function (stat, index) {
		if (index === 'position') {
			position = stat;
		} else {
			gameClock = stat;
		}
	};

	this.returnGameStats = function () {
		currentGameStats = setGameStats(currentGameStats.answer, currentGameStats.correctInput, currentGameStats.lastUserInput);
		return currentGameStats;
	};
}

util.inherits(TypeSwitch, EventEmitter);

TypeSwitch.prototype.start = function (str) {
	this.addListener('keypress', this.handleKeyPress);
	this.replacePrompt(str);
	this.timerSwitch('on');
};

TypeSwitch.prototype.getGameStats = function () {
	return this.returnGameStats();
};

TypeSwitch.prototype.changePosition = function (num) {
	this.replaceGameStat(num, 'position');
};

TypeSwitch.prototype.changeTime = function (newTime) {
	this.replaceGameStat(newTime, 'time');
};

TypeSwitch.prototype.changePrompt = function (newPrompt) {
	this.replacePrompt(newPrompt);
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
