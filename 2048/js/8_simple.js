(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {

widgets.select	= function(width, values) {
	return function() {
		var ind, me	= this.add("g")
		var w		= 90
		var h		= 50
		var c		= 15
		var a		= sprites["ui-arrow-white-left"]
		var b		= sprites["ui-arrow-yellow-left"]
		var d		= sprites["ui-arrow-white-right"]
		var e		= sprites["ui-arrow-yellow-right"]
		var display	= me.call(widgets.box9("ui-field",c,width-2*(w+10),h,1)).moveTo(w+10,0)
		var text	= me.call(game.text("").color("black"))
		me.index	= function(_) {
			if (arguments.length<1)return ind
			ind=(_+values.length)%values.length;
			text.setText(""+values[ind])
			text.moveTo(w+(display.node.getBBox().width-text.node.getBBox().width)/2,35)
		}
		me.index(0);
		me.value	= function() { return values[ind] }
		var left	= me.call(widgets.clickable(a,b,d,function() { me.index(ind-1) })).scale(w/a.box.width,h/a.box.height)
		var right	= me.call(widgets.clickable(d,e,a,function() { me.index(ind+1) })).scale(w/d.box.width,h/d.box.height)
		right.moveTo(width-w,0)
		return me
	}
}

widgets.newPlay	= function(cb) {
	var margin	= 20
	var width	= 1920 - 1080 - 2*margin
	var height	= 300
	var textW	= 300
	var lineH	= 100
	var bw		= 200
	return function() {
		var up	= widgets.box9("ui-btn-white-raised-up",11,bw,50,1)
		var dn	= widgets.box9("ui-btn-white-raised-down",11,bw,50,1)
		var me	= this.call(widgets.box9("ui-square-blue",11,width,height,1)).moveTo(margin, 1080-height-margin)
		me.call(game.text("Dimension:").size(45)).moveTo(margin,margin+35)
		var sz	= me.call(widgets.select(width-2*margin - textW, [4,5,6])).moveTo(margin+textW,margin)
		me.call(game.text("Goal:").size(45)).moveTo(margin,margin+35+lineH)
		var tg	= me.call(widgets.select(width-2*margin - textW, [2048,4096,"unlimited"])).moveTo(margin+textW,margin+lineH)
		var btn	= me.call(widgets.clickable(up,dn,dn, function() {cb(sz.value(),tg.value())}))
			.moveTo((width-bw)/2+margin,margin+2*lineH).setShift(3)
			.setText(game.text("Start").color("black"))
		return me
	}
}
}));

