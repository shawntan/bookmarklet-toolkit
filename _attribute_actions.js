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
