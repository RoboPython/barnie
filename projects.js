var states = [0,0,0,0,0,0,0,0]
var numberOfTypes = 4
var fightOn = true;

function move(direction,positionNumber){
	node = document.getElementById("slot"+String(positionNumber));
	newValue = (states[positionNumber] + direction) % numberOfTypes;
	if (newValue < 0){
		newValue = numberOfTypes + newValue
	}
	states[positionNumber] = newValue;
	node.src = "pic"+String(newValue)+".png"
	setUpOk();
}


function setUpOk(){
	var team1  = states.slice(0,4);
	var team2  = states.slice(4,8);
	console.log(team1);
	
	var blankFound = false;
	var error1 = false;
	for(var i=0;i<team1.length;i++){
		if (blankFound === false){
			if (team1[i] === (numberOfTypes -1)){
				blankFound = true;
			}
		}else{
			if (team1[i] != (numberOfTypes -1)){
				error1 = true;
			}
		
		}
	
	}

	var blankFound = false;
	var error1 = false;
	for(var i=0;i<team1.length;i++){
		if (blankFound === false){
			if (team1[i] === (numberOfTypes -1)){
				blankFound = true;
			}
		}else{
			if (team1[i] != (numberOfTypes -1)){
				error1 = true;
			}
		
		}
	
	}




	var blankFound = false;
	var error2 = false;
	for(var i=0;i<team2.length;i++){
		if (blankFound === false){
			if (team2[i] === (numberOfTypes -1)){
				blankFound = true;
			}
		}else{
			if (team2[i] != (numberOfTypes -1)){
				error2 = true;
			}
		
		}
	
	}

	if (error1 || error2 === true){
		document.getElementById("errorMessage").innerHTML = "Incorrect setup, no blanks allowed.";
		document.getElementById("fightButton").src = "fightDisabled.png";
		fightOn = false;


	}else{
		document.getElementById("errorMessage").innerHTML = "Good team composition.";
		document.getElementById("fightButton").src = "fight.png";
		fightOn = true;

		
	}



	
	
}



function setDamage(team1,team2){
	for(var i=0;i<team1.length;i++){
		var id = "damage" + String(i+1) + "1";
		element = document.getElementById(id).innerHTML = team1[i];
	
	}

	for(var i=0;i<team2.length;i++){
		var id = "damage" + String(i+1) + "2";
		element = document.getElementById(id).innerHTML = team2[i];
	
	}
}

function reset(){
	setDamage([0,0,0,0],[0,0,0,0]);
}

function rollForDamage(damageProfile){
	//cumlative damage profile conversion
	cumulativeDamageProfile = [];
	for(var i =0;i<damageProfile.length;i++){
		totalChance = 0;
		for(var j=0;j<=i;j++){
			totalChance += damageProfile[j][0];
		}
		cumulativeDamageProfile.push([totalChance,damageProfile[i][1]]);
	}
	var randomNumber = Math.random().toFixed(2);
	var damageDone;
	for(var i=0;i<cumulativeDamageProfile.length;i++){
		var min;
		if (i==0){
			min = 0.00;
		}else{
			min = cumulativeDamageProfile[i-1][0];
		}
		var max;
		if (i==cumulativeDamageProfile.length){
			max = 1.00;
		}else{
			max = cumulativeDamageProfile[i][0];
		}
		

		if ( min <= randomNumber && randomNumber <= max){
			damageDone = cumulativeDamageProfile[i][1];
		}

	}
	return damageDone;




}

function calcDamage(){
	var team1DamageTotal = 0; //damage dealt by that team
	var team2DamageTotal = 0;
	var cruiserDamageProfile = [[0.25,0],[0.40,1],[0.25,2],[0.10,3]];
	var bombardDamageProfile = [[0.05,1],[0.10,2],[0.20,3],[0.20,4],[0.10,5],[0.35,0]];
	var carrierDamageProfile = [[0.20,1],[0.25,2],[0.25,3],[0.15,4],[0.05,5],[0.10,0]];
	var noneDamageProfile = [[1.00,0]];
	var numberToProfile = {0:cruiserDamageProfile,1:bombardDamageProfile,2:carrierDamageProfile,3:noneDamageProfile};




	var team1  = states.slice(0,4);
	for(var i =0;i<team1.length;i++){
		var toAdd = rollForDamage(numberToProfile[team1[i]]);
		team1DamageTotal += toAdd;
	}


	var team2  = states.slice(4,8);
	for(var i =0;i<team2.length;i++){
		var toAdd = rollForDamage(numberToProfile[team2[i]]);
		team2DamageTotal += toAdd;
		
	}

	return [team1DamageTotal,team2DamageTotal];


}

function dealDamage(damageTotals){
	//the damages in total damage are those dealt by that team 
	//find how many ships
	//relies on the fact there are no gaps
	var team1  = states.slice(0,4);
	team1Ships = team1.length;
	for(var i =0;i<team1.length;i++){
		if(team1[i] === 3){
			team1Ships -= 1;
		}
	}
	
	team1DamageList = [0,0,0,0];
	for(var i=0;i<damageTotals[1];i++){
		team1DamageList[i%team1Ships] +=1
	}



	


	var team2  = states.slice(4,8);
	team2Ships = team2.length;
	for(var i =0;i<team2.length;i++){
		if(team2[i] === 3){
			team2Ships -= 1;
		}
	}

	team2DamageList = [0,0,0,0];
	for(var i=0;i<damageTotals[0];i++){
		team2DamageList[i%team2Ships] +=1
	}

	setDamage(team1DamageList,team2DamageList);


	

}






function fight(){
	var damageTotals = calcDamage();
	dealDamage(damageTotals);

}

