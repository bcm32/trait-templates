/**
 *	Generates the html for each set of trait options. The trait line is given an id of line1/line2/etc and 
 *	each option is given a class of adeptTrait/masterTrait/grandMasterTrait
 */
function initTraits() {
	$('#traitTable').empty();

	//add in appropriate build ids
	var html = '';

	var lineNames;
	//init specific trait data per class
	switch(window.className) {
		case 'WARRIOR':
			lineNames = ["Strength","Arms","Defence","Tactics","Discipline"];
			break;
		case 'GUARDIAN':
			lineNames = ["Zeal","Radiance","Valor","Honor","Virtues"];
			break;
		case 'ENGINEER':
			lineNames = ["Explosives","Firearms","Inventions","Alchemy","Tools"];
			break;
		case 'RANGER':
			lineNames = ["Marksmanship","Skirmishing","Wilderness Survival","Nature Magic","Beast Mastery"];
			break;
		case 'THIEF':
			lineNames = ["Deadly Arts","Critical Strikes","Shadow Arts","Acrobatics","Trickery"];
			break;
		case 'ELEMENTALIST':
			lineNames = ["Fire Magic","Air Magic","Earth Magic","Water Magic","Arcana"];
			break;
		case 'NECROMANCER':
			lineNames = ["Spite","Curses","Death Magic","Blood Magic","Soul Reaping"];
			break;
		case 'MESMER':
			lineNames = ["Domination","Dueling","Chaos","Inspiration","Illusions"];
			break;
		default:
	}

	//Get build data
		$('#buildName').val(window.currentBuild.buildName);
		$('#gameMode').val(window.currentBuild.gameMode);
		
	for(var i = 0; i < 5; i++) {
		var trueNum = i+1;
		//Set some data based on line
		var traitValue = 0
		if(i===0) {
			traitValue = window.currentBuild.traits.line1.total;
			if(!traitValue) {
				traitValue = 0;
				window.currentBuild.traits.line1.total = 0;
			}
		} else if (i===1) {
			traitValue = window.currentBuild.traits.line2.total;
			if(!traitValue) {
				traitValue = 0;
				window.currentBuild.traits.line2.total = 0;
			}
		} else if (i===2) {
			traitValue = window.currentBuild.traits.line3.total;
			if(!traitValue) {
				traitValue = 0;
				window.currentBuild.traits.line3.total = 0;
			}
		} else if (i===3) {
			traitValue = window.currentBuild.traits.line4.total;
			if(!traitValue) {
				traitValue = 0;
				window.currentBuild.traits.line4.total = 0;
			}
		} else if (i===4) {
			traitValue = window.currentBuild.traits.line5.total;
			if(!traitValue) {
				traitValue = 0;
				window.currentBuild.traits.line5.total = 0;
			}
		}
		var subtractionClass = "lightBtn";
		var additionClass = 'lightBtn';


		//Determine active buttons on load
		if(getTotalPoints() >= 14) {
			additionClass = 'inactiveButton';
		} else {
			if(traitValue === 0) {
				subtractionClass = "inactiveButton";
			} else if(traitValue === 6) {
				additionClass = "inactiveButton";
			}
		}
		 
		//Top Row spacing shenanigans
		html += '<tr id="traitLine'+ trueNum +'"><td class="emphasis">' + lineNames[i] + '</td>'
			+ '<td rowspan="2"><span class="traitTotal">' + traitValue + '</span></td>'
			+ '<td class="tinyText">' 
        	+ getLineBonus(i, 1) + '</td>';
		//Complete trait line
        html += '<td rowspan="2">' + getMinorSymbol(traitValue, 1) + '</td><td rowspan="2">' + generateTraitOptions(i, 0) + '</td><td rowspan="2">' 
        	+ getMinorSymbol(traitValue, 2) + '</td><td rowspan="2">' + generateTraitOptions(i, 1) + '</td><td rowspan="2">' 
        	+ getMinorSymbol(traitValue, 3) + '</td><td rowspan="2">' + generateTraitOptions(i, 2) + '</td></tr>';
        //Bottom Row
        html += '<tr id="traitOperationLine'+ trueNum +'"><td>' + '<button class="' + subtractionClass + ' traitOperation traitSubtraction" onClick="removePoint(' + i +')">-</button>'
        	+ '<button class="'+ additionClass + ' traitOperation traitAddition" onClick="addPoint(' + i +')">+</button>' 
        	+ '</td><td class="tinyText">' 
        	+ getLineBonus(i, 2) + '</td></tr>';
    }
    $('#traitTable').append(html);

    //Appended: update selected values - 
    updateTraitSelections();
}

/**
 *	Generates the html for each set of trait options. The option is given a class of adeptTrait/masterTrait/grandMasterTrait
 */
function generateTraitOptions(traitLine, traitLevel) {
	var traitOptions = '';
	var traitHtmlClass = '';
	switch(traitLevel){	
		case 0:
			traitHtmlClass = 'class="adeptTrait inputSelection"';
			break;
		case 1:
			traitHtmlClass = 'class="masterTrait inputSelection"';
			break;
		case 2:
			traitHtmlClass = 'class="grandMasterTrait inputSelection"';
			break;
		default:
	}

	traitOptions += '<select ' + traitHtmlClass + '>'
		+'<option value="0" selected="selected"> </option>'
		+'<option value=1>I</option>'
		+'<option value=2>II</option>'
		+'<option value=3>III</option>'
		+'<option value=4>IV</option>'
		+'<option value=5>V</option>'
		+'<option value=6>VI</option>';
  	if(traitLevel>0) {
  		traitOptions += '<option value=7>VII</option>'
  			+'<option value=8>VIII</option>'
  			+'<option value=9>IX</option>'
  			+'<option value=10>X</option>';
  	}
  	if(traitLevel>1) {
  		traitOptions += '<option value=11>XI</option>'
  			+'<option value=12>XII</option>'
  			+'<option value=13>XIII</option>';
  	}
	traitOptions +='</select>';
	return traitOptions;
}

/**
 * Returns the generated icon for locked traits modifiable if locked
 */
function getMinorSymbol(allocatedPoints, minorTraitNumber) {
	var activeIcon = "fa fa-dot-circle-o";
	var inactiveIcon = "fa fa-circle-o";
	var inactiveHexOverride = " hb-inactiveOverride";
	var usedIcon = inactiveIcon;	//Default inactive
	
	var pointsRequired = (minorTraitNumber*2)-1;	//The amount of allocated points required to make active
	if(allocatedPoints >= pointsRequired){
		usedIcon = activeIcon;
		inactiveHexOverride = "";	//clear inactive override
	} 

	return '<span class="hb hb-xxs' + inactiveHexOverride + '"><i class="'+ usedIcon+ '"></i></span>';
}

/**
 * Returns the line bonus image and a modifiable field for bonus
 */
function getLineBonus(lineNumber, bonusNumber) {
	var iconPath = '';
	switch(window.className) {
		case 'WARRIOR':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Condition Damage";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Healing Power";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Boon Duration";
				case 4:
					if(bonusNumber===1) return "Ferocity";
					return "Burst Recharge";
			}
		case 'GUARDIAN':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Condition Damage";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Ferocity";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Healing Power";
				case 4:
					if(bonusNumber===1) return "Boon Duration";
					return "Virtue Recharge";
			}
		case 'ENGINEER':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Condition Damage";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Healing Power";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Boon Duration";
				case 4:
					if(bonusNumber===1) return "Ferocity";
					return "Tool Belt Recharge";
			}
		case 'RANGER':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Ferocity";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Condition Damage";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Boon Duration";
				case 3:
					if(bonusNumber===1) return "Healing Power";
					return "Pet Attribute Bonus";
			}
		case 'THIEF':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Ferocity";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Healing Power";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Boon Duration";
				case 4:
					if(bonusNumber===1) return "Condition Damage";
					return "Steal Recharge";
			}
		case 'ELEMENTALIST':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Ferocity";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Condition Damage";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Healing Power";
				case 4:
					if(bonusNumber===1) return "Boon Duration";
					return "Attunement Recharge";

			}
		case 'NECROMANCER':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Condition Damage";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Boon Duration";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Healing Power";
				case 4:
					if(bonusNumber===1) return "Ferocity";
					return "Life Force Pool";
			}
		case 'MESMER':
			switch(lineNumber) {
				case 0:
					if(bonusNumber===1) return "Power";
					return "Condition Duration";
				case 1:
					if(bonusNumber===1) return "Precision";
					return "Ferocity";
				case 2:
					if(bonusNumber===1) return "Toughness";
					return "Boon Duration";
				case 3:
					if(bonusNumber===1) return "Vitality";
					return "Healing Power";
				case 4:
					if(bonusNumber===1) return "Condition Damage";
					return "Shatter Recharge";

			}
		default:
			if(bonusNumber===1) return "Bonus 1";
			return "Bonus 2";
	}
	return iconPath;
}

function updateTraitSelections() {
	if(currentBuild.traits.line1.adept) $("#traitLine1").find('.adeptTrait').val(currentBuild.traits.line1.adept);
	if(currentBuild.traits.line1.master) $("#traitLine1").find('.masterTrait').val(currentBuild.traits.line1.master);
	if(currentBuild.traits.line1.grandmaster) $("#traitLine1").find('.grandMasterTrait').val(currentBuild.traits.line1.grandmaster);

	if(currentBuild.traits.line2.adept) $("#traitLine2").find('.adeptTrait').val(currentBuild.traits.line2.adept);
	if(currentBuild.traits.line2.master) $("#traitLine2").find('.masterTrait').val(currentBuild.traits.line2.master);
	if(currentBuild.traits.line2.grandmaster) $("#traitLine2").find('.grandMasterTrait').val(currentBuild.traits.line2.grandmaster);

	if(currentBuild.traits.line3.adept) $("#traitLine3").find('.adeptTrait').val(currentBuild.traits.line3.adept);
	if(currentBuild.traits.line3.master) $("#traitLine3").find('.masterTrait').val(currentBuild.traits.line3.master);
	if(currentBuild.traits.line3.grandmaster) $("#traitLine3").find('.grandMasterTrait').val(currentBuild.traits.line3.grandmaster);

	if(currentBuild.traits.line4.adept) $("#traitLine4").find('.adeptTrait').val(currentBuild.traits.line4.adept);
	if(currentBuild.traits.line4.master) $("#traitLine4").find('.masterTrait').val(currentBuild.traits.line4.master);
	if(currentBuild.traits.line4.grandmaster) $("#traitLine4").find('.grandMasterTrait').val(currentBuild.traits.line4.grandmaster);

	if(currentBuild.traits.line5.adept) $("#traitLine5").find('.adeptTrait').val(currentBuild.traits.line5.adept);
	if(currentBuild.traits.line5.master) $("#traitLine5").find('.masterTrait').val(currentBuild.traits.line5.master);
	if(currentBuild.traits.line5.grandmaster) $("#traitLine5").find('.grandMasterTrait').val(currentBuild.traits.line5.grandmaster);
}

/**
 * Add points to a line
 */
function addPoint(i){
	var currentTotal = getTotalPoints();
	if(currentTotal>=14) return;
	currentTotal ++;
	var traitLineNum = i+1;
	var traitLineName = "#traitLine" + traitLineNum;
	var traitOperationLine = "#traitOperationLine" + traitLineNum;
	switch(i){
		case 0:
			if(window.currentBuild.traits.line1.total < 6) {
				window.currentBuild.traits.line1.total++;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line1.total);

				//Set operable/inoperable fields
				if(window.currentBuild.traits.line1.total === 1) {
					//trait line 0 ->, set operable
					$(traitOperationLine).find('.traitSubtraction').addClass("lightBtn");
					$(traitOperationLine).find('.traitSubtraction').removeClass("inactiveButton");
				} else if(window.currentBuild.traits.line1.total === 6) {
					//Trait line maxed, set addition inoberable
					$(traitOperationLine).find('.traitAddition').addClass("inactiveButton");
					$(traitOperationLine).find('.traitAddition').removeClass("lightBtn");
				}
				//TODO: Add operable traits
			} else return;
			break;
		case 1:
			if(window.currentBuild.traits.line2.total < 6) {
				window.currentBuild.traits.line2.total++;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line2.total);

				//Set operable/inoperable fields
				if(window.currentBuild.traits.line2.total === 1) {
					//trait line 0 ->, set operable
					$(traitOperationLine).find('.traitSubtraction').addClass("lightBtn");
					$(traitOperationLine).find('.traitSubtraction').removeClass("inactiveButton");
				} else if(window.currentBuild.traits.line2.total === 6) {
					//Trait line maxed, set addition inoberable
					$(traitOperationLine).find('.traitAddition').addClass("inactiveButton");
					$(traitOperationLine).find('.traitAddition').removeClass("lightBtn");
				}
			} else return;
			break;
		case 2:
			if(window.currentBuild.traits.line3.total < 6) {
				window.currentBuild.traits.line3.total++;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line3.total);

				//Set operable/inoperable fields
				if(window.currentBuild.traits.line3.total === 1) {
					//trait line 0 ->, set operable
					$(traitOperationLine).find('.traitSubtraction').addClass("lightBtn");
					$(traitOperationLine).find('.traitSubtraction').removeClass("inactiveButton");
				} else if(window.currentBuild.traits.line3.total === 6) {
					//Trait line maxed, set addition inoberable
					$(traitOperationLine).find('.traitAddition').addClass("inactiveButton");
					$(traitOperationLine).find('.traitAddition').removeClass("lightBtn");
				}
			} else return;
			break;
		case 3:
			if(window.currentBuild.traits.line4.total < 6) {
				window.currentBuild.traits.line4.total++;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line4.total);

				//Set operable/inoperable fields
				if(window.currentBuild.traits.line4.total === 1) {
					//trait line 0 ->, set operable
					$(traitOperationLine).find('.traitSubtraction').addClass("lightBtn");
					$(traitOperationLine).find('.traitSubtraction').removeClass("inactiveButton");
				} else if(window.currentBuild.traits.line4.total === 6) {
					//Trait line maxed, set addition inoberable
					$(traitOperationLine).find('.traitAddition').addClass("inactiveButton");
					$(traitOperationLine).find('.traitAddition').removeClass("lightBtn");
				}
			} else return;
			break;
		case 4:
			if(window.currentBuild.traits.line5.total < 6) {
				window.currentBuild.traits.line5.total++;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line5.total);

				//Set operable/inoperable fields
				if(window.currentBuild.traits.line5.total === 1) {
					//trait line 0 ->, set operable
					$(traitOperationLine).find('.traitSubtraction').addClass("lightBtn");
					$(traitOperationLine).find('.traitSubtraction').removeClass("inactiveButton");
				} else if(window.currentBuild.traits.line5.total === 6) {
					//Trait line maxed, set addition inoberable
					$(traitOperationLine).find('.traitAddition').addClass("inactiveButton");
					$(traitOperationLine).find('.traitAddition').removeClass("lightBtn");
				}
			} else return;
			break;
		default:
			return;
	}

	//Deal with min/max total conditions
	

	if(currentTotal === 14) {
		//Adding a trait maxes allocated points
		$(".traitAddition").addClass("inactiveButton");
		$(".traitAddition").removeClass("lightBtn");
	}
}

 /**
 *	Remove points from a line 
 */

function removePoint(i){
	var currentTotal = getTotalPoints();
	if(currentTotal===0) return;
	currentTotal--;
	var traitLineNum = i+1;
	var traitLineName = "#traitLine" + traitLineNum;
	var traitOperationLine = "#traitOperationLine" + traitLineNum;
	switch(i){
		case 0:
			if(window.currentBuild.traits.line1.total > 0) {
				window.currentBuild.traits.line1.total--;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line1.total);

				//Set operable/inoperable fields
				if(window.currentBuild.traits.line1.total === 0) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitSubtraction').addClass("inactiveButton");
					$(traitOperationLine).find('.traitSubtraction').removeClass("lightBtn");
				} else if(window.currentBuild.traits.line1.total < 6) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitAddition').addClass("lightBtn");
					$(traitOperationLine).find('.traitAddition').removeClass("inactiveButton");
				}
			} else return;
			break;
		case 1:
			if(window.currentBuild.traits.line2.total > 0) {
				window.currentBuild.traits.line2.total--;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line2.total);
				//Set operable/inoperable fields
				if(window.currentBuild.traits.line2.total === 0) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitSubtraction').addClass("inactiveButton");
					$(traitOperationLine).find('.traitSubtraction').removeClass("lightBtn");
				} else if(window.currentBuild.traits.line2.total < 6) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitAddition').addClass("lightBtn");
					$(traitOperationLine).find('.traitAddition').removeClass("inactiveButton");
				}
			} else return;
			break;
		case 2:
			if(window.currentBuild.traits.line3.total > 0) {
				window.currentBuild.traits.line3.total--;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line3.total);
				//Set operable/inoperable fields
				if(window.currentBuild.traits.line3.total === 0) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitSubtraction').addClass("inactiveButton");
					$(traitOperationLine).find('.traitSubtraction').removeClass("lightBtn");
				} else if(window.currentBuild.traits.line3.total < 6) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitAddition').addClass("lightBtn");
					$(traitOperationLine).find('.traitAddition').removeClass("inactiveButton");
				}
			} else return;
			break;
		case 3:
			if(window.currentBuild.traits.line4.total > 0) {
				window.currentBuild.traits.line4.total--;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line4.total);
				//Set operable/inoperable fields
				if(window.currentBuild.traits.line4.total === 0) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitSubtraction').addClass("inactiveButton");
					$(traitOperationLine).find('.traitSubtraction').removeClass("lightBtn");
				} else if(window.currentBuild.traits.line4.total < 6) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitAddition').addClass("lightBtn");
					$(traitOperationLine).find('.traitAddition').removeClass("inactiveButton");
				}
			} else return;
			break;
		case 4:
			if(window.currentBuild.traits.line5.total > 0) {
				window.currentBuild.traits.line5.total--;
				//set field
				var traitLine = "#traitLine" + i;
				$(traitLineName).find('.traitTotal').text(window.currentBuild.traits.line5.total);
				//Set operable/inoperable fields
				if(window.currentBuild.traits.line5.total === 0) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitSubtraction').addClass("inactiveButton");
					$(traitOperationLine).find('.traitSubtraction').removeClass("lightBtn");
				} else if(window.currentBuild.traits.line5.total < 6) {
					//Trait line 0, set subtraction inoberable
					$(traitOperationLine).find('.traitAddition').addClass("lightBtn");
					$(traitOperationLine).find('.traitAddition').removeClass("inactiveButton");
				}
			} else return;
			break;
		default:
			return;
	}

	if(currentTotal === 0) {
		//All subtraction now inactive
		$(".traitSubtraction").removeClass("lightBtn");
		$(".traitSubtraction").addClass("inactiveButton");
	} else if(currentTotal === 13) {
		//Addition buttons active again after being maxed
		$(".traitAddition").addClass("lightBtn");
		$(".traitAddition").removeClass("inactiveButton");
	}
}


/**
 *	Returns the current number of points spend in the build
 **/
function getTotalPoints() {
	var totalPoints = window.currentBuild.traits.line1.total
		+ window.currentBuild.traits.line2.total
		+ window.currentBuild.traits.line3.total
		+ window.currentBuild.traits.line4.total
		+ window.currentBuild.traits.line5.total;

		return totalPoints;

}












function saveBuild(){
	//Save build name
	window.currentBuild.buildName = $("#buildName").val();
	window.currentBuild.gameMode = $("#gameMode").val();

	//Scrape together traitLines
	window.currentBuild.traits.line1.adept = $("#traitLine1").find('.adeptTrait').val();
	window.currentBuild.traits.line1.master = $("#traitLine1").find('.masterTrait').val();
	window.currentBuild.traits.line1.grandmaster = $("#traitLine1").find('.grandMasterTrait').val();

	window.currentBuild.traits.line2.adept = $("#traitLine2").find('.adeptTrait').val();
	window.currentBuild.traits.line2.master = $("#traitLine2").find('.masterTrait').val();
	window.currentBuild.traits.line2.grandmaster = $("#traitLine2").find('.grandMasterTrait').val();

	window.currentBuild.traits.line3.adept = $("#traitLine3").find('.adeptTrait').val();
	window.currentBuild.traits.line3.master = $("#traitLine3").find('.masterTrait').val();
	window.currentBuild.traits.line3.grandmaster = $("#traitLine3").find('.grandMasterTrait').val();

	window.currentBuild.traits.line4.adept = $("#traitLine4").find('.adeptTrait').val();
	window.currentBuild.traits.line4.master = $("#traitLine4").find('.masterTrait').val();
	window.currentBuild.traits.line4.grandmaster = $("#traitLine4").find('.grandMasterTrait').val();

	window.currentBuild.traits.line5.adept = $("#traitLine5").find('.adeptTrait').val();
	window.currentBuild.traits.line5.master = $("#traitLine5").find('.masterTrait').val();
	window.currentBuild.traits.line5.grandmaster = $("#traitLine5").find('.grandMasterTrait').val();

	saveAllTraits(window.currentBuild);
}

