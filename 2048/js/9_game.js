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

	// Draw game title
	var g	 = svg.add("g")
	var sz	 = 180
	var sp	 = sz-10
	g.call(game.text("sebt3's").color("#ff6f00").size(sz-30)).moveTo(100,0)
	g.call(game.text("2").color("#7cb342").size(sz)).moveTo(0,200)
	g.call(game.text("0").color("#aed581").size(sz)).moveTo(sp,200)
	g.call(game.text("4").color("#fff176").size(sz)).moveTo(2*sp,200)
	g.call(game.text("8").color("#fbc02d").size(sz)).moveTo(3*sp,200)
	g.rotate(-35).moveTo(100, 550)
}).play("2048");
}));
