(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {

/* clickable */
var clickableDefaultShift = 0;
var clickableDefaultPadding = 12;
widgets.clickable		= function(_up, _down, _dis, cb) {
	var up = _up, down = _down, dis = _dis, shift = clickableDefaultShift;
	return function() {
		var ret			= this.add("g")
		var g			= ret.add("g")
		var s			= g.call(up)
		var icon		= null;
		var text		= null;
		var isUp		= true;
		var disabled		= false;
		var iconPos		= null;
		var textPos		= null;
		ret.setTextPos		= function(p) {	textPos = p; return ret }
		var posText = function() {
			if (textPos == null) {
				var tb= text.node.getBBox()
				var h = tb.height
				var w = tb.width
				var y = h/2 + clickableDefaultPadding
				var x = 1.5*clickableDefaultPadding
				if (h+2*clickableDefaultPadding<s.node.getBBox().height)
					y += (s.node.getBBox().height-h-2*clickableDefaultPadding)
				if (icon !=null)
					x += icon.node.getBBox().width + clickableDefaultPadding
				if (x+w+clickableDefaultPadding*1.5<s.node.getBBox().width)
					x = (s.node.getBBox().width)/2-w
				text.moveTo(x, y)
			} else
				text.moveTo(textPos.x, textPos.y)
		}
		ret.setIconPos		= function(p) {	iconPos = p; return ret }
		ret.setIcon		= function(i) {
			if(icon !=null)
				icon.remove();
			icon = g.call(i)
			if (iconPos == null) {
				var b_h = s.node.getBBox().height;
				var i_h = icon.node.getBBox().height;
				var sca = (b_h-2*clickableDefaultPadding-2)/(i_h);
				icon.scale(sca, sca).moveTo(clickableDefaultPadding,clickableDefaultPadding);
			} else
				icon.scaleTo(iconPos.width, iconPos.height).moveTo(iconPos.x,iconPos.y)
			if (text != null)
				posText();
			return ret;
		}
		ret.setText		= function(t) {
			if(text !=null)
				text.setText(t);
			else {
				text = g.call(t)
				posText();
			}
			return ret
		}
		ret.text		= function() { return text }
		ret.disable		= function(b) {
			disabled	= true
			if(arguments.length>0 && !b)
				disabled= false
			if (disabled)	s.swap(dis)
			else		s.swap(up)
			return ret
		}
		ret.setShift		= function(_shift) {shift = _shift;return ret}
		ret.setUp		= function(_up) {up = _up;if(isUp)s.swap(up);return ret}
		ret.setDown		= function(_down) {down = _down;if(!isUp)s.swap(down);return ret}
		ret.setDisabled		= function(_dis) {dis = _dis;if(disabled)s.swap(dis);return ret}
		ret.node.onmousedown	= function() { if(!disabled) { s.swap(down); isUp=false;g.moveTo(0,shift) }}
		ret.node.onmouseout	= function() { if(!disabled) { s.swap(up);   isUp=true; g.moveTo(0,0) }}
		ret.node.onmouseup	= function() { if(!disabled) { s.swap(up);   isUp=true; g.moveTo(0,0);cb.call(ret) }}
		return ret;
	}
}

/* Horizontal bar in 3 pieces : left, middle, right */
var hboxCnt		= 0;
widgets.hbox3		= function(l,m,r,w) {
	return function() {
		var ret		= this.add("g")
		var id		= hboxCnt++;
		var sl		= ret.call(sprites[l])
		var sm		= ret.call(sprites[m])
		var sr		= ret.call(sprites[r])
		var pct		= 100;
		var width;
		doc.find('div#game svg>defs').each(function(e) {
			e.add("clipPath").attr('id',"hbox-"+id)
				.add("rect").attr("x",0).attr("y",0).attr("width", w)
					.attr("height", sm.sprite.box.height)
		});
		var clip	= doc.find("div#game svg>defs clipPath#hbox-"+id+" rect")
		ret.attr("clip-path", "url(#hbox-"+id+")");

		ret.setPct	= function(p) {
			pct	= p
			clip.attr("width",pct*width/100);
		}
		ret.setWidth	= function(w) {
			width	= w
			ret.setPct(pct);
			sr.moveTo(width-sr.sprite.box.width,0)
			sm.moveTo(sl.sprite.box.width-1,0).scaleTo(width-sr.sprite.box.width-sl.sprite.box.width+1,sm.sprite.box.height)
		}
		ret.swap	= function(l,m,r) {
			sl.swap(sprites[l])
			sm.swap(sprites[m])
			sr.swap(sprites[r])
			ret.setWidth(width)
		}
		ret.setWidth(w);
		return ret
	}
}

/* Vertical bar in 3 pieces : top, middle, bottom */
widgets.vbox3		= function(t,m,b,h) {
	return function() {
// TODO: the whole function, see previous one
	}
}

/* Scrollable content */
var scrollableCnt	= 0;
widgets.scrollable	= function(bgw, w, h, topClip=0) {
	var id		= scrollableCnt++;
	var isVert = false, isHorz = false;
	var cons	= function() {
		var root = this;
		doc.find('div#game svg>defs').each(function(e) {
			e.add("clipPath").attr('id',"scroll-"+id)
			.add("rect").attr("x",0).attr("y",topClip).attr("width", w)
			.attr("height", h-topClip)
		});
		var bg		= this.call(bgw)
		var outter	= bg.add("g").attr("clip-path", "url(#scroll-"+id+")");
		var inner	= outter.add("g")
		/*var tl		= bg.getClientCoordinates(0,0);
		var br		= bg.getClientCoordinates(w,h);*/
		var started	= null
		bg.inner	= function() { return inner }
		var mouseMove	= function(e) {
			var deltaX = e.x - started.x
			var deltaY = e.y - started.y
			var bb = inner.node.getBBox()
			if (!isHorz) deltaX=0
			if (!isVert) deltaY=0
			if (deltaX!=0) {
				if (inner.pos.x+deltaX<w-bb.width)
					deltaX = w-bb.width-inner.pos.x
				if (inner.pos.x+deltaX>0)
					deltaX = -inner.pos.x
			}
			if (deltaY!=0) {
				if (inner.pos.y+deltaY<h-bb.height)
					deltaY = h-bb.height-inner.pos.y
				if (inner.pos.y+deltaY>0)
					deltaY = -inner.pos.y
			}
			inner.moveBy(deltaX,deltaY);
		}
		bg.node.onmousedown	= function(e) { started = e }
		bg.node.onmouseout	= function(e) {
			if(started == null) return false;
			var m = bg.fromClientCoordinates(e.clientX,e.clientY)
			if (m.x>0 && m.y>0 && m.x<w && m.y<h) return false
			started = null
		}
		bg.node.onmouseup	= function(e) { if (started == null) return true; mouseMove(e); started = null }
		bg.node.onmousemove	= function(e) { if (started == null) return true; mouseMove(e); started = e }
		return bg
	}
	cons.isVert	= function(_){if(_) {isVert=_;return cons} return isVert }
	cons.isHorz	= function(_){if(_) {isHorz=_;return cons} return isHorz }
	return cons;
}

/* "box9" : cut the sprite in 9 pieces for pixel perfect scaling */
var box9Cnt		= 0;
widgets.box9		= function(s, c, w,h, mar=0) {
	var id		= box9Cnt++;
	var bb		= sprites[s].box;
	var width;
	var height;
	var cid = c+"-"+Math.trunc(bb.width)+"-"+Math.trunc(bb.height);
	var pid = s+"-"+c;
	/* Create the clipping defs before drawing */
	doc.find('div#game svg>defs').each(function(e) {
		// The sprite
		sprites[s].setup()
		// clipPaths for the 9 parts
		function makeClip(id,x,y,w,h) {
			if(e.find('#'+id).nodes.length>0) return
			e.add("clipPath").attr('id',id)
				.add("rect").attr("x",x).attr("y",y).attr("width", w).attr("height", h)
		}
		makeClip("clip-box9-"+cid+"-tl", 0,0,c+1,c+1)
		makeClip("clip-box9-"+cid+"-t", c,0,bb.width-2*c+1,c+1)
		makeClip("clip-box9-"+cid+"-tr", bb.width-c,0,c+1,c+1)
		makeClip("clip-box9-"+cid+"-l", 0,c,c+1,bb.height-2*c+1)
		makeClip("clip-box9-"+cid+"-c", c,c,bb.width-2*c+1,bb.height-2*c+1)
		makeClip("clip-box9-"+cid+"-r", bb.width-c,c,c+1,bb.height-2*c+1)
		makeClip("clip-box9-"+cid+"-bl", 0,bb.height-c,c+1,c)
		makeClip("clip-box9-"+cid+"-b", c,bb.height-c,bb.width-2*c+1,c)
		makeClip("clip-box9-"+cid+"-br", bb.width-c,bb.height-c,c,c)
		// The 9 parts
		function makeUse(dir,x=0,y=0) {
			if (e.find("#box9-"+pid+"-"+dir).nodes.length>0) return
			var r = e.add('use').attr('xlink:href',"#"+s).attr("clip-path", "url(#clip-box9-"+cid+"-"+dir+")").attr('id', "box9-"+pid+"-"+dir)
			if(x!=0||y!=0)
				r.moveTo(x,y);
		}
		makeUse("tl")
		makeUse("t",-c,0)
		makeUse("tr",c-bb.width,0)
		makeUse("br",c-bb.width,c-bb.height);
		makeUse("b",-c,c-bb.height)
		makeUse("bl",0,c-bb.height)
		makeUse("r",c-bb.width,-c)
		makeUse("c",-c,-c)
		makeUse("l",0,-c)
	});
	var cons = function() {
		var ret		= this.add("g")
		var tl		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-tl");
		var t		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-t");
		var tr		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-tr");
		var l		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-l");
		var m		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-c");
		var r		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-r");
		var bl		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-bl");
		var b		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-b");
		var br		= ret.add("use").attr('xlink:href', "#box9-"+pid+"-br");
		var apply	= function(b9,w,h) {
			t.scale((w-2*c)/(b9.bb.width-2*c+1),1).moveTo(c,0);
			tr.moveTo(w-c-mar,0);
			l.scale(1,(h-2*c)/(b9.bb.height-2*c+1)).moveTo(0,c);
			m.scale((w-2*c)/(b9.bb.width-2*c+1),(h-2*c)/(b9.bb.height-2*c+1)).moveTo(c,c);
			r.scale(1,(h-2*c)/(b9.bb.height-2*c+1)).moveTo(w-c-mar,c);
			bl.moveTo(0,h-c-mar);
			b.scale((w-2*c)/(b9.bb.width-2*c+1),1).moveTo(c,h-c-mar);
			br.moveTo(w-c-mar,h-c-mar);
		}
		ret.setSize	= function(w,h) {
			width	= w
			height	= h
			apply(cons, width, height);
		}
		ret.swap	= function(b9) {
			tl.attr('xlink:href', "#box9-"+b9.pid+"-tl");
			t.attr('xlink:href', "#box9-"+b9.pid+"-t");
			tr.attr('xlink:href', "#box9-"+b9.pid+"-tr");
			l.attr('xlink:href', "#box9-"+b9.pid+"-l");
			m.attr('xlink:href', "#box9-"+b9.pid+"-c");
			r.attr('xlink:href', "#box9-"+b9.pid+"-r");
			bl.attr('xlink:href', "#box9-"+b9.pid+"-bl");
			b.attr('xlink:href', "#box9-"+b9.pid+"-b");
			br.attr('xlink:href', "#box9-"+b9.pid+"-br");
			apply(b9, width, height);
			return ret;
		}
		ret.setSize(w,h);
		return ret
	}
	cons.id		= id;
	cons.pid	= pid;
	cons.bb		= bb;
	return cons;
}

}));

