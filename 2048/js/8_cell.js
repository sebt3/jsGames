(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {
var margin	= 8;
var aLength	= 5;
//var colors = ["#f7a72e","#eca02b","#d99227","#c58423","#b2781e","#a26c1a","#926117","#835713","#744d10","#67430d","#5b3b0a","#452c06"]
var colors = ["#7cb342","#8bc34a","#9ccc65","#aed581","#cddc39","#dce775","#fff176","#ffeb3b","#fdd835","#fbc02d","#ff8f00","#ff6f00"]

widgets.cell	= function(grid, _x, _y, _v=2, r=8) {
	var x = -1, y, val;
	var dim = grid.getCellSize()
	return function() {
		var c	= this.add("g")
		var re	= c.add("rect").attr("width",dim.width).attr("height",dim.height).attr("rx",r).attr("ry",r).attr("stroke", "#AAA").attr("stroke-width",margin)
		var t	= c.call(game.text(""+val).size(dim.height/2)).moveTo(dim.width/2-dim.height/6,dim.height*2/3)
		c.value	= function(_) {
			if (arguments.length<1)
				return val
				val	= _;
			var col	= colors[11];
			switch(val) {
			case    2: col=colors[0];break;
			case    4: col=colors[1];break;
			case    8: col=colors[2];break;
			case   16: col=colors[3];break;
			case   32: col=colors[4];break;
			case   64: col=colors[5];break;
			case  128: col=colors[6];break;
			case  256: col=colors[7];break;
			case  512: col=colors[8];break;
			case 1024: col=colors[9];break;
			case 2048: col=colors[10];break;
			}
			re.attr("fill",col)
			t.setText(""+val)
			if (val>10 && val<100)
				t.moveTo(dim.width/2-dim.height/3,dim.height*2/3)
			else if (val>100 && val<1000)
				t.moveTo(dim.width/15,dim.height*2/3)
			else if (val>1000 && val<10000)
				t.size(dim.height/3).moveTo(dim.width/10,dim.height*16/27)
			else if (val>10000)
				t.size(dim.height/4).moveTo(dim.width/8,dim.height*7/12)
			return c
		}
		var setPos	= function(_x,_y) {
			x	= _x;
			y	= _y;
			var pos = grid.getCellPos(x,y)
			c.moveTo(pos.x,pos.y)
		}
		c.pos		= function(_x,_y,cb) {
			if (arguments.length<2)
				return { x: x, y: y }
			if (x!=-1) { // animate as this is not the 1st position
				var startTick	= -1
				var startPos	= grid.getCellPos(x,y)
				var endPos	= grid.getCellPos(_x,_y)
				var stepX	= (endPos.x-startPos.x)/aLength
				var stepY	= (endPos.y-startPos.y)/aLength
				var a		= anim.add(c,function(e,tick) {
					if (startTick == -1)
						startTick=tick;
					var delta	= tick - startTick

					if (delta > aLength) {
						setPos(_x,_y);
						anim.del(a)
					} else
						c.moveTo(startPos.x+delta*stepX,startPos.y+delta*stepY)
				})
			} else
				setPos(_x,_y);
			return c;
		}
		c.merge = function(other) {
			other.pos(x,y)
			var startTick	= -1
			var a		= anim.add(c,function(e,tick) {
				if (startTick == -1)
					startTick=tick;
				if (tick - startTick >= aLength) {
					c.value(val+other.value())
					other.node.remove()
					anim.del(a)
				}
			})
			return c
		}
		c.value(_v)
		c.pos(_x,_y)
		return c
	}
}
}));
