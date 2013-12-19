function encode(input) {
	var result = "";
	var currentCell;
	var num;
	var factor;
	var str;
	
	// cells.getColorIndex("red");
	// cells.getColorValue(4);
	// cells.blankCellColor
	// currentCell.element.classList

	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		num = 0;
		factor = 1;
		
		
		for (var j = 0; j < 9; j++) {
			num += factor * (currentCell.pencilmarks[j] ? 1 : 0);
			factor *= 2;
		}
		
		num += factor * currentCell.value;
		factor *= 10;
		
		num += factor * (currentCell.isGiven ? 1 : 0);
		factor *= 2;
		
		str = num.toString(36);
		
		while (str.length < 3) { 
			str = "0" + str;
		}
		
		result += str;
	}
	return result;
	

}

function decode(input) {
	var result = "";
	var currentCell;
	var str;
	var num;
	var factor;
	
	if (input.length !== 243) {
		return;
	}
	
	submitGivens();
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];
		
		factor = 1;
		num = parseInt(input.slice(i * 3, i * 3 + 3), 36);
		
		for (var j = 0; j < 9; j++) {
			factor = 2;
			currentCell.pencilmarks[j] = !!(num % factor);
			
			num = (num / factor) | 0;
			
		}
		
		factor = 10;
		currentCell.setValue(num % factor);
		num = (num / factor) | 0;
		
		factor = 2;
		currentCell.isGiven = !!(num % factor);
		num = (num / factor) | 0;
		
		if (currentCell.isGiven) {
			currentCell.element.innerHTML = currentCell.value;
		} else {
			if (currentCell.value) {
				currentCell.element.firstChild.value = currentCell.value;
			} else {
				currentCell.element.firstChild.value = "";
			
			}
		}
		
		// Update pencilmarks display.
		currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();
	}

}

function loadFromCookie() {
	var values = document.cookie.replace(/(?:(?:^|.*;\s*)state\s*\=\s*((?:[^;](?!;))*[^;]?).*)|.*/, '$1');
	
	if (values) {
		decode(values);
	} else {
		alert("No current save exists.");
	}
}

function saveToCookie() {
	var values = document.cookie.replace(/(?:(?:^|.*;\s*)state\s*\=\s*((?:[^;](?!;))*[^;]?).*)|.*/, '$1');
	
	
	if (values && confirm("A save already exists. Are you sure you want to overwrite it?")) {
		document.cookie = 'state=' + encode() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
	}
	
}
