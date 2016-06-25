import test from 'ava';
import Obj from './';

test('replaced default string value at start()', t => {
	var Game = new Obj();
	Game.start('bob is lame');

	t.is(Game.string, 'bob is lame');
});

test('replaced default string value at start()', t => {
	var Game = new Obj();
	Game.start('bob is lame');

	t.is(Game.string, 'bob is lame');
});
