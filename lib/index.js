'use strict';
var Events = require('events');
var EventEmitter = Events.EventEmitter;
var util = require('util');
var objectAssign = require('object-assign');

function TypeSwitch(opts) {
	EventEmitter.call(this);
	var defaults = {
		stubbornMode: false
	};
	this.options = objectAssign(defaults, opts || {});

	var timer = null;
	var gameStats = {
		prompt: '',
		time: 0,
		paused: true,
		currentIndex: 0,
		expectedInput: '',
		lastUserInput: '',
		result: '',
		incorrectTotal: 0
	};

	this.setGameStats = function (stats) {
		gameStats = objectAssign(gameStats, stats);
	}

	this.timerSwitch = function (click) {
		if (click === 'on') {
			gameStats.paused = false;
			timer = setInterval(function () {
				gameStats.time++;
			}, 1000);
		} else {
			gameStats.paused = true;
			clearInterval(timer);
		}
	};

	this.getGameStats = function () {
		return gameStats;
	};
}

util.inherits(TypeSwitch, EventEmitter);

TypeSwitch.prototype.start = function (str) {
	window.addEventListener('keypress', this._handleKeyPress.bind(this), 'false');
	this.setGameStats({
		prompt: str
	});
	this.timerSwitch('on');
};

TypeSwitch.prototype.changeCurrentIndex = function (num) {
	this.setGameStats({
		currentIndex: num
	});
};

TypeSwitch.prototype.changeTime = function (newTime) {
	this.setGameStats({
		time: newTime
	});
};

TypeSwitch.prototype.changePrompt = function (newPrompt) {
	this.setGameStats({
		prompt: newPrompt
	});
};

TypeSwitch.prototype.pauseGameClock = function () {
	this.timerSwitch('off');
};

TypeSwitch.prototype.resumeGameClock = function () {
	this.timerSwitch('on');
};

TypeSwitch.prototype.pauseGame = function () {
	this.timerSwitch('off');
	window.removeEventListener('keypress', this._handleKeyPress.bind(this), 'false');
};

TypeSwitch.prototype.resumeGame = function () {
	window.addEventListener('keypress', this._handleKeyPress.bind(this), 'false');
	this.timerSwitch('on');
};

TypeSwitch.prototype.restartGame = function () {
	var gameStats = this.getGameStats();
	this.setGameStats({
		currentIndex: 0,
		time: 0,
		incorrectTotal: 0
	});
	if (gameStats.paused) {
		this.resumeGame();
	}
};

TypeSwitch.prototype.resetGame = function () {
	var gameStats = this.getGameStats();
	this.setGameStats({
		currentIndex: 0,
		time: 0,
		incorrectTotal: 0,
		expectedInput: '',
		lastUserInput: '',
		result: ''
	});
	if (!gameStats.paused) {
		this.pauseGame();
	}
};

TypeSwitch.prototype.broadcast = function (event) {
	this.emit(event);
};

TypeSwitch.prototype._handleKeyPress = function (e) {
	var gameStats = this.getGameStats();
	var newIndex = gameStats.currentIndex + 1;
	var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
	var pressedKeyChar = String.fromCharCode(pressedCharCode);
	var correctChar = gameStats.prompt.charAt(gameStats.currentIndex);
	var correctCharCode = correctChar.charCodeAt(0);

	var event = 'incorrect';
	var newStats = {
		expectedInput: correctChar,
		lastUserInput: pressedKeyChar,
		currentIndex: newIndex,
		result: 'incorrect'
	};

	if (pressedCharCode === correctCharCode) {
		newStats.result = event = 'correct';
	} else {
		newStats.incorrectTotal = gameStats.incorrectTotal + 1;
		newStats.currentIndex = (this.options.stubbornMode) ? gameStats.currentIndex : newIndex;
	}

	this.setGameStats(newStats);
	this.emit(event);

	if (newIndex === gameStats.prompt.length) {
		this.emit('complete');
	};
};

module.exports = TypeSwitch;
