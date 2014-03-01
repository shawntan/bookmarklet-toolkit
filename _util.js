var $B = function(tagName, object) {
	console.log(object);
	var e = document.createElement(tagName);
	e.immune = true; 
	for (var att in object) {
		if (att == "style") {
			for (var i in object.style) {
				if (i == 'float') e.style.cssFloat = e.style.styleFloat = object.style['float'];
				else e.style[i] = object.style[i];
			}
		}
		else if (att == "children") for (var i = 0; i < object.children.length; i++) e.appendChild(object.children[i]);
		else e[att] = object[att];
	}
	if(tagName == "input"){
		if(e.placeholder) {
			e.onblur = function(){if(e.value.length==0) e.value = e.placeholder}
			e.onfocus = function(){if(e.value == e.placeholder)	e.value = "";}
		}
	}
	
	$B.elements.push(e);
	return e;
};
$B.elements = [];
$B.destroyAll = function(){
	for(var i=$B.elements.length-1;i>=0;i--){
		var element = $B.elements[i];
		if(element){
			if(element.parentNode) element.parentNode.removeChild(element);
			delete element;
		}
	}
};
var blank_function = function() {};
var block_event = function(e) {
	if (!e) var e = window.event;
	e.cancelBubble = true;
	if (e.stopPropagation) e.stopPropagation();
};
var getPos = function(obj) {
	var curleft,curtop;
	curleft = curtop = 0;
	if (obj.offsetParent) {
		do {
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
		} while (obj = obj.offsetParent);
	}
	return {left: curleft,top: curtop};
};
HTMLElement.prototype.getIndex = function(){
	if(this.index) return this.index
	else {
		var result = 1,abs=1,temp = this,tagname = this.tagName;
		while (temp = temp.previousSibling){
			abs++;
			if (temp.tagName == tagname) result++;
		}
		this.index = result;
	}
	return result;
};
HTMLElement.prototype.getAbsolute = function() {
	if(this.abs) this.getIndex();
	return this.abs;
};

HTMLElement.prototype.isLast = function(){
	if(this.donelast) return this.last
	var last = this.parentNode.children[this.parentNode.children.length-1];
	this.donelast = true;
	do{
		if(last == this){
			this.last = true;
			return true;
		} else {
			last = last.previousSibling;
		} 
	} while(last.tagName!=this.tagName);
	this.last = false;
	return false;
};

HTMLElement.prototype.getClasses = function(){
	if(this.classes) return this.classes;
	var result;
	if(this.className) {
		if(this.className.trim()=="") result = null;
		else {
			result = this.className.trim().split(/\s+/);
			var index;
			for(var i=classignorelist.length-1;i>=0;i--){
				if((index = result.indexOf(classignorelist[i]))>=0) result.splice(index, 1);
			}
			result.sort();
		}
		this.classes = result;
	}
	return result;
};
window.queryDocument = (function(){
	if(document.evaluate){
		var result_holder=null;
		return function(expression){
			if(!expression) return;
			result_holder = document.evaluate(expression, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, result_holder);
			var res,res_length = result_holder.snapshotLength;
			res = new Array();
			for(var i=res_length-1;i>=0;i--){
				var v = result_holder.snapshotItem(i);
				if (v.className.indexOf(styles['interface']) == -1 ) {
					res.push(v);
				}
			}
			return res;
		}
	}
})();
