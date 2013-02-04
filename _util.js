var $B = function(tagName, object) {
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
