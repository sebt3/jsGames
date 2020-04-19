(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.text, global.game.anim, global.game.screens, global.doc, global)
})(this, (function(game, widgets, sprites, text, anim, screens, doc, global) {
screens.add("2048", function(screen) {
	text.setDefaultFamily('Special Elite, cursive')
	var score, grid, np;
	var svg  = this.add('svg').attr("viewBox","0 0 1920 1080");
	var sw	 = 4;
	var tg	 = 2048;
	var reset= function(size,target) {
		sw	= size
		tg	= target
		score.reset(size,target);
		grid.clean().node.remove()
		grid = svg.call(widgets.grid(score,size,size));
	}
	score	 = svg.call(widgets.score(screen.data, reset));
	grid	 = svg.call(widgets.grid(score, sw,sw));
	np	 = svg.call(widgets.newPlay(reset));
	score.win();
}).play("2048");
}));
