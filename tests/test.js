import test from 'ava';
import Obj from '../lib/index.js';

test('replaced default prompt value at start() / getGameStats() returns object', t => {
	var TypeSwitch = new Obj();
	TypeSwitch.start('Bob is lame.');
	var gameStats = TypeSwitch.getGameStats();
	t.is(gameStats.prompt, 'Bob is lame.');
});

test('replaces game clock', t => {
	var TypeSwitch = new Obj();
	TypeSwitch.start('Guy McGuyField');
	TypeSwitch.changeTime(10);
	var gameStats = TypeSwitch.getGameStats();
	t.is(gameStats.time, 10);
});

test('replaces position', t => {
	var TypeSwitch = new Obj();
	TypeSwitch.start('Guy McGuyField');
	TypeSwitch.changePosition(10);
	var gameStats = TypeSwitch.getGameStats();
	t.is(gameStats.position, 10);
});

test.cb('the timer ticks', t => {
	var TypeSwitch = new Obj();
	var gameStats = null;
	TypeSwitch.start('Guy McGuyField');
	setTimeout(function () {
		gameStats = TypeSwitch.getGameStats();
		t.is(gameStats.time, 9);
		t.end();
	}, 10000);
});

test.cb('pauseGameClock() functions correctly', t => {
	var TypeSwitch = new Obj();
	var gameStats = null;
	TypeSwitch.start('Guy McGuyField');
	setTimeout(function () {
		TypeSwitch.pauseGameClock();
		setTimeout(function () {
			gameStats = TypeSwitch.getGameStats();
			t.is(gameStats.time, 9);
			t.end();
		}, 5000);
	}, 10000);
});

test.cb('resumeGameClock() functions correctly', t => {
	var TypeSwitch = new Obj();
	var gameStats = null;
	TypeSwitch.start('Guy McGuyField');
	setTimeout(function () {
		TypeSwitch.pauseGameClock();
		setTimeout(function () {
			TypeSwitch.resumeGameClock();
			setTimeout(function () {
				gameStats = TypeSwitch.getGameStats();
				t.is(gameStats.time, 15);
				t.end();
			}, 7000);
		}, 5000);
	}, 10000);
});
