(function(global, factory) {
	factory(global.game, global.game.anim, global.doc, global)
})(this, (function(game, anim, doc, global) {
	var screens		= []
	game.screens		= {}
	game.screens.current	= null;
	game.screens.add	= function(name,cb) { screens.push({
		name:	name,
		cb:	cb,
		data:	{}
	}); return game.screens }
	game.screens.play	= function(name) {
		var scr = null;
		screens.forEach(function(s) { if(s.name == name) scr = s })
		if (scr != null) {
			// Stop previous screen
			anim.stop()
			anim.empty()
			doc.find('div#game').lead.html("");
			// Load the backup data for that screen
			for (var i=0;i<localStorage.length;i++) {
				var k = localStorage.key(i);
				var v = localStorage.getItem(k);
				var key = scr.data;
				var prevK = key;
				var prevJ = '';
				var a = k.split('.')
				if (a[0] == scr.name) {
					for (var j=1;j<a.length;j++) { prevK = key; key[a[j]] = key[a[j]] || {}; key=key[a[j]], prevJ=j }
					prevK[a[prevJ]] = v
				}
			}
			// Start the screen
			game.screens.current = scr.cb.call(doc.find('div#game').lead, scr);
			anim.start()
		}
		return game.screens
	}
	anim.addLong(function() {
		if (game.screens.current != null) {
			// Backup current screen data
			var d = game.screens.current.data
			var stack = []
			var root = game.screens.current.name
			Object.keys(d).forEach(function(k) {
				var v = d[k];
				if (typeof(v) == "object")
					stack.push({root:root+'.'+k, value: v});
			})
			while(stack.length>0) {
				var e = stack.pop();
				Object.keys(e.value).forEach(function(k) {
					var v = e.value[k];
					if (typeof(v) == "object")
						stack.push({root: e.root+'.'+k, value: v});
					// TODO: support for array in the data
					else
						localStorage.setItem(e.root+'.'+k, v)
				})
			}
		}
	})
}));
