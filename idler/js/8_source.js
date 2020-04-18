(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {
var width = 600, height = 120, curTick = 0;
widgets.source		= function(myId, money,multi, data, conf, suc, up, man, inv) {
	var mult	= null;
	var all		= null;
	var curMult	= 1;
	var price	= conf.price;
	var unitGain	= conf.unitGain;
	var length	= conf.length;
	var getPrice	= function(n) {
		if (n<=1)
			return price
		if (conf.next==1)
			return price*(n+1)
		return price*(1-conf.next**(n))/(1-conf.next)
	}
	var getMult	= function() {
		switch (typeof mult) {
		case "number":	return mult;
		case "string":
			if (mult == "next" && conf.success.length>0) {
				if (conf.success[0].when <= data.count && conf.success.length>1)
					return conf.success[1].when - data.count
				return conf.success[0].when - data.count
			}
			// mult == "max"
			var m=100;
			if (money.canBuy(getPrice(curMult))) {
				if (!money.canBuy(getPrice(curMult+1))) return curMult
				if (!money.canBuy(getPrice(curMult+2))) return curMult+1
				if (curMult>m) m=curMult
			}
			while (money.canBuy(getPrice(m)))
				m+=100;
			m-=90
			while (money.canBuy(getPrice(m)))
				m+=10;
			m-=9
			while (money.canBuy(getPrice(m)))
				m++;
			m--;
			return m;
		}
	}
	var getIcon	= function(id) {
		if (id>=0&&id<10)
			return all[id].conf().icon
		return "items-sample" // TODO: support an icon for investors
	}
	var getName	= function(id) {
		if (id>=0&&id<10)
			return all[id].conf().name
		else if(id=10)
			return "All"
		else	return "Investors"
	}

	// Handle the data loading
	if (typeof(data.count)=== "string")
		data.count = parseFloat(data.count)
	if (typeof(data.managed) === "string")
		data.managed = data.managed=='true'
	price *= conf.next**data.count
	var curPrice	= getPrice(curMult);
	if(!data.managed)
		man.addItem(conf.icon, conf.name, null, conf.manPrice, function() {data.managed = true})
	if (conf.success.length>0)
		suc.add(myId, conf.success[0].when, (conf.success[0].mul||1) * (conf.success[0].div||1), conf.icon, conf.name);
	data.bought = data.bought || ""
	var boughtUpgrades = data.bought.split(',');
	var addBought = function(i) {
		boughtUpgrades.push(i)
		data.bought = boughtUpgrades.join(",")
	}


	// the final constructor
	var cons	= function() {
		var src, buyBtn, startBtn, line2, start_click, startTick = null, setCurPrice, buy_click, cntLbl, pct, timer, pctText;
		// Callbacks
		buy_click = function() {
			data.count+=curMult
			money.buy(curPrice)
			price *= conf.next**curMult
			setCurPrice(getMult());
			cntLbl.setText(""+data.count);
			startBtn.disable(false);
			pctText.update()
			pctText.moveTo(220-pctText.node.getBBox().width*2/3, 35)
		}
		start_click = function() {
			if (startTick != null)
				return;
			startTick = curTick;
		}
		setCurPrice	= function(m) {
			curMult = m
			if (curMult == 0) curMult = 1
				curPrice = getPrice(curMult);
			buyBtn.setText(game.format.number(curPrice)+" $")
			line2.html("x".concat(curMult))
		}
		// Draw the widget
		src		= this.add("g")
		pct		= src.call(widgets.hProgress(440,50)).moveTo(140,10).setPct(0)//.scale(2,1.8);
		pctText		= pct.call(game.text("$ "+game.format.number(data.count*unitGain)).color('#AAA'))
		pctText.moveTo(220-pctText.node.getBBox().width*2/3, 35)
		pctText.update	= function() { pctText.setText("$ "+game.format.number(data.count*unitGain)) }

		timer		= src.call(sprites["ui-field-flat"]).moveTo(580 - sprites["ui-field-flat"].box.width, 65)
			.call(game.text("00:00")).color('#333').moveTo(40,35)
		startBtn	= src.call(widgets.clickable(sprites["ui-round-yellow"],sprites["ui-round-white"],sprites["ui-round-white"],start_click))
			.moveTo(30,12).scale(2.7,2.7)
			.setIconPos({x:5,y:3,width:25,height:20}).setIcon(sprites[conf.icon])
		startBtn.call(sprites["ui-arrow-red-right"]).scaleTo(45,16).moveTo(-5,23)
		cntLbl		= startBtn.call(game.text(""+data.count).size(10)).moveTo(-1,33);
		if (data.count < 1)
			startBtn.disable();
		buyBtn		= src.call(widgets.btn9(240,50,buy_click,1))
			.setColor('red').moveTo(140,65)
			.setTextPos({x:10,y:20}).setText(game.text(game.format.number(curPrice)).size(20));
		line2		= buyBtn.text().spacing(0.7).getNewLine("Buy x1").attr("font-size",14)


		// Methods
		src.gainMult	= function(k) { if (k!=null && k>1) unitGain *= k; pctText.update();return src }
		src.divSpeed	= function(k) { if (k!=null && k>1) length   /= k; pctText.update();return src }
		src.applyUpdate	= function(s) {
			if (s.id == 10) {	// All
				all.forEach(function(i) { i.gainMult(s["mul"]).divSpeed(s["div"]) })
			} else if (s.id > 10) {	// Investor
				//TODO
			} else {		// Self
				all[s.id].gainMult(s["mul"]).divSpeed(s["div"])
			}
		}
		src.applySuccess= function() {
			while(conf.success.length>0 && conf.success[0].when <= data.count) {
				var s = conf.success[0]
				conf.success.shift()
				src.applyUpdate(s)
				if (conf.success.length>0)
					suc.set(myId, conf.success[0].when, (conf.success[0].mul||1) * (conf.success[0].div||1))
				else
					suc.set(myId, -1, -1);
			}
			return src
		}
		src.conf	= function() { return conf }
		src.setupUpgradesDone = false;
		src.setupUpgrades= function() {
			if(src.setupUpgradesDone)return src;
			src.setupUpgradesDone = true;
			conf.upgrades.forEach(function(i,cnt) {
				if (boughtUpgrades.indexOf(""+cnt)<0)
					up.addItem(
						getIcon(i.id),
						getName(i.id),
						"* "+((i.mul||1) * (i.div||1)),
						i.price,
						function() {
							src.applyUpdate(i);
							addBought(cnt);
						}
					);
				else
					src.applyUpdate(i)
			})

		}
		src.setAll	= function(_all) { all=_all; src.applySuccess(); src.setupUpgrades();return src }
		// the update loop
		src.update	= function(tick) {
			curTick = tick;
			if (data.managed && data.count>0 && startTick == null) startTick = curTick; // TODO: improve this to include all the missing cash since previous page load
			if (mult == null || mult != multi.state() || mult == 'max') {
				mult = multi.state();
				var m = getMult();
				if(curMult!=m) setCurPrice(m)
			}
			src.applySuccess()
			buyBtn.disable(!money.canBuy(curPrice))
			if (startTick != null) {
				pct.setPct(100*(tick-startTick)/length);
				if (tick-startTick>=length) {
					var cnt = Math.trunc((tick-startTick)/length)
					var rst = (tick-startTick)%length
					if (data.managed) {
						startTick = tick-rst;
					} else {
						pct.setPct(0);
						startTick = null;
						cnt=1
					}
					money.addCash(cnt*data.count*unitGain)
				}
				// Update timer
				var sec = Math.trunc((length-(tick-startTick))*game.anim.getTickLen()/1000)
				if(sec<0)	sec=0
				var min = Math.trunc(sec/60);sec %= 60
				if (min<10)	min="0"+min
				else		min=""+min
				if (sec<10)	sec="0"+sec
				else		sec=""+sec
				timer.setText(min.concat(":",sec));
			}
		}
		return src
	};
	return cons
}
}));

