var Connection = new function(){
	//internal method for turning json objects to query string
	var serializeObject = function(obj, parentString){
		var count = obj.length,serialized = "";
		for (var i in obj) {
			var keyval_str,key = (obj instanceof Array) ? "" : encodeURIComponent(i);
			if (parentString) key = parentString + "[" + key + "]";
			else key = encodeURIComponent(i);
			if (obj[i] instanceof Object) {
				if (obj[i] instanceof String || obj[i] instanceof Number) keyval_str = key + "=" + encodeURIComponent(obj[i]);
				else keyval_str = serializeObject(obj[i], key);
			}
			else keyval_str = key + "=" + encodeURIComponent(obj[i].toString());
			count--;
			serialized += "&" + keyval_str;
		}
		return serialized.replace(/^&/, '');
	};
	var loadScript_head = document.getElementsByTagName("head")[0]; 
	var loadScript = function(url,onload) {
		var head = loadScript_head,script = document.createElement("script");
		script.src =  url;
		script.type = "text/javascript";
		// Attach handlers for all browsers
		var done = false;
		script.onload = script.onreadystatechange = function() {
			if( !done && ( !this.readyState
			||	this.readyState == "loaded"
			||	this.readyState == "complete") ) {
				done = true;
				if(onload) onload(script);
				// Handle memory leak in IE
				script.onload = script.onreadystatechange = null;
			}
		};
		head.appendChild(script);
		return script;
	}
	this.JSONDataRequest = function(url,callbackName,callback) {
		window[callbackName] = callback;
		var count = 0;
		this.request = function(obj){
			if(callback) obj["callback"]=callbackName;	
			obj["s"] = count;
			if(this.scriptObj) {
				this.scriptObj.parentNode.removeChild(this.scriptObj);
				delete this.scriptObj
			}
			this.scriptObj = loadScript(url +"?"+ serializeObject(obj));
			count++;
		}
	};
	var iframe_count = 0;
	this.MakeIframeTarget = function(form, encapsulating_object, callback){
		var target = encapsulating_object + "_" + iframe_count;
		var iframe = $B("iframe", {
			name: target
		});
		iframe_count++;
		form.target = target;
		var inputs = form.getElementsByTagName("input");
		if (encapsulating_object) {
			for (var i = inputs.length - 1; i >= 0; i--) {
				if (!(inputs[i].exclude || inputs[i].encapsulated)) {
					inputs[i].name = encapsulating_object + "[" + inputs[i].name + "]";
					inputs[i].encapsulated = true;
				}
			}
		}
		var ret;
		if(form.onsubmit) ret = form.onsubmit;
		var setElementsDisabled = function(v){for (var i=inputs.length-1;i>=0;i--)inputs[i].readOnly = v;}
		form.onsubmit = function(){
			if(ret  && ret(arguments)) {
				setElementsDisabled(true);
			}
			return true;
		};
		iframe.onload = function() {
			iframe.onload = function() {
				setElementsDisabled(false);
				if(callback) callback();
			}
		}
		document.body.appendChild(iframe);
		return iframe;
	};
}();
