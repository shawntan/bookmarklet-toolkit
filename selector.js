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
				if (v.className.indexOf(styles.interface) == -1 ) {
					res.push(v);
				}
			}
			return res;
		}
	}
})();
var styles = {
	interface:	"parcels_interface",
	selected:	"parcels_selected",
	rejected:	"parcels_rejected",
	highlighted:"parcels_highlight"
}
var GrabWindow = function(children,className,closeAction,coordinates) {
	console.log(coordinates);
	className = className?" "+className:""
	var header = $B("div", {
		children: [$B('div', {
			className: styles["interface"] ,
			innerHTML: "X",
			style: {
				'float': 'right',
				display: "block",
				clear: "left"
			},
			onclick: closeAction
		})]
	});
	var main = $B("div", {
		className: styles["interface"]+" "+"main",
		children: children
	});
	var pw = $B("div", {
		className: styles["interface"] +" dialog" + className,
		children: [header, main],
		style : coordinates?{
			left: 	coordinates.left	?	coordinates.left	+"px":null,
			top: 	coordinates.top		?	coordinates.top		+"px":null,
			right: 	coordinates.right	?	coordinates.right	+"px":null,
			right: 	coordinates.bottom	?	coordinates.bottom	+"px":null
		}:null,
		close : function(){
			pw.parentNode.removeChild(pw);
		}
	});
	document.body.appendChild(pw);
	return pw;
};
var Align = function(matcher,scorer,match,mismatch,init){
	return function(p1,p2) {
		var result = init();
		var c = new Array(p2.length + 1),p = new Array(p2.length + 1),t = new Array(p1.length + 1);
		for (var i=0;i<t.length;i++) {
			t[i] = new Array(p2.length + 1);
			var score,tmp = c;c = p;p = tmp;
			for (var j=0;j<c.length;j++) {
				if (i == 0 || j == 0) {
					if(i==0 && j==0) 	t[i][j] = 0;
					else if(i==0) 		t[i][j] = 1;
					else if(j==0) 		t[i][j] = 2;
					c[j] = 0;
				}
				else {
					score = scorer(p1[i-1],p2[j-1]);
					var 								max_score = p[j-1];	t[i][j] = 0;	//up left
					if(!matcher(p1[i-1],p2[j-1])) {
						if(c[j-1] > max_score)		{	max_score = c[j-1];	t[i][j] = 1;}	//left
						else if(p[j] > max_score)	{	max_score = p[j];	t[i][j] = 2;}	//up
					}
					c[j] = max_score + score;
				}
			}
		}
		var i= t.length-1,j= t[0].length-1;
		while(!(i==0 && j==0)) {
			switch(t[i][j]) {
				case 0:		match(p1[i-1],p2[j-1],result);	i--;j--;//up left
				break;
				case 1:		mismatch(result);	j--;//left
				break;
				case 2:		mismatch(result);	i--;//up
				break;
			}
		}
		delete c,p,t;
		return result;
	};
};
var StrictScorer = function(score,neg_score,neg_val){
	return {
		score: function(v1,v2) {return v1==v2?score:neg_score},
		value: function(v1,v2) {return v1==v2?v1:neg_val}
	}
}
var listCompare = {
	score: function(list1,list2){
		var i=0,j=0;
		while(i<list1.length && j<list2.length) {
			if(list1[i]==list2[j]) return 1;
			else if(list1[i]<list2[j]) i++;
			else if(list1[i]>list2[j]) j++;
		}
		return 0;
	},
	value: function(list1,list2){
		var common = null; 
		var i=0,j=0;
		while(i<list1.length && j<list2.length) {
			if(list1[i]==list2[j]){
				common = common?common:[];
				common.push(list1[i]);
				i++;j++;
			}
			else if(list1[i]<list2[j]) i++;
			else if(list1[i]>list2[j]) j++;
		}
	}
};
var Features = {
	tagName: {
		extract: function(element) {return element.tagName.toLowerCase();},
		compare: null,
	},
	index:{
		extract: function(element) {return element.getIndex();},
		compare: new StrictScorer(1,0,null),
		selector: function(val){return val;},
	},
	abs: {
		extract: function(element) {return element.getAbsolute();},
		compare: new StrictScorer(1,0,null),
	},
	id:{
		extract: function(element) {return element.id;},
		compare: new StrictScorer(1,0,null),
		selector: function(val){return "@id='"+val+"'";},
		unique: true,
	},	
	last: {
		extract: function(element) {return element.isLast();},
		compare: new StrictScorer(1,0,null),
		selector: function(val){return val?"last()":null;}
	},
	classes: {
		extract: function(element) {return element.getClasses();},
		compare: listCompare,
		selector: function(val) {
			var p=["contains(concat(' ',@class,' '),' "," ')","]["],sel = p[0] + val[0] + p[1];
			for(var i=1;i<val.length;i++) sel += p[2] + p[0] + val[i] + p[1];
			return sel;
		},
	},
};
Features_max_score = (function(){
	var score = 0;
	for(var i in Features) score++;
	return score;
})();
Features.tagName.compare = new StrictScorer(Features_max_score,-1*Math.ceil(Features_max_score/2.0),"*");
var SimpleSet = function() {
	var _a = [];
	var contains = this.contains = function(e) {return (_a.indexOf(e) >= 0)}
	this.add = function(e) {if(!contains(e)) _a.push(e);}
	this.remove = function(e) {
		var i;
		if((i=_a.indexOf(e))>=0)_a.splice(i,1);	
	}
	this.toArray = function(e) {return _a;}
}

HTMLElement.prototype.getAbstractElement = function() {
	if(this._obj) return this._obj;
	var obj = new Object();
	for(var i in Features) {
		var value = Features[i].extract(this);
		if(value) obj[i] = value;
	}
	this._obj = obj;
	return obj
};

HTMLElement.prototype.getPath = function() {
	if(this._path) return this._path;
	var el = this;
	var path = []
	while(el != document.body) {
		path.unshift(el.getAbstractElement());
		el = el.parentNode;
	}
	this._path = path;
	return path;
};
var matchAlign = new Align(
	function(el1,el2) {
		if(el1.tagName!='*') return el1.tagName==el2.tagName;
		else return false;
	},
	function(el1,el2) {
		if(el1=='*'||el2=='*') return Features_max_score*(-2);
		else if(el1==el2) return Features_max_score*2;
		var score = 0;
		for(var i in Features){
			if(el1[i] && el2[i]) score += Features[i].compare.score(el1[i],el2[i]);
		}
		return score;
	},
	function(el1,el2,result) {
		var obj = new Object(),val;
		for(var i in Features){
			if(el1[i] && el2[i]) {
				val = Features[i].compare.value(el1[i],el2[i]);
				if(val) obj[i] = val;
			}
		}
		if(obj.tagName == '*' && obj.index) {
			if(obj.abs) obj.index=obj.abs;
			else delete obj.index;
		}
		result.unshift(obj);
	},
	function(result) {result.unshift("*");},
	function(){return new Array();}
);
var serialisePath = function(arr){
	if(!arr) return null;
	var xpath = "",f=true;
	for(var i=arr.length-1;i>=0;i--){
		if(arr[i]=="*"){
			if(f){
				xpath = "/"+xpath;
				f=false;
			}
		}
		else {
			var tag = arr[i].tagName,token = tag;
			var s;
			for(var f in Features) {
				if(Features[f].selector && arr[i][f]) {
					s = "["+Features[f].selector(arr[i][f])+"]";
					if(Features[f].unique) return "//"+tag+s+xpath;
					else token += s;
				}
			}
			xpath = "/"+token+xpath;
			f=true;
		}
	}
	return "/html/body"+xpath;
};

var pathComparator = function(a,b){return a._path.length - b._path.length}
var GrabSelector = function(resObj) {
	var selected = new SimpleSet();
	var rejected = new SimpleSet();
	var s = this.selected = selected.toArray();
	var r = this.rejected = rejected.toArray();


	var res = this.result = {
		tag: null,
		obj: null,
		xpath: "",
	};
	if(resObj){
		res.obj = resObj;
		res.xpath = serialisePath(res.obj.selected);
		res.tag = resObj.selected[resObj.selected.length-1].tagName;
	} else res.obj = {selected:null,rejected:null};

	var recalculate = function(list) {
		list.sort(pathComparator);
		var p = list[0]._path;
		for(var i=1;i<list.length;i++) p = matchAlign(p,list[i]._path);
		return p;
	};

	this.select = function(el) {
		selected.add(el);
		if(res.obj.selected) res.obj.selected = matchAlign(res.obj.selected,el.getPath());	
		else {
			res.obj.selected = el.getPath();
			res.tag = el.tagName;
		}
		res.xpath = serialisePath(res.obj.selected);
	};
	this.deselect = function(el) {
		selected.remove(el);
		if(s.length > 0){
			res.obj.selected = recalculate(s);
			res.xpath = serialisePath(res.obj.selected);
		}
		else {
			res.obj.selected = null;
			res.tag = null;
			res.xpath = null;
		}
	};
	this.reject = function(el) {
		rejected.add(el);
	};
	this.dereject = function(el) {
		rejected.remove(el);
	};
};
var border_width = 5;
var makeBoxBorders = function(border_width, fix_side){
	var self = this;
	var d = $B('div', {className: styles.interface + " " + "box_border"});
	d.style[fix_side] = border_width + "px";
	return d;
};


var GrabBox = function(){//box : this is the thing that "boxes" up the elements to be selected
	var _box = {
    	visible: false,
    	top: makeBoxBorders(border_width, "height"),
    	bottom: makeBoxBorders(border_width, "height"),
    	left: makeBoxBorders(border_width, "width"),
    	right: makeBoxBorders(border_width, "width"),
    	text: $B('span', {}),
		setPosition: function(position, size){
			_box.setVisible(true);
			_box.bottom.style.width = _box.top.style.width = (size.width + border_width * 2) + "px";
			_box.left.style.height = _box.right.style.height = size.height + "px";
			_box.left.style.top = _box.right.style.top = position.top + "px";
			_box.left.style.left = _box.bottom.style.left = _box.top.style.left = (position.left - border_width) + "px";
			_box.top.style.top = position.top - border_width + "px";
			_box.right.style.left = position.left + size.width + "px";
			_box.bottom.style.top = position.top + size.height + "px";
		},
		setText: function(text){
			_box.text.innerHTML = text;
		},
		setVisible: function(visible){
			if (visible != _box.visible) {
				_box.top.style.display =
				_box.bottom.style.display = 
				_box.left.style.display = 
				_box.right.style.display = visible ? "block" : "none";
				_box.visible = visible;
			}
		}
	};
	HTMLElement.prototype.boxElement = function(){
		_box.setPosition(getPos(this), {
			width: this.offsetWidth,
			height: this.offsetHeight
		});
		_box.setText(this.parentNode.tagName + " " + this.tagName);
	};
	_box.top.boxElement = _box.left.boxElement= _box.bottom.boxElement = _box.right.boxElement = _box.text.boxElement = blank_function;
	_box.bottom.style.height = "auto";
	document.body.appendChild(_box.top);
	document.body.appendChild(_box.left);
	document.body.appendChild(_box.bottom);
	document.body.appendChild(_box.right);
	_box.bottom.appendChild(_box.text);
	
	return _box;
};
var GrabController = function(clickAction) {
	var selector = new GrabSelector();
	var box = new GrabBox();
	var classes = 	[styles.highlighted,	styles.selected,		styles.rejected];
	var order =		[null,					selector.selected,		selector.rejected];
	var default_action = HTMLElement.prototype.action = function(el) {selector.select(el)};
	var action = [
		function(el){selector.reject(el);},
		function(el){selector.deselect(el);},
		function(el){selector.dereject(el)}
	];
	var self = this;
	this.form = null;
	this.extractor = null;
	this.header = null;
	var save_page = function() {
		var form  = new $B("form", {
			action: create_page,
			method: "POST",
			children: [
				$B("input",{type:"hidden",name:"url",value: document.location.href}),
				$B("input",{type:"hidden",name:"extractor_id",value: self.extractor.id}),
				$B("input",{type:"hidden",name:"title",value: document.title})
			]
		});
		document.body.appendChild(form);
		Connection.MakeIframeTarget(form,"page",function(){
			form.parentNode.removeChild(form);
			delete form;
		});
		form.submit();
	};
	this.setExtractor = function(extractor){
		this.extractor
		= this.list.extractor
		= this.form.extactor
		= extractor;
		this.header.innerHTML = extractor.name;
		this.form.fields.extractor_id_field.value = extractor.id;
		save_page();
	};
	this.setPathObject = function(obj){
		setSelector(new GrabSelector(obj))
	};
	this.clear = function(){setSelector(new GrabSelector())};
	var setSelector = function(sel) {
		reset_elements();
		selector = sel;
		order =  [queryDocument(selector.result.xpath),selector.selected,selector.rejected];
		color_elements();
	}
	var reset_elements = function(){for(var i=0;i<order.length;i++) if(order[i]) reset_style(order[i]);};
	var color_elements = function(){for(var i=0;i<order.length;i++) if(order[i]) add_style(classes[i],action[i],order[i]);};
	var save_class = function(e){if(!e._className)e._className = e.className?e.className:" ";};
	var reset_style = function(arr){
		for(var i=arr.length-1;i>=0;i--){
			arr[i].className = arr[i]._className;
			delete arr[i].action;
		}
	};
	var add_style = function(className,action,arr) {
		for(var i=arr.length-1;i>=0;i--){
			save_class(arr[i]);
			arr[i].className = arr[i]._className + " " + className;
			arr[i].action = action;
		}
	};
	var in_play = function(el) {
		if(selector.result.tag)	return el.tagName.toLowerCase() == selector.result.tag.toLowerCase();
		else return true;
	};
	var ActionWrapper = function(fun) {
		return function(e) {
			e = e || window.event;
			var el = e.target || e.srcElement;
			if(el.immune) return true;
			block_event(e);
			if(!in_play(el) || el == document.body) return false;
			fun(el);
			return false;
		};
	};
	document.body._onclick = document.body.onclick;
	document.body._onmouseover = document.body.onmouseover;
	document.body._onmouseout = document.body.onmouseout;
	this.close = function() {
		self.clear();
		document.body.onclick = document.body._onclick;
		document.body.onmouseover = document.body._onmouseover;
		document.body.onmouseout = document.body._onmouseout;
	};
	document.body.onclick = new ActionWrapper(function(el){
		var action = el.action;
		reset_elements();
		action(el);
		//console.log(selector.result.obj);
		order[0] = queryDocument(selector.result.xpath);
		color_elements();
		clickAction(selector.result.xpath);
		el.blur();
	});
	document.body.onmouseover = new ActionWrapper(function(el){el.boxElement();});
	document.body.onmouseout = function(e){box.setVisible(false);}
};
			var xpathView = new $B('div',{ 'innerHTML':'', 'className':styles.interface } );
			var display = new GrabWindow([xpathView],'display',function(){console.log('close')}, { 'top':5,'right':5 } );
			var controller = new GrabController(
					function(xpath) {
						xpathView.innerHTML = xpath;
					}
				);

