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
