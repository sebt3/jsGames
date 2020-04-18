(function(global, factory) {
	factory(global.game, global)
})(this, (function(game, global) {
	var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                              window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

	var anims	= []
	var longCalls	= []
	var stopped	= true;
	var anim	= function(elem, cb) {
		var a	= function() { console.log("anim.a CALLED",cb,elem,arguments,this) }
		a.run	= function(ts) { cb.call(elem, a, ts) }
		a.start	= null;
		return a;
	}
	game.anim	= {}
	game.anim.add	= function(elem, cb) {
		var a = anim(elem, cb)
		anims.push(a)
		return a
	}
	game.anim.addLong= function(cb) {
		longCalls.push(cb)
		return game.anim
	}
	game.anim.empty	= function() { anims	= [] }
	game.anim.count	= function() { return anims.length }
	game.anim.del	= function(a) {
		var i = anims.indexOf(a);
		if (i>=0)
			anims.splice(i,1);
	}
	var tickLen	= 40;
	game.anim.getTickLen = function() { return tickLen }
	game.anim.stop	= function() { stopped = true }
	game.anim.start	= function() { stopped = false; requestAnimationFrame(step) }

	var beginTick	= null;
	var beginPause	= null;
	var prevTick	= 0;
	var prevLong	= null;
	var step	= function(timestamp) {
		if (beginTick == null) beginTick = timestamp;
		if (beginPause != null) {
			beginTick += timestamp-beginPause;
			beginPause = null;
		}
		if (prevLong == null || prevLong+10000<timestamp) {
			prevLong = timestamp;
			longCalls.forEach(function(l){ l() })
		}
		var tick = Math.trunc((timestamp - beginTick)/tickLen)
		if(tick>prevTick)
			anims.forEach(function(a) { a.run(tick) } )
		prevTick = tick;
		if (!stopped)
			// wait for nearly next tick to request the next animation frame to do our stuff
			// to be gentle on the cpu
			setTimeout(function() {
				requestAnimationFrame(step);
			}, beginTick + (tick+1)*tickLen - timestamp);
		else
			beginPause = timestamp;
	}

	requestAnimationFrame(step);
}));
