(function(global, factory) {
	factory(global)
})(this, (function(global) {
	// elements
	var find, elem = function(d) {
		var e = function()  {
			if (this.hasOwnProperty("constructor") && typeof this["constructor"] === "function") {
				return this["constructor"].call(e);
			} else if (typeof this === "function") {
				return this.call(e);
			}
			console.log("elem.e, hum shouldnt be here");
			return e;
		}
		e.node = d
		e.add = function(type,before) {
			var n, b = null;
			switch(type) {
			case "use":	case "svg":	case "line":	case "defs":	case "clipPath":
			case "g":	case "rect":	case "text":	case "path":	case "mask":
				n = global.document.createElementNS('http://www.w3.org/2000/svg', type);
				if(type=="svg") {
					n.setAttribute("height", "100%")
					n.setAttribute("width", "100%")
					n.setAttribute("xmlns","http://www.w3.org/2000/svg")
					n.setAttribute("xmlns:xlink","http://www.w3.org/1999/xlink")
					var d = global.document.createElementNS('http://www.w3.org/2000/svg', 'defs');
					n.insertBefore(d,null);
				}
				break;
			default:
				n = global.document.createElement(type);
				break;
			}
			switch(typeof before) {
			case "object":
				b = before;
				break;
			case "string":
				b = e.node.querySelector(before);
				break;
			case "function":
				if (typeof before["node"] === "object")
					b = before.node;
				break;
			}
			e.node.insertBefore(n,b);
			return elem(n);
		}
		e.html = function(c) {
			if (typeof(c) === "string")	e.node.innerHTML = c;
			else	return e.node.innerHTML;
			return e;
		}
		e.find = find;
		e.clone = function(el) {
			var ne = el.node.cloneNode(true);
			ne.removeAttribute('id');
			e.node.appendChild(ne);
			return elem(ne);
		}
		e.remove = function() {
			e.node.remove();
			return e;
		}
		e.attr = function(name,value) {
			if (arguments.length >1 && value===null) {
				e.node.removeAttribute(name);
			} else if (arguments.length >1 && name.startsWith("xlink")) {
				e.node.setAttributeNS('http://www.w3.org/1999/xlink', name, value);
			} else if (arguments.length >1) {
				e.node.setAttribute(name, value);
			} else if (arguments.length == 1) {
				return e.node.getAttribute(name);
			}
			return e
		}
		switch(e.node.nodeName) {
			case "line":
			case "g":
			case "rect":
			case "text":
			case "use":
			case "path":
				var scale = { x:1, y:1}
				var pos = { x:0, y:0}
				var angle = 0
				var transform = function() {
					e.attr("transform", "translate("+pos.x+" "+pos.y+") scale("+scale.x+" "+scale.y+") rotate("+angle+")")
				}
				e.pos = pos;
//				e.svg = elem(svg);
				e.moveTo = function(x,y) {
					pos.x = x;pos.y = y;
					transform();
					return e;
				}
				e.moveBy = function(x,y) {
					pos.x += x;pos.y += y;
					transform();
					return e;
				}
				e.scale = function(x,y) {
					scale.x = x;scale.y = y;
					transform();
					return e;
				}
				e.rotate = function(a) {
					angle = a;
					transform();
					return e;
				}
				e.fromClientCoordinates	= function(x, y) {
					var svg = e.node;
					var ctm = e.node.getScreenCTM()
					while(typeof svg.parentNode["getCTM"] === "function") {
						svg = svg.parentNode
					}
					var point = svg.createSVGPoint(); point.x = x; point.y = y;
					return point.matrixTransform(ctm.inverse())
				}
				break;
		}

		return e
	}
	// selections (aka groups of elements)
	find = function(sel) {
		var f   = function()  { console.log('find.f called',this,arguments);return f; }
		f.nodes = [];
		var p   = function(a) { f.nodes.push(elem(a)); }
		f.find  = find;
		if (this === global)
			global.document.querySelectorAll(sel).forEach(p)
		else if(typeof this["each"] === "function")
			this.each(function(e){e.node.querySelectorAll(sel).forEach(p);});
		else if(typeof this["node"] === "object")
			this.node.querySelectorAll(sel).forEach(p);
		f.each  = function () { f.nodes.forEach(...arguments) };
		f.lead  = f.nodes[0];
		f.add   = function() {var args = arguments;f.each(function(e){e.add(...args)});return find.call(this,sel+" "+args[0])};
		f.attr  = function() {var args = arguments;f.each(function(e){e.attr(...args)});return f};
		return f
	}
	global.doc = elem(global.document);
}));

