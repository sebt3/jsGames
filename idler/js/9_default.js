(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.text, global.game.anim, global.game.screens, global.doc, global)
})(this, (function(game, widgets, sprites, text, anim, screens, doc, global) {
screens.add("default", function(screen) {
	var srcConf = function(i,j) {
		var k = 5*i+j
		var l = ["screw", "rack-wrench", "spanner", "cutter", "pickaxe", "trowel", "paint-roller", "drill-small", "drill", "pliers"]
		return {icon:		"items-"+l[k],
			name:		l[k],
			length:		(j+1)*100+50,
			unitGain:	10**((k+1/2-i)*2)/5,
			price:		10**((k+1/2+2*i)*2),
			manPrice:	10**((k+1/2+2*i)*2+1),
			next: 		1.01+k/100,
			success: [
				{ when:   10, id: k,  mul: 5 },
				{ when:   20, id: 10, mul: 2 },
				{ when:   50, id: k,  div: 2 },
				{ when:  100, id: k,  div: 2 },
				{ when:  200, id: 10, mul: 2 },
				{ when:  500, id: k,  div: 2 },
				{ when: 1000, id: 10, mul: 2 },
				{ when: 1500, id: k,  mul: 5 },
				{ when: 2000, id: 10, mul: 5 },
				{ when: 2500, id: k,  mul: 5 },
				{ when: 3000, id: k,  mul: 5 },
				{ when: 5000, id: 10, mul: 5 },
				{ when: 8000, id: k,  mul: 10},
				{ when:10000, id: k,  mul: 5 },
			],
			upgrades: [
				{ id: k,  mul: 2, price: (j+1)*10**((k+1/2+2*i)*2+1) },
				{ id: k,  mul: 2, price: (j+1)*10**((k+1/2+2*i)*2+2) },
				{ id: k,  mul: 5, price: (j+1)*10**((k+1/2+2*i)*2+3) },
				{ id: 10, mul: 2, price: (j+1)*10**((k+1/2+2*i)*2+4) },
				{ id: k,  mul: 5, price: (j+1)*10**((k+1/2+2*i)*2+5) },
				{ id: 10, mul: 2, price: (j+1)*10**((k+1/2+2*i)*2+6) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+7) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+8) },
				{ id: 10, mul:10, price: (j+1)*10**((k+1/2+2*i)*2+9) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+10) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+11) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+12) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+13) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+14) },
				{ id: k,  mul:10, price: (j+1)*10**((k+1/2+2*i)*2+15) }
			]
		}
	}

	text.setDefaultFamily('Luckiest Guy, cursive')
	this.call(widgets.gameScreen(srcConf, screen, "landscape-bg-8"));
	return screen
}).play("default");
}));

/*(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.text, global.game.anim, global.game.screens, global.doc, global)
})(this, (function(game, widgets, sprites, text, anim, screens, doc, global) {
screens.add("test", function(screen) {
	var w=1920, h=1080, topClip=32;
	var svg = this.add('svg').attr("viewBox","0 0 1920 1080");
	svg.call(widgets.btn9(300,300,function(){},1))
})
screens.play("test");
}));
/**/

