this.game = {
	version: "0.1.0",
	widgets: {},
	status: {
		cash: 10
	},
	format: {
		number: function(x) {
			var e = x.toExponential()
			if (e.indexOf("e")>0) {
				var exp = parseInt(e.substr(e.indexOf("e+")+2))
				var val = x/10**exp
				// TODO: improve this
				if (exp<8)
					return ""+(Math.round(x*1000)/1000)
				return ""+(Math.round(val*1000)/1000)+" 10^"+exp
			} else
				return ""+(Math.round(x*1000)/1000)
		}
	}
}
