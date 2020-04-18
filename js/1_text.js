(function(global, factory) {
	factory(global.game, global.doc, global)
})(this, (function(game, doc, global) {
	var defaultColor	= '#fff';
	var defaultFamily	= 'Arial,sans-serif';
	var defaultSize		= 30;
	var defaultSpacing	= 1.2;
	game.text = function(str) {
		var size	= defaultSize;
		var family	= defaultFamily;
		var color	= defaultColor;
		var spacing	= defaultSpacing;
		var lineCount	= 0;
		var cons	= function() {
			var g = this.add('g').attr("font-size",size).attr("font-family",family).attr("fill",color)
			g.getNewLine	= function(str) {
				return g.add('text').html(str).attr("y",lineCount++*spacing*size);
			}
			g.addLine	= function(str) { g.getNewLine(str);return g }
			g.reset		= function() { lineCount = 0;g.node.textContent = '';return g }
			g.size		= function(_size) { size=_size;g.attr("font-size",size);return g }
			g.spacing	= function(_size) { spacing=_size;return g }
			g.family	= function(_family) { family=_family;g.attr("font-family",family); return g }
			g.color		= function(_color) { color=_color; g.attr("fill",color);return g }
			g.setText	= function(_text) { g.find('text').lead.html(_text);return g }
			g.addLine(str);
			return g;
		}
		cons.size		= function(_size)   { size=_size;return cons }
		cons.spacing		= function(_size)   { spacing=_size;return cons }
		cons.family		= function(_family) { family=_family;return cons }
		cons.color		= function(_color)  { color=_color;return cons }
		return cons
	}
	game.text.setDefaultSize	= function(size) {	defaultSize=size	}
	game.text.setDefaultFamily	= function(family) {	defaultFamily=family	}
	game.text.setDefaultColor	= function(color) {	defaultColor=color	}
	game.text.setDefaultSpacing	= function(spacing) {	defaultSpacing=spacing	}
}));

