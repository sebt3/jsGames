(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {
var height	= 1080;
var width	= height;
var leftMargin	= 1920 - width;
var margin	= 8;
var aLength	= 5;
var rand	= function (m) { return Math.floor(Math.random() * Math.floor(m)) }
var rect	= function(col, w, h, r=8) {
	return function() {
		return this.add("rect").attr("width",w).attr("height",h).attr("rx",r).attr("ry",r).attr("fill",col)
	}
}

widgets.grid	= function(sc, wc=4,hc=4, col1="#555",col2="#AAA") {
	var h		= (height - margin)/hc - margin;
	var w		= (width - margin)/wc - margin;
	var a		= [];
	var score	= sc;
	for (var x=0;x<wc;x++) {
		var t = []
		for (var y=0;y<hc;y++) {
			t[y] = null;
		}
		a[x] = t
	}
	var cons	= function() {
		var root= this;
		var g	= this.add("g").moveTo(leftMargin,0);
		g.call(rect(col1,width, height))
		for(var x=0;x<wc;x++)
			for(var y=0;y<hc;y++)
				g.call(rect(col2,w,h)).moveTo(margin+x*(w+margin),margin+y*(h+margin))

		g.getCellSize	= function() { return { width: w, height: h } }
		g.getCellPos	= function(x,y) {
			var a = margin + x*(w+margin) + leftMargin;
			var b = margin + y*(h+margin);
			return { x: a, y: b }
		}
		g.canPlay	= function() {
			for(var x=0;x<wc;x++) {
				for(var y=0;y<hc;y++) {
					if (a[x][y] == null) return true
					if(x>0 && a[x-1][y].value() == a[x][y].value()) return true
					if(y>0 && a[x][y-1].value() == a[x][y].value()) return true
				}
			}
			return false
		}
		g.maxVal	= function() {
			v = 0;
			for(var x=0;x<wc;x++)
				for(var y=0;y<hc;y++)
					if (a[x][y] != null && v<a[x][y].value()) v=a[x][y].value()
			return v
		}
		g.haveVal	= function(val) { score.max(val) }
		g.clean		= function() {
			for(var x=0;x<wc;x++) {
				for(var y=0;y<hc;y++) {
					if (a[x][y] != null) {
						a[x][y].node.remove()
						a[x][y] = null
					}
				}
			}
			return g
		}
		g.addCell	= function() {
			var x = rand(wc)
			var y = rand(hc)
			var found = true
			for(var i=0;i<5 && a[x][y] != null;i++) {x = rand(wc);y = rand(hc)} // try up to 5 times to find a random empty cell
			if (a[x][y] != null) {
				found = false
				for (var i=0;i<wc && !found;i++) {
					for (var j=0;j<hc && !found;j++) {
						if (a[i][j] == null) {
							x = i;y = j;found = true
						}
					}
				}
			}
			if (found) {
				var startTick	= -1
				var ani		= anim.add(g,function(e,tick) {
					if (startTick == -1)
						startTick=tick;
					if (tick - startTick > aLength) {
						if (!score.locked()) {
							var v = 2*rand(2)+2
							score.add(v)
							a[x][y] = root.call(widgets.cell(g,x,y, v))
							if (!g.canPlay()) {
								score.loose()
							}
						}
						anim.del(ani)
					}
				})

			}
			return found
		}
		g.moveLeft		= function() {
			var moved = false;
			if (anim.count()>0) return false;
			for (var y=0;y<hc;y++) {
				var pos = 0;
				for (var x=0;x<wc;x++) {
					if (a[x][y] != null && x != pos) {
						if (a[pos][y]!=null && a[pos][y].value() == a[x][y].value()) {
							a[pos][y].merge(a[x][y])
							score.add(10)
							pos++
							a[x][y]=null;moved=true;
						} else if (a[pos][y]!=null) {
							pos++
							if(pos!=x) {
								a[pos][y] = a[x][y].pos(pos,y)
								a[x][y]=null;moved=true;
							}
						} else {
							a[pos][y] = a[x][y].pos(pos,y)
							a[x][y]=null;moved=true;							}

					}
				}
			}
			return moved
		}
		g.moveRight		= function() {
			var moved = false;
			if (score.locked()) return false;
			if (anim.count()>0) return false;
			for (var y=0;y<hc;y++) {
				var pos = wc-1;
				for (var x=pos;x>=0;x--) {
					if (a[x][y] != null && x != pos) {
						if (a[pos][y]!=null && a[pos][y].value() == a[x][y].value()) {
							a[pos][y].merge(a[x][y])
							score.add(10)
							pos--
							a[x][y]=null;moved=true;
						} else if (a[pos][y]!=null) {
							pos--
							if(pos!=x) {
								a[pos][y] = a[x][y].pos(pos,y)
								a[x][y]=null;moved=true;
							}
						} else {
							a[pos][y] = a[x][y].pos(pos,y)
							a[x][y]=null;moved=true;							}

					}
				}
			}
			return moved
		}
		g.moveUp		= function() {
			var moved = false;
			if (score.locked()) return false;
			if (anim.count()>0) return false;
			for (var x=0;x<wc;x++) {
				var pos = 0;
				for (var y=0;y<hc;y++) {
					if (a[x][y] != null && y != pos) {
						if (a[x][pos]!=null && a[x][pos].value() == a[x][y].value()) {
							a[x][pos].merge(a[x][y])
							score.add(10)
							pos++
							a[x][y]=null;moved=true;
						} else if (a[x][pos]!=null) {
							pos++
							if(pos!=y) {
								a[x][pos] = a[x][y].pos(x,pos)
								a[x][y]=null;moved=true;
							}
						} else {
							a[x][pos] = a[x][y].pos(x,pos)
							a[x][y]=null;moved=true;							}

					}
				}
			}
			return moved
		}
		g.moveDown		= function() {
			var moved = false;
			if (score.locked()) return false;
			if (anim.count()>0) return false;
			for (var x=0;x<wc;x++) {
				var pos = hc-1;
				for (var y=pos;y>=0;y--) {
					if (a[x][y] != null && y != pos) {
						if (a[x][pos]!=null && a[x][pos].value() == a[x][y].value()) {
							a[x][pos].merge(a[x][y])
							score.add(10)
							pos--
							a[x][y]=null;moved=true;
						} else if (a[x][pos]!=null) {
							pos--
							if(pos!=y) {
								a[x][pos] = a[x][y].pos(x,pos)
								a[x][y]=null;moved=true;
							}
						} else {
							a[x][pos] = a[x][y].pos(x,pos)
							a[x][y]=null;moved=true;
						}

					}
				}
			}
			return moved
		}
		g.played		= function() {
			if(!g.addCell()) {
				score.loose()
			} else
				score.max(g.maxVal())
		}
		doc.node.onkeyup	= function(e) {
			var moved = false;
			if (anim.count()>0) return;
			switch(e.key) {
			case "ArrowLeft":
				moved = g.moveLeft();
				break;
			case "ArrowRight":
				moved = g.moveRight();
				break;
			case "ArrowUp":
				moved = g.moveUp();
				break;
			case "ArrowDown":
				moved = g.moveDown();
				break;
			}
			if(moved) g.played()
		}
		var pos;
		var pDown	= function(e) { pos = e;  }
		var pUp		= function(e) {
			var moved = false;
			var dx=0,dy=0
			if (e.type == "mouseup") {
				dx = pos.clientX - e.clientX
				dy = pos.clientY - e.clientY
			} else if (e.type == "touchend") {
				dx = pos.touches[0].clientX - e.changedTouches[0].clientX
				dy = pos.touches[0].clientY - e.changedTouches[0].clientY
			}
			if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx)>20) {		// horizontal
				if (dx>0)
					moved = g.moveLeft();
				else
					moved = g.moveRight();
			} else if (Math.abs(dx) < Math.abs(dy) && Math.abs(dy)>20) {	// vertical
				if (dy>0)
					moved = g.moveUp();
				else
					moved = g.moveDown();
			}
			if(moved) g.played()
		}
		doc.node.addEventListener('touchstart', pDown, false)
		doc.node.addEventListener('touchend', pUp, false)
		g.addCell()
		return g
	}
	return cons;
}
}));
