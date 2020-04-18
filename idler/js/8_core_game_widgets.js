(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {

/* Buttons */
var btnDefaultColor		= 'blue';
var btnDefaultType 		= 'raised';
var btnDefaultCut		= 11;
widgets.btn			= function(cb, spriteSetup) {
	var sup, sdown, sdis;
	var color	= btnDefaultColor;
	var type	= btnDefaultType;
	var setupSprite	= spriteSetup || function(name) {
		return sprites[name];
	}
	var setupSprites= function() {
		sup	= setupSprite("ui-btn-".concat(color,"-",type,"-up"));
		sdown	= setupSprite("ui-btn-".concat(color,"-",type,"-down"));
		sdis	= setupSprite("ui-btn-".concat(color,"-disabled"));
	}
	var cons	= function() {
		setupSprites();
		var ret		= this.call(widgets.clickable(sup,sdown,sdis,cb))
		var setup	= function() {
			setupSprites();
			ret.setUp(sup)
			ret.setDown(sdown)
			ret.setDisabled(sdis)
			return ret;
		}
		ret.setColor	= function(_color) { color=_color;return setup() }
		ret.setType	= function(_type)  { type=_type;  return setup() }
		ret.setShift(3);
		return ret;
	}
	cons.setColor	= function(_color) { color=_color;return cons }
	cons.setType	= function(_type)  { type=_type;return cons }
	return cons;
}
widgets.btn.setDefaultColor	= function(color) {	btnDefaultColor=color	}
widgets.btn.setDefaultType	= function(type) {	btnDefaultType=type	}
widgets.btn.setDefaultCut	= function(cut) {	btnDefaultCut=cut	}
widgets.btn9			= function(w, h, cb, m=0) {
	return widgets.btn(cb, function(name) { return widgets.box9(name, btnDefaultCut, w, h, m) });
}

/* Horizontal progress bar */
var progressDefaultColor= 'blue';
var progressDefaultBgColor= 'grey';
var progressCnt	= 0;
widgets.progress	= function(w,h, bottom="ui-field",top="ui-btn-green-raised-down") {
	var color	= progressDefaultColor;
	var bgColor	= progressDefaultBgColor;
	var id		= progressCnt++;
	var isVertical	= false;
	var pct		= 100;
	doc.find('div#game svg>defs').each(function(e) {
		e.add("clipPath").attr('id',"clip-progress-"+id)
			.add("rect").attr("x",0).attr("y",0).attr("width", w).attr("height", h)
	})
	var cons	= function() {
		var ret		= this.add("g")
		var clip	= doc.find("div#game svg>defs clipPath#clip-progress-"+id+" rect")
		var lower	= ret.call(widgets.box9(bottom, btnDefaultCut, w, h));
		var upper	= ret.call(widgets.box9(top, btnDefaultCut, w, h)).attr("clip-path", "url(#clip-progress-"+id+")");
		ret.setPct	= function(p) {
			pct	= p
			if (isVertical)
				clip.attr("height",pct*h/100).attr("width",w);
			else
				clip.attr("height",h).attr("width",pct*w/100);
			return ret;
		}
		ret.setVertical	= function(p) {
			if(arguments.length==0 || p) {
				isVertical	= true;
				clip.attr("height",pct*h/100).attr("width",w);
			} else {
				isVertical	= false;
				clip.attr("height",h).attr("width",pct*w/100);
			}
		}
		return ret;
	}
	cons.setVertical	= function(p) {
		isVertical	= arguments.length==0 || p;
	}
	return cons;
}
widgets.hProgress	= function() { return widgets.progress(...arguments) }
/* Button that start a dialog */
widgets.dialogButton	= function(up,down, dis, c, title, icon, cb, mar=0) {
	var root	= null;
	var shadow	= null;
	var dialog	= null;
	var closeBtn	= null;
	var w		= 1920;
	var h		= 1080;
	var m		= 200;
	var open	= false;
	var closeCB	= function() {
		closeBtn.remove()
		dialog.remove()
		shadow.remove()
		open = false
	}
	var callback	= function() {
		open = true;
		shadow	= root.add('rect').attr("x", 0).attr("y", 0).attr("width", w).attr("height", h).attr("fill", "rgba(128,128,128,0.8)")
		//dialog	= root.call(widgets.box9(down, 31, w-2*m,h-2*m,mar)).moveTo(m,m);
		dialog	= root.call(widgets.scrollable(widgets.box9(down, 31, w-2*m,h-2*m,mar),w-2*m,h-2*m,32).isVert(true)).moveTo(m,m);
		var t	= dialog.call(game.text(title))
		t.moveTo(w/2-m-t.node.getBBox().width/2,25)
		dialog.call(sprites[icon]).scaleTo(20,20).moveTo(5,5)
		closeBtn = root.call(widgets.clickable(sprites["ui-round-red"],sprites["ui-round-red"],sprites["ui-round-red"],closeCB))
		.moveTo(w-m-20,m-10).setIcon(sprites["ui-cross-white"]);
		cb.call(dialog.inner());
	}
	var cons	= function() {
		var w		= 450, h = 100;
		root		= this;
		var db		= this.call(widgets.clickable(
				widgets.box9(up,c,w,h,mar),widgets.box9(down,c,w,h,mar),widgets.box9(dis,c,w,h,mar),callback
			)).rotate(-45/2).setIcon(sprites[icon]).setText(game.text(title));
		db.isOpen	= function() { return open }
		return db
	}
	return cons
}

/* buyList */
widgets.buyList		= function(up,down, dis, c, title, icon, money, m=0) {
	var items	= [];
	var mar		= 30;
	var topMar	= 50;
	var w		= 1920 - 2 * 200;
	var h		= 1080 - 2 * 200;
	var callback	= function() {
		var ih	= h/4-1.25*mar-40;
		items.sort(function (a, b) { return a.price - b.price });
		for (var i=0;i<items.length;i++) {
			var it = items[i]
			var cb = function() {
				money.buy(this.item.price)
				this.item.cb();
				this.item.btn.remove()
				items.splice(items.indexOf(this.item),1)
				for (var i=0;i<items.length;i++)
					items[i].btn.moveTo(mar+i%4*(w-mar)/4,topMar+Math.trunc(i/4)*(h-mar)/4)
			}
			items[i].btn = this.call(widgets.btn9(w/4-1.25*mar,h/4-1.25*mar, cb, 1))
				.moveTo(mar+i%4*(w-mar)/4,topMar+Math.trunc(i/4)*(h-mar)/4)
 				.setTextPos({x:ih-35,y:40})
				.setText(game.text(items[i].name))
				.setIconPos({x:5,y:40,width:ih,height:ih})
				.setIcon(sprites[items[i].icon])
			items[i].btn.call(game.text("$ "+game.format.number(items[i].price)).size(28)).moveTo(ih+mar/1.5, h/4 -2.4*mar)
			items[i].btn.item = items[i]
			if(!money.canBuy(items[i].price))
				items[i].btn.disable()
		}
		if (items.length<1) {
			var t = this.call(game.text("All done !"))
			t.moveTo((w-t.node.getBBox().width)/2,(h-t.node.getBBox().height)/2)
		}
		//console.log(this.node.getBBox(),)
	}
	var cons	= function() {
		var bl		= this.call(widgets.dialogButton(up,down, dis, c, title, icon, callback, m))
		var box		= null;
		var text	= null;

		bl.addItem	= function(icon,name,effect, price, cb) {
			items.push({
				icon: icon,
				name: name,
				effect: effect,
				price: price,
				cb: cb
			});
		}
		bl.update	= function(tick) {
			var cnt = 0;
			for (var i=0;i<items.length;i++) {
				var c = money.canBuy(items[i].price);
				bl.isOpen() && items[i].btn.disable(!c);
				c && cnt++;
			}
			if (cnt>0 && box == null) {
				//box  = bl.call(widgets.box9("ui-square-red",5, 50,50,1)).moveTo(450,0);
				box  = bl.call(sprites["ui-round-green"]).moveTo(420,-5).scale(1.3,1.3);
				text = box.call(game.text(""+cnt).size(14));
				text.moveTo(20-text.node.getBBox().width/2,20);
			}else if (cnt>0) {
				text.setText(""+cnt);
			} else if (cnt<1 && box != null) {
				box.node.remove();
				box = null;
			}
		}
		return bl
	}
	return cons
}

/* gameScreen */
widgets.gameScreen	= function(confCB, screen, bgs) {
	var srcData = function(i,j) {
		return screen.data["source_"+i+"_"+j] = screen.data["source_"+i+"_"+j] || { count: 0, managed: false, bought: "" }
	}
	var cons	= function() {
		var svg  = this.add('svg').attr("viewBox","0 0 1920 1080");

		// draw the screen
		var bg   = svg.call(sprites[bgs]).scaleTo(1920, 1080);
		var money = svg.call(widgets.money(screen.data.money = screen.data.money || {value: 10})).moveTo(550, 50)
		var multi = svg.call(widgets.multi()).moveTo(1500, 50)
		var wor	= svg.call(widgets.worlds()).moveTo(50,50);
		var man	= svg.call(widgets.managers(money)).moveTo(50,250+177);
		var up	= svg.call(widgets.upgrades(money)).moveTo(50,250+177*2);
		var suc	= svg.call(widgets.success()).moveTo(50,250+177*3);
		var inv	= svg.call(widgets.investors(screen.data.investors = screen.data.investors || {})).moveTo(50,250+177*4);
		var srcs= []
		for (var i=0;i<2;i++)
			for (j=0;j<5;j++)
				srcs.push(svg.call(widgets.source(j+5*i,money,multi, srcData(i,j), confCB(i,j), suc, up, man, inv)).moveTo(550+i*700,200+j*177))
		srcs.forEach(function(s) { s.setAll(srcs) })
		var wo	= svg.call(widgets.worlds()).moveTo(50,50);

		// add fps animation
		anim.add(svg, function(anim, tick) {
			srcs.forEach(function(s) {s.update(tick)})
			money.update(tick)
			suc.update(tick)
			up.update(tick)
			man.update(tick)
			inv.update(tick)
			wo.update(tick)
		})
		return svg
	}
	return cons
}
}));
