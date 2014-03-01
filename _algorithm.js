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
//		delete c,p,t;
		return result;
	};
};
