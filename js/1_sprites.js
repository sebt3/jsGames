(function(global, factory) {
	factory(global.game, global.game.sprites = global.game.sprites || [], global.doc, global)
})(this, (function(game, sprites, doc, global) {
	var sheet = function(e) {
		var sheet = e;
		sheet.get = function(sp) { return sheet.find("g#".concat(sp)).lead; }
		return sheet;
	}
	var sprite = function(e,sh,sp) {
		var sprite = e;
		sprite.setup	= function() {
			doc.find('div#game svg>defs').each(function(e) {
				if (e.find("#"+sh+"-"+sp).nodes.length>0) return
				e.clone(sprite).attr('id',sh+"-"+sp).attr("transform", "translate("+(-sprite.box.x)+" "+(-sprite.box.y)+")")
			})
		}
		sprite.constructor = function() {
			var g = this.add("g");
			var set = function(s) {
				s.setup();
				g.sprite = s;
				g.obj = g.add("use").attr('xlink:href',"#"+sh+"-"+sp);
				//g.obj
			}
			g.scaleTo = function(x,y) {
				g.scale(x/g.sprite.box.width,y/g.sprite.box.height);
				return g;
			}
			g.swap = function(spr) {
				g.obj.remove();
				set(spr);
				return g;
			}
			g.father = this;
			set(sprite)
			return g;
		}
		sprite.sheet_id = sh;
		sprite.sheet = sprites.sheets[sh];
		sprite.sprite_id = sp;
		sprite.box = sprite.node.getBBox()
		return sprite;
	}
	sprites.sheets = [];
	doc.find('body>div.hidden#svg div.svg').each(function(e) { 
		sprites.sheets[e.node.id] = sheet(e); 
		e.find('g').each(function(sp) {
			if (sp.node.id != "") {
				sprites[e.node.id.concat("-",sp.node.id)] = sprite(sp,e.node.id,sp.node.id);
			}
		})
	})
}));

