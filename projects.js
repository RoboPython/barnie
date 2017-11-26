var states = [0,0,0,0,0,0,0,0]
var numberOfTypes = 6
var fightOn = true;

function change(positionNumber){
	states[positionNumber] = Number(document.getElementById("pos"+String(positionNumber)).value);
	setUpOk();
}


function setUpOk(){
	var team1  = states.slice(0,4);
	var team2  = states.slice(4,8);
	
	var blankFound = false;
	var error1 = false;
	for(var i=0;i<team1.length;i++){
		if (blankFound === false){
			if (team1[i] === (0)){
				blankFound = true;
			}
		}else{
			if (team1[i] != (0)){
				error1 = true;
			}
		
		}
	
	}
	var blankFound = false;
	var error2 = false;
	for(var i=0;i<team2.length;i++){
		if (blankFound === false){
			if (team2[i] === (0)){
				blankFound = true;
			}
		}else{
			if (team2[i] != (0)){
				error2 = true;
			}
		
		}
	
	}

	if (error1 || error2 === true){
		document.getElementById("errorMessage").innerHTML = "Incorrect setup, no blanks allowed.";
		fightOn = false;
		document.getElementById("fightButton").disabled = true;


	}else{
		document.getElementById("errorMessage").innerHTML = "Good team composition.";
		fightOn = true;
		document.getElementById("fightButton").disabled = false;

		
	}



	
	
}



function setDamage(team1,team2,team1Given,team2Given){

	//damage recieved
	for(var i=0;i<team1.length;i++){
		var id = "damage" + String(i+1) + "1";
		element = document.getElementById(id).innerHTML = team1[i];
	
	}

	for(var i=0;i<team2.length;i++){
		var id = "damage" + String(i+1) + "2";
		element = document.getElementById(id).innerHTML = team2[i];
	
	}


	//damage given
	for(var i=0;i<team1Given.length;i++){
		var id = "damage" + String(i+1) + "3";
		element = document.getElementById(id).innerHTML = team1Given[i];
	
	}

	for(var i=0;i<team2Given.length;i++){
		var id = "damage" + String(i+1) + "4";
		element = document.getElementById(id).innerHTML = team2Given[i];
	
	}


}

function reset(){
	setDamage([0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]);
	var states = [0,0,0,0,0,0,0,0];
	for(var i = 0;i<8;i++)
	{
		document.getElementById('pos'+ i).selectedIndex = 0;
	}

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
	var cruiserDamageProfile = [[0.25,0],[0.20,1],[0.35,2],[0.20,3]];
	var bombardDamageProfile = [[0.05,1],[0.30,4],[0.25,5],[0.40,0]];
	var carrierDamageProfile = [[0.10,0],[0.25,1],[0.30,2],[0.25,3],[0.05,4],[0.05,5]];
	var noneDamageProfile = [[1.00,0]];
	var carrierPlusDamageProfile = [[0.10,1],[0.25,2],[0.30,3],[0.25,4],[0.05,5],[0.05,6]];
	var cruiserPlusDamageProfile = [[0.25,1],[0.20,2],[0.35,3],[0.20,4]];


	var numberToProfile = {0:noneDamageProfile,1:carrierDamageProfile,2:cruiserDamageProfile,3:bombardDamageProfile,4:carrierPlusDamageProfile,5:cruiserPlusDamageProfile};
	var team1DamageTotal = []; //damage dealt by that team
	var team2DamageTotal = [];





	var team1  = states.slice(0,4);
	for(var i =0;i<team1.length;i++){
		var toAdd = rollForDamage(numberToProfile[team1[i]]);
		team1DamageTotal.push(toAdd);
	}


	var team2  = states.slice(4,8);
	for(var i =0;i<team2.length;i++){
		var toAdd = rollForDamage(numberToProfile[team2[i]]);
		team2DamageTotal.push(toAdd);
		
	}



	return [team1DamageTotal,team2DamageTotal];


}

function dealDamage(damageTotals){
	//find how many ships
	//relies on the fact there are no gaps
	
	team1DamagesDealt = damageTotals[0];
	team2DamagesDealt = damageTotals[1];


	var team1  = states.slice(0,4);
	team1Ships = team1.length;
	for(var i =0;i<team1.length;i++){
		if(team1[i] === 0){
			team1Ships -= 1;
		}
	}
	
	team1DamageTaken = [0,0,0,0];

	for(var j=0;j<team2DamagesDealt.length;j++){
		console.log("now share this damage : " +team2DamagesDealt[j]);
		for (var i=0;i<team2DamagesDealt[j];i++){
			team1DamageTaken[i % team1Ships] +=1
		}
	}

	var team2  = states.slice(4,8);
	team2Ships = team2.length;
	for(var i =0;i<team2.length;i++){
		if(team2[i] === 0){
			team2Ships -= 1;
		}
	}
	
	team2DamageTaken = [0,0,0,0];

	for(var j=0;j<team1DamagesDealt.length;j++){
		console.log("now share this damage : " +team1DamagesDealt[j]);
		for (var i=0;i<team1DamagesDealt[j];i++){
			team2DamageTaken[i % team2Ships] +=1
		}
	}



	setDamage(team1DamageTaken,team2DamageTaken,team1DamagesDealt,team2DamagesDealt);


	

}

function fight(){
	var damageTotals = calcDamage();
	dealDamage(damageTotals);
	document.getElementById("errorMessage").innerHTML = "";


}



function calculating(){
	document.getElementById("errorMessage").innerHTML = "Calculating...";
	setTimeout(fight, 2000);

}


