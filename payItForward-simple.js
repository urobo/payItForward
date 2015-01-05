// sommatoria 3 alla i
var stop = 6500000000;
var sommatoria = function(end){
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
sommatoria(stop);