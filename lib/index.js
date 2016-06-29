'use strict';
var Events = require('events');
var EventEmitter = Events.EventEmitter;
var util = require('util');
var objectAssign = require('object-assign');

function TypeSwitch(opts) {
	opts = opts || {};
	EventEmitter.call(this);

	var timer = null;
	var gameStats = {
		prompt: '',
		time: 0,
		paused: true,
		position: 0,
		correctInput: '',
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
	window.addEventListener('keypress', this.handleKeyPress.bind(this), 'false');
	this.setGameStats({
		prompt: str
	});
	this.timerSwitch('on');
};

TypeSwitch.prototype.changePosition = function (num) {
	this.setGameStats({
		position: num
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
	window.removeEventListener('keypress', this.handleKeyPress.bind(this), 'false');
};

TypeSwitch.prototype.resumeGame = function () {
	window.addEventListener('keypress', this.handleKeyPress.bind(this), 'false');
	this.timerSwitch('on');
};

TypeSwitch.prototype.broadcast = function (event) {
	this.emit(event);
};

TypeSwitch.prototype.handleKeyPress = function (e) {
	var gameStats = this.getGameStats();
	var pressedCharCode = (typeof e.which === 'number') ? e.which : e.keyCode;
	var pressedKeyChar = String.fromCharCode(pressedCharCode);
	var correctChar = gameStats.prompt.charAt(gameStats.position);
	var correctCharCode = correctChar.charCodeAt(0);
	var newStats = {
		correctInput: correctChar,
		lastUserInput: pressedKeyChar,
	};
	if (pressedCharCode === correctCharCode) {
		this.setGameStats(objectAssign(newStats, {
			result: 'correct'
		}));
		this.emit('correct');
	} else {
		this.setGameStats(objectAssign(newStats, {
			result: 'incorrect',
			incorrectTotal: gameStats.incorrectTotal + 1
		}));
		this.emit('incorrect');
	}
	this.setGameStats({
		position: gameStats.position + 1
	});
};

module.exports = TypeSwitch;
