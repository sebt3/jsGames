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

widgets.grid	= function(wc=4,hc=4, col1="#555",col2="#AAA") {
	var h		= (height - margin)/hc - margin;
	var w		= (width - margin)/wc - margin;
	var a		= [];
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
		g.isFull	= function() {
			for(var x=0;x<wc;x++)
				for(var y=0;y<hc;y++)
					if (a[x][y] == null) return true
			return false
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
						a[x][y] = root.call(widgets.cell(g,x,y, 2*rand(2)+2))
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
			if (anim.count()>0) return false;
			for (var y=0;y<hc;y++) {
				var pos = wc-1;
				for (var x=pos;x>=0;x--) {
					if (a[x][y] != null && x != pos) {
						if (a[pos][y]!=null && a[pos][y].value() == a[x][y].value()) {
							a[pos][y].merge(a[x][y])
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
			if (anim.count()>0) return false;
			for (var x=0;x<wc;x++) {
				var pos = 0;
				for (var y=0;y<hc;y++) {
					if (a[x][y] != null && y != pos) {
						if (a[x][pos]!=null && a[x][pos].value() == a[x][y].value()) {
							a[x][pos].merge(a[x][y])
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
			if (anim.count()>0) return false;
			for (var x=0;x<wc;x++) {
				var pos = hc-1;
				for (var y=pos;y>=0;y--) {
					if (a[x][y] != null && y != pos) {
						if (a[x][pos]!=null && a[x][pos].value() == a[x][y].value()) {
							a[x][pos].merge(a[x][y])
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
			if(moved) {
				if(!g.addCell()) {
					console.log("You loose")
				}
			}
		}
		var pos;
		var pDown	= function(e) { pos = e; e.preventDefault() }
		var pUp		= function(e) {
			e.preventDefault()
			var moved = false;
			var dx = pos.clientX - e.clientX
			var dy = pos.clientY - e.clientY
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
			if(moved) {
				if(!g.addCell()) {
					console.log("You loose")
				}
			}
		}
		doc.node.onmousedown	= pDown
		doc.node.onmouseup	= pUp
		doc.node.addEventListener('touchstart', pDown, false)
		doc.node.addEventListener('touchmove', function(e){ e.preventDefault() }, false)
		doc.node.addEventListener('touchend', pUp, false)

		return g
	}
	return cons;
}
}));
