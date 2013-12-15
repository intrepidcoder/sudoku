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
		// console.log(result);
		// 
	}
	return result;
	

}

function decode(input) {
	var result = "";
	var currentCell;
	var str;
	var num;
	var factor;
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];
		
		factor = 1;
		num = parseInt(input.slice(i * 3, i * 3 + 3), 36);
		// num = 35;
		
		
		
		// console.log(num);
		
		
		
		for (var j = 0; j < 9; j++) {
			factor = 2;
			currentCell.pencilmarks[j] = !!(num % factor);
			
			// console.log(num + " " + num % factor);
			
			num = (num / factor) | 0;
			
		}
		
		factor = 10;
		currentCell.setValue(num % factor);
		// console.log(num + " " + currentCell.value + " " + currentCell.candidatesElement.innerHTML);
		num = (num / factor) | 0;
		
		// console.log(num);
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
		// currentCell.value = num % factor;
		// num -= factor * ;
		
		// console.log(num);
		
		
		// Update pencilmarks display.
		currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();
	}

}

// window.onmousewheel = function() {
	// var testStr = "01j00x01j6rk01m01m77k0187pc0136rk01300e7pc04q01b5xs01b08m0bk5jc00m04y4ch02u02s01203d55003500q00r7pc02y06g04q03c4qq7pc77k00o55002w4ch01477k00901t6cg00b0225xs09800e08e5xs0124ch04q04q08c0bw6rk08d08901107s6rk05408d4qq0590a308977k07u55001m08908801l";
	// var testStr = "5jc5xs01s4qq01007809w4ch77k5500764ch08g04w5jc09u08w09u6cg07603k0746rk4ch07a07g5xs5xs77k4qq0940e96cg09009008w7pc4ch6cg55000i01u02877k5jc2tc00c00c77k00g07408l4qq08139c6rk00k00x7pc0065jc00g0034qq00c7pc01t03o5xs05d6cg01t4ch6cg00g01s5jc05e0cy09c550";

	// console.log(encode());
	// decode(testStr);
	
	// console.log(cells[0].pencilmarks);
	
	
// }
