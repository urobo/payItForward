function Person(id){
	this._id = id;
	this.receivedFrom = [];
	this.givenTo = [];
	this.getInfo = function(){
		return this._id + "  given : " + this.givenTo +"  received : " + this.receivedFrom;
	};
	this.connected = [];
	this.isFriend = function (id) {
		for (i = 0; i < this.connected.length; i++){
			if (this.connected[i] === id){
				return true;
			} 
		}
		return false;
	};
	this.reached = false;
	this.explored = false;
	this.done = false;
	this.level = 0;
};

var population = [];
var connectionFactor = 50;
var maxPopulation = 100000;

//generate population
for(i = 0; i<maxPopulation; i++){
	population[i] = new Person(i);
	//console.log(population[i].getInfo());
}

//connection
for (i = 0; i<maxPopulation; i++){
	var temp = population[i];
	while(temp.connected.length < connectionFactor){
		var newFriendId = Math.floor((Math.random() * maxPopulation));
		if (!temp.isFriend(newFriendId) && population[newFriendId].connected.length < connectionFactor && temp._id !== newFriendId){
			temp.connected.push(newFriendId);
			population[newFriendId].connected.push(temp._id);
		}
	}
	//console.log(temp.getInfo() + "  connectedTo : " + temp.connected.length);
}

var connectionPool = [population[0]];
var networks = [population[0]];
var checkExplored = 0;

var checkConnection = function(){
	while(connectionPool.length > 0){
		var current = connectionPool.pop();
		
		for (i = 0; i < current.connected.length; i++){
			var tmp = population[current.connected[i]];
			if (tmp.reached === false){
				tmp.reached = true;
				connectionPool.push(tmp);
			}
		}
		current.explored = true;
	}
	
	for  (j = 0; j < population.length; j++){
		if (population[j].explored === true){
			checkExplored++;
		} else {
			networks.push(population[j]);
			population[j].reached = true;
			connectionPool.push(population[j]);
			checkConnection();
		}
	}
};

var connectionInfo = function(){
	console.log('explored nodes ; ' + checkExplored);
	console.log('networks found : ' + networks.length);
};

checkConnection();
connectionInfo();

//pay it forrward
var favors = 3;

var extracted = [];

var extractElement = function(range){
	return Math.floor((Math.random() * range));
};

var isAlreadyExtracted = function(element){
	for (i = 0; i < extracted.length; i++){
		if (extracted[i] === element){
			return true;
		}
	}
	return false;
};

var startLottery = function(connectedList){
	extracted = [];
	var i = 0;
	//console.log('starting lottery');
	while(i < favors){
		var number = extractElement(connectedList.length);
		if (!isAlreadyExtracted(connectedList[number])){
			extracted.push(connectedList[number]);
			i++;
		}
	}
	return extracted;
};

var maxLevel = 0;
var receivers = [];
var networksIterator = 0;
var pool = [networks[0]._id];

var payItForward = function(){
	while(pool.length > 0 && receivers.length < maxPopulation){
		var current = population[pool.pop()];
		//console.log("==============================================");
		//console.log(current._id + " started is round of favors");
		var lottery = startLottery(current.connected);
		current.givenTo.push(lottery);
		//console.log(current._id + " gave is favors to : " + lottery);
		for (i = 0; i < lottery.length; i++){
			var tmp = population[lottery[i]];
			tmp.level = current.level+1;
			
			if (tmp.level > maxLevel){
				maxLevel = tmp.level;
			}
			
			tmp.receivedFrom.push(current._id);
			if (tmp.receivedFrom.length === 1){
				receivers.push(tmp._id);
				//console.log(tmp._id + " has received is first favor");
				//console.log( (maxPopulation - receivers.length) + " people to go");
			}
			pool.push(tmp._id);
		}
		//console.log("==============================================");
	}
	networksIterator++;
	if(networksIterator < networks.length){	
		pool = networks[networksIterator]._id;
		payItForward();
	}
};

payItForward();
console.log('it required ' + maxLevel + ' steps for every person to received a favor');
var doubleCheckFavors = 0;
for (i = 0; i < maxPopulation; i++){
	if (population[i].receivedFrom.length > 0){
		doubleCheckFavors++;
	}
}
console.log("checking results consistency : " + doubleCheckFavors + " out of " + maxPopulation + " received at least a favor");