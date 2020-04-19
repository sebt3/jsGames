(function(global, factory) {
	factory(global.game, global.game.widgets, global.game.sprites, global.game.anim, global.doc, global)
})(this, (function(game, widgets, sprites, anim, doc, global) {
widgets.score	= function(data, cb) {
	// TODO: support a highScore table per configuration
	var width	= 700;
	var height	= 80;
	var target	= 2048;
	var size	= 4;
	var val		= 0;
	var dialog	= function() {
		var bd	= null, dlg = null;
		var w	= 800, h = 500
		var a	= widgets.box9("ui-btn-green-flat-up",11,400,80,1)
		var b	= widgets.box9("ui-btn-green-flat-down",11,400,80,1)
		var me	= this.add("g")
		bd	= me.add("rect").attr("fill","#999").attr("width", 1920).attr("height",1080).attr("fill-opacity",0.6)
		me.dlg	= me.call(widgets.box9("ui-square-white",11,w,h,1)).moveTo((1920-w)/2,(1080-h)/2)
		me.close= function() {
			if (dlg!=null) { dlg.node.remove();dlg=null }
			if (bd!=null)  {  bd.node.remove(); bd=null }
			me.node.remove()
			cb(size,target)
		}
		me.call(widgets.clickable(sprites["ui-round-red"],sprites["ui-round-blue"],sprites["ui-round-red"],me.close))
			.setIcon(sprites["ui-cross-white"]).moveTo((1920+w)/2-20,(1080-h)/2-20)
		me.call(widgets.clickable(a,b,b,me.close)).setShift(3)
			.moveTo((1920-400)/2,(1080+h)/2-100)
			.setTextPos({x:110,y:50}).setText(game.text("Restart").size(40))
		var sc = me.dlg.call(game.text("Score: "+val).size(80).color("black"))
		sc.moveTo((w-sc.node.getBBox().width)/2-50,h-200)
		return me;
	}
	return function() {
		var root	= this;
		var locked	= false;
		var me		= this.add("g")
		me.call(widgets.box9("ui-btn-yellow-raised-down",11,width,height,1))
		var text	= me.call(game.text("Score: 0").size(80)).moveTo(40,65)
		var update	= function()  { text.setText("Score: "+val) }
		me.setTarget	= function(t) { target = t;return me }
		me.locked	= function()  { return locked }
		me.add		= function(x) { val+=x;update();return me }
		me.reset	= function(s,t) {size=s;target=t;val=0;locked=false;update();return me }
		me.max		= function(v) { if (typeof target == "number" && v>=target) me.win() }
		me.win		= function()  {
			locked	= true
			var dlg	= root.call(dialog)
			dlg.dlg.call(game.text("You won !!").size(60).color("green")).rotate(-15).moveTo(250,150)
		}
		me.loose	= function() {
			locked	= true
			var dlg	= root.call(dialog)
			dlg.dlg.call(game.text("You won !!").size(60).color("green")).rotate(-15).moveTo(250,150)
		}

		return me
	}
}
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

