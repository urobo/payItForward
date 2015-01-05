// summation 3^i
var stop = 7200000000;
var summation = function(end){
	var temp = 0;
	for(i = 0;;i++){
		if (temp < end){
			temp += Math.pow(3,i);
		} else {
			console.log("would require " + i + " steps");
			break;
		}
	}
};
summation(stop);
