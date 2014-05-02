// encoding.js - Encodes and decodes Sudoku puzzles to store as cookies.
// Copyright (C) 2013 Daniel Moyer

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


// Email: daniel@intrepidcoder.com


function encode(input) {
	var result = "";
	var currentCell;
	var num;
	var factor;
	var str;
	var encodingList = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
	
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
		
		num += factor * currentCell.getColor();
		factor *= 5;
		
		str = encodingList[num / 3844 | 0];
		str += encodingList[(num / 62 | 0) % 62];
		str += encodingList[num % 62];
		
		while (str.length < 3) { 
			str = "0" + str;
		}
		
		result += str;
	}
	
	result += cells.blankCellColor;
	
	return result;
	
}

function decode(input) {
	var result = "";
	var currentCell;
	var str;
	var num;
	var factor;
	var values = "";
	var decodingList = {"0":0, "1":1, "2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "A":10, "B":11, "C":12, "D":13, "E":14, "F":15, "G":16, "H":17, "I":18, "J":19, "K":20, "L":21, "M":22, "N":23, "O":24, "P":25, "Q":26, "R":27, "S":28, "T":29, "U":30, "V":31, "W":32, "X":33, "Y":34, "Z":35, "a":36, "b":37, "c":38, "d":39, "e":40, "f":41, "g":42, "h":43, "i":44, "j":45, "k":46, "l":47, "m":48, "n":49, "o":50, "p":51, "q":52, "r":53, "s":54, "t":55, "u":56, "v":57, "w":58, "x":59, "y":60, "z":61};
	var colorsEncoded = true;
	
	input = input.replace(/[^0-9A-Za-z]/g, "")
	
	if (input.length !== 243 && input.length !== 244) {
		alert("Invalid input.");
		return;
	}
	
	colorsEncoded = input.length === 244;
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];
		
		factor = 1;
		
		if (colorsEncoded) {
			num = decodingList[input.charAt(i * 3)] * 3844;
			num += decodingList[input.charAt(i * 3 + 1)] * 62;
			num += decodingList[input.charAt(i * 3 + 2)];
		} else {
			num = parseInt(input.slice(i * 3, i * 3 + 3), 36);
		}
		
		for (var j = 0; j < 9; j++) {
			factor = 2;
			currentCell.pencilmarks[j] = !!(num % factor);
			
			num = (num / factor) | 0;
			
		}
		
		factor = 10;
		currentCell.setValue(num % factor);
		values += num % factor + "";
		num = (num / factor) | 0;
		
		factor = 2;
		currentCell.isGiven = !!(num % factor);
		num = (num / factor) | 0;
		
		factor = 5;
		currentCell.setColor(num % factor);
		num = (num / factor) | 0;
		
		if (currentCell.isGiven) {
			currentCell.element.innerHTML = currentCell.value;
			currentCell.candidatesElement.innerHTML = currentCell.value;
		} else {
			if (currentCell.value) {
				currentCell.element.firstChild.value = currentCell.value;
				currentCell.candidatesElement.innerHTML = currentCell.value;
			} else {
				// Update pencilmarks display.
				currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();
				currentCell.element.firstChild.value = "";
			
			}
		}
		
	}
	
	cells.blankCellColor = parseInt(input.charAt(243));
	
	// Highlight selected color link.
	document.getElementById("mark_blank_cells_0").classList.remove("mark_blank_cells_selected");
	document.getElementById("mark_blank_cells_" + cells.blankCellColor).classList.add("mark_blank_cells_selected");
	
	
	var puzzle = new Puzzle(values);

	if (!puzzle.hasSolution()) {
		alert("There is no solution for the inputted values.");
		return;
	}

	document.getElementById("directions").style.display = "none";
	document.getElementById("begin_solving_button").style.display = "none";
	document.getElementById("controls").style.display = "block";
	document.getElementById("side_bar").style.display = "none";
	
	document.getElementById("import_save_button").title = "This option is disabled when a sudoku puzzle is in progress.";
	document.getElementById("import_save_button").disabled = true;
	document.getElementById("paste_puzzle_button").title = "This option is disabled when a sudoku puzzle is in progress.";
	document.getElementById("paste_puzzle_button").disabled = true;
	document.getElementById("load_cookie").title = "This option is disabled when a sudoku puzzle is in progress.";
	document.getElementById("load_cookie").disabled = true;
	
	cells.solution = puzzle.toString();
	for (var i = 0; i < 81; i++) {
		cells[i].solution = parseInt(cells.solution.charAt(i));
	}
	
	showDuplicates();
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
	
	
	if (values) {
		if(!confirm("A save already exists. Are you sure you want to overwrite it?")) {
			return false;
		}		
	}
	
	document.cookie = 'state=' + encode() + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
	
	if (document.cookie) {
		alert("Save successful.");
	} else {
		alert("Save failed. Make sure cookies are enabled in your browser.");
	}
}
