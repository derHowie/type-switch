import test from 'ava';
import Obj from './';

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

test('the timer ticks', t => {
	var TypeSwitch = new Obj();
	var gameStats = null;
	setTimeout(function () {
		gameStats = TypeSwitch.getGameStats();
		t.is(gameStats.time, 10);
	}, 10000);
});

test('pauseGameClock() functions correctly', t => {
	var TypeSwitch = new Obj();
	var gameStats = null;
	setTimeout(function () {
		TypeSwitch.pauseGameClock();
		setTimeout(function () {
			gameStats = TypeSwitch.getGameStats();
			t.is(gameStats.time, 10);
		}, 5000);
	}, 10000);
});

test('resumeGameClock() functions correctly', t => {
	var TypeSwitch = new Obj();
	var gameStats = null;
	setTimeout(function () {
		TypeSwitch.pauseGameClock();
		setTimeout(function () {
			TypeSwitch.resumeGameClock();
			setTimeout(function () {
				gameStats = TypeSwitch.getGameStats();
				t.is(gameStats.time, 17);
			}, 7000);
		}, 5000);
	}, 10000);
});
