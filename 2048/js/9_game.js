(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.text, global.game.anim, global.game.screens, global.doc, global)
})(this, (function(game, widgets, sprites, text, anim, screens, doc, global) {
screens.add("2048", function(screen) {
	text.setDefaultFamily('Special Elite, cursive')
	var svg  = this.add('svg').attr("viewBox","0 0 1920 1080");
	var sw	 = 4;
	var tg	 = 2048;
	var grid = svg.call(widgets.grid(sw,sw));
	var np = svg.call(widgets.newPlay(function(size,target) {
		sw	= size
		tg	= target
		grid.node.remove()
		grid = svg.call(widgets.grid(size,size));
	}));
}).play("2048");
}));
