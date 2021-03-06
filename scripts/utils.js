CHESSAPP.utils = (function(){
	var benchmark = {};
	this.extend = function(o, p){
		for(prop in p){
			o[prop] = p[prop];
		}
		return o;
	};
	this.bm_start = function(msg){
		benchmark.timeStart = Date.now();
		benchmark.msg = msg;  
	};
	this.bm_end = function(){
		var difference = Date.now() - benchmark.timeStart;
		console.log(benchmark.msg + " - " + difference);
	};
	this.bind = null;
	this.removeClass = function(elem, className){
		var regex = new RegExp("(^| )" + className + "( |$)", "gi");

		var curClass = elem.className;
		curClass = curClass.replace(regex, "");
		elem.className = curClass;
	}
	this.addClass = function(elem, className){
		if(elem.className != ""){
			//remove any existing
			this.removeClass(elem, className);
		}
		elem.className += " " + className;        
	}
	this.shallowCopy = function(o){
		var c = {};
		for(var p in o){
			if(o.hasOwnProperty(p)){
				c[p] = o[p];
			}
		}
		return c;
	}
	return this;
})();
CHESSAPP.utils = (function(){
	var benchmark = {};
	this.extend = function(o, p){
		for(prop in p){
			o[prop] = p[prop];
		}
		return o;
	};
	this.bm_start = function(msg){
		benchmark.timeStart = Date.now();
		benchmark.msg = msg;  
	};
	this.bm_end = function(){
		var difference = Date.now() - benchmark.timeStart;
		console.log(benchmark.msg + " - " + difference);
	};
	this.bind = null;
	this.removeClass = function(elem, className){
		var regex = new RegExp("(^| )" + className + "( |$)", "gi");

		var curClass = elem.className;
		curClass = curClass.replace(regex, "");
		elem.className = curClass;
	}
	this.addClass = function(elem, className){
		if(elem.className != ""){
			this.removeClass(elem, className);
		}
		elem.className += " " + className;        
	}
	this.shallowCopy = function(o){
		var c = {};
		for(var p in o){
			if(o.hasOwnProperty(p)){
				c[p] = o[p];
			}
		}
		return c;
	}
	return this;
})();
if(typeof window.addEventListener === "function"){
	CHESSAPP.utils.bind = function(elem, type, fn){
		elem.addEventListener(type, fn, false);
	}
	CHESSAPP.utils.unbind = function(elem, type, fn){
		elem.removeEventListener(type, fn, false);
	}
}
else if(typeof attachEvent === "function"){
	CHESSAPP.utils.bind = function(elem, type, fn){
		elem.attachEvent("on" + type, fn);
	}
	CHESSAPP.utils.unbind = function(elem, type, fn){
		elem.detachEvent("on" + type, fn);
	}
}
else{
	CHESSAPP.utils.bind = function(elem, type, fn){
		elem["on" + type] = fn;
	}
	CHESSAPP.utils.unbind = function(elem, type, fn){
		elem["on" + type] = null;
	}
}
if (!window.JSON) {
	window.JSON = {
		parse: function (sJSON) { return eval("(" + sJSON + ")"); },
		stringify: function (vContent) {
			if (vContent instanceof Object) {
				var sOutput = "";
				if (vContent.constructor === Array) {
					for (var nId = 0; nId < vContent.length; sOutput += this.stringify(vContent[nId]) + ",", nId++);
					return "[" + sOutput.substr(0, sOutput.length - 1) + "]";
				}
				if (vContent.toString !== Object.prototype.toString) { return "\"" + vContent.toString().replace(/"/g, "\\$&") + "\""; }
				for (var sProp in vContent) { sOutput += "\"" + sProp.replace(/"/g, "\\$&") + "\":" + this.stringify(vContent[sProp]) + ","; }
				return "{" + sOutput.substr(0, sOutput.length - 1) + "}";
			}
			return typeof vContent === "string" ? "\"" + vContent.replace(/"/g, "\\$&") + "\"" : String(vContent);
		}
	};
}