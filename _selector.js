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
		xpath: ""
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
