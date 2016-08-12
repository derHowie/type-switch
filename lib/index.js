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
		lastExpectedInput: '',
		lastUserInput: '',
		result: '',
		incorrectTotal: 0
	};

	this.setGameStats = function (stats) {
		gameStats = objectAssign(gameStats, stats);
	}

	this.timerSwitch = function (click) {
		if (click === 'on') {
			timer = setInterval(function () {
				gameStats.time++;
			}, 1000);
		} else {
			clearInterval(timer);
		}
	};

	this._listener = false;

	this.getGameStats = function () {
		return gameStats;
	};
}

util.inherits(TypeSwitch, EventEmitter);

TypeSwitch.prototype.start = function (str) {
	if (!this._listener) {
		this._listener = true;
		window.addEventListener('keypress', this._handleKeyPress.bind(this), 'false');
	}
	this.setGameStats({
		prompt: str,
		paused: false
	});
	this.timerSwitch('on');
};

TypeSwitch.prototype.changeCurrentIndex = function (newIndex) {
	this.setGameStats({
		currentIndex: newIndex
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
	this.setGameStats({
		paused: true
	});
};

TypeSwitch.prototype.resumeGame = function () {
	this.timerSwitch('on');
	this.setGameStats({
		paused: false
	});
};

TypeSwitch.prototype.restartGame = function () {
	var gameStats = this.getGameStats();
	if (gameStats.paused) {
		this.resumeGame();
	}
	this.setGameStats({
		currentIndex: 0,
		time: 0,
		incorrectTotal: 0
	});
};

TypeSwitch.prototype.resetGame = function () {
	var gameStats = this.getGameStats();
	if (!gameStats.paused) {
		this.pauseGame();
	}
	this.setGameStats({
		currentIndex: 0,
		time: 0,
		incorrectTotal: 0,
		lastExpectedInput: '',
		lastUserInput: '',
		result: ''
	});
};

TypeSwitch.prototype.broadcast = function (event) {
	this.emit(event);
};

TypeSwitch.prototype._handleKeyPress = function (e) {
	var gameStats = this.getGameStats();
	var newIndex = gameStats.currentIndex + 1;
	if (!gameStats.paused) {
		var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
		var pressedKeyChar = String.fromCharCode(pressedCharCode);
		var correctChar = gameStats.prompt.charAt(gameStats.currentIndex);
		var correctCharCode = correctChar.charCodeAt(0);

		var event = 'incorrect';
		var newStats = {
			lastExpectedInput: correctChar,
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

		if (gameStats.currentIndex === gameStats.prompt.length) {
			this.emit('complete');
		};
	}
};

module.exports = TypeSwitch;
