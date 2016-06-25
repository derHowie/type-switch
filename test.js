import test from 'ava';
import Obj from './';

test('replaced default string value at start()', t => {
	var Game = new Obj();
	Game.start('bob is lame');
	Game.changePrompt('fuck');

	t.is(Game.string, 5);
});
