(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.text, global.game.anim, global.game.screens, global.doc, global)
})(this, (function(game, widgets, sprites, text, anim, screens, doc, global) {
screens.add("2048", function(screen) {
	text.setDefaultFamily('Special Elite, cursive')
	var svg  = this.add('svg').attr("viewBox","0 0 1920 1080");
	var sw = 4, sh = 4;
	var grid = svg.call(widgets.grid(sw,sh));
	grid.addCell()
}).play("2048");
}));
