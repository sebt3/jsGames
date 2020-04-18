(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {

/**
 * Good colors
 * #73cd4b
 * #e86a17
 */

widgets.money		= function(data) {
	var width = 900, height = 80;
	return function() {
		var money = this.call(widgets.box9("space-dialog-5", height/2, width, height))
		if (typeof data.value === "string")
			data.value = parseFloat(data.value)
		var text = money.call(game.text("$ ".concat(data.value))).moveTo(30,height-20).size(height-10)
		money.update = function(tick) {
			text.setText("$ ".concat(game.format.number(data.value)));
		}
		money.addCash	= function(v) { data.value += v; return money }
		money.canBuy	= function(v) { return data.value >= v /*&& v>0*/ }
		money.have	= function() { return data.value }
		money.buy	= function(v) { data.value -= v; return money }
		return money
	};
}

widgets.multi		= function() {
	var width = 350, height = 80;
	var states = [ 1, 10, 100, "next", "max" ]
	var state  = 0
	var wid    = function(n) { return widgets.box9(n, 12, width, height) }
	return function() {
		var bm;
		var change = function() {
			state++;state %= states.length
			var s = states[state]
			switch (typeof s) {
			case "number":
				bm.setText("Buy x"+s);
				break;
			case "string":
				bm.setText("Buy "+s);
				break;
			}
		}
		bm	= this.call(widgets.btn9(width,height,change))
				.setType('flat')
				.setColor('white')
				.setTextPos({x: 90, y: 45}).setText(game.text("Buy x1").color('#000').size(35))
		bm.state  = function() { return states[state] }
		return bm
	};
}

widgets.managers	= function(m) {
	return function() {
		return this.call(widgets.buyList("space-box-tl-blue","space-box-top-blue","space-box-grey",15, "Managers", "items-hourglass", m, 1))
	};
}

widgets.upgrades		= function(m) {
	return function() {
		return this.call(widgets.buyList("space-box-tl-green","space-box-top-green","space-box-grey",15, "Upgrades", "items-arrow", m, 1))
	};
}

widgets.success		= function() {
	var items	= []
	var mar		= 30;
	var topMar	= 50;
	var w		= 1920 - 2 * 200;
	var h		= 1080 - 2 * 200;
	var icon	= "space-cross-black";
	var title	= "Achievements";
	var callback	= function() {
		var root = this;
		var cnt=0;
		items.forEach(function(i) {
			if (i.val>0) {
				var b = root.call(widgets.box9("ui-square-blue", 5, w/4-1.25*mar,h/3-1.50*mar, 1))
					.moveTo(mar+cnt%4*(w-mar)/4,topMar+Math.trunc(cnt/4)*(h-mar)/3)
				b.call(sprites[i.icon]).moveTo(5,5).scaleTo(h/4-1.25*mar-10,h/4-1.25*mar-10)
				b.call(game.text(i.name)).moveTo(10,h/3-1.50*mar - 10)
				b.call(game.text(">"+i.val)).moveTo(h/4-1.25*mar+5, 50)
				b.call(game.text("*"+i.mul).size(50)).moveTo(h/4-1.25*mar+50, 130)
				cnt++;
			}
		})
	}
	return function() {
		var suc = this.call(widgets.dialogButton("space-box-tl-yellow","space-box-top-yellow","space-box-grey",15, title, icon, callback, 1))
		suc.update	= function(tick) {
		}
		suc.add		= function(id, val, mul, icon, name) { items[id] = {val: val, mul:mul, icon:icon, name: name}; return suc }
		suc.set		= function(id, val, mul) { items[id].val = val; items[id].mul = mul; return suc }
		return suc
	};
}


widgets.investors		= function(data) {
	var callback	= function() {
		//this is a constructor callback, aka "root = this"
	}
	return function() {
		//var inv = this.call(widgets.dialogButton("space-box-tl-red","space-box-top-red","space-box-grey",15, "Investors", "items-cooking-glove", callback, 1))
		var inv = this.add("g")
		inv.update	= function(tick) {
		}
		return inv
	};
}
widgets.worlds		= function() {
	return function() {
		var wo = this.add("g")
		//suc.call(widgets.box9("space-box-grey", 11, width, height))
		wo.update = function(tick) {
			// TODO
		}
		return wo
	};
}
}));

