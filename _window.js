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
