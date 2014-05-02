// sudoku.js - Provides Sudoku solving tools.
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


var cells = [];

function inputOnKeyDown(e) {
	var code = e.keyCode;
	var pos;

	switch (code) {
		case 9: // tab
		case 27: // escape
		case 33: // page up
		case 34: // page down
			return true;
		break;

		case 37: // left
			pos = this.index;
			
			do {
				if (pos === 0) {
					pos = 80;
				} else {
					pos--;
				}
			} while (cells[pos].isGiven);

			document.getElementById("cell" + pos + "_input").focus();
		break;

		case 38: // up
			pos = this.index;
			
			do {
				if (pos < 9) {
					pos += 72;
				} else {
					pos -= 9;
				}
			} while (cells[pos].isGiven);

			document.getElementById("cell" + pos + "_input").focus();
		break;

		case 39: // right
			pos = this.index;
			
			do {
				if (pos === 80) {
					pos = 0;
				} else {
					pos++;
				}
			} while (cells[pos].isGiven);

			document.getElementById("cell" + pos + "_input").focus();
		break;

		case 13: // enter
		case 40: // down
			pos = this.index;
			
			do {
				if (pos > 71) {
					pos -= 72;
				} else {
					pos += 9;
				}
			} while (cells[pos].isGiven);

			document.getElementById("cell" + pos + "_input").focus();
		break;

		default:

			// function keys
			if (code >= 112 && code <= 123) {
				return true;
			} else if (document.getElementById("enter_values").classList.contains("enter_controls_selected")) {

				// backspace || delete
				if (code === 8 || code === 46) {
					var currentCell = cells[this.index];

					this.value = "";
					currentCell.setValue(0);
					currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();
					showDuplicates();
					
					// Before givens are submitted, automatically update pencilmarks.
					if (!cells.hasOwnProperty("solution")) {
						// updatePencilmarks();
					} 
				}

				// 0-9 || numpad 0-9
				else if ((code > 48 && code <= 57) || (code > 96 && code <= 105)) {
					var digit = code - 48;

					if (digit > 9) digit = code - 96; // Fix offset for numpad.

					this.value = digit;
					var currentCell = cells[this.index];
					currentCell.setValue(digit);
					showDuplicates();

					// Before givens are submitted, automatically update pencilmarks.
					if (!cells.hasOwnProperty("solution")) {
						// updatePencilmarks();
					} else if (document.getElementById("auto_pencilmarks").classList.contains("auto_pencilmarks_selected")) {
						for (var i = 0; i < 20; i++) {
							if (currentCell.neighbors[i].value === 0) {

								currentCell.neighbors[i].pencilmarks[currentCell.value - 1] = false;
								currentCell.neighbors[i].candidatesElement.innerHTML = currentCell.neighbors[i].getPencilmarkString();
							}
						}
					}
					currentCell.candidatesElement.innerHTML = currentCell.value;
				}
			} else {
				
				// Pencil marks: 0-9 || numpad 0-9
				if ((code > 48 && code <= 57) || (code > 96 && code <= 105)) {
					var digit = code - 48;

					if (digit > 9) digit = code - 96; // Fix offset for numpad.

					var currentCell = cells[this.index];

					if (currentCell.value === 0) {
						currentCell.pencilmarks[digit - 1] = !currentCell.pencilmarks[digit - 1];

						currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();
					}
				}
			}
		break;
	}

	return false;
}

function inputOnFocus() {
	cells.lastSelectedCell = this.index;
}

function updatePencilmarks() {
	var currentCell;

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Update Pencilmarks');
	}
	
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		if (currentCell.value === 0) {
			currentCell.pencilmarks = [true, true, true, true, true, true, true, true, true];

			for (var k = 0; k < 20; k++) {
				currentCell.pencilmarks[currentCell.neighbors[k].value - 1] = false;
			}

		} else {
			currentCell.pencilmarks = [false, false, false, false, false, false, false, false, false];
			currentCell.pencilmarks[currentCell.value - 1] = true;
		}
		currentCell.candidatesElement.innerHTML = currentCell.pencilmarks.map(function(value, index){if(value)return index + 1;}).join("");
	}
}

function clearPencilmarks() {
	var currentCell;

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Reset Pencilmarks');
	}
	
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];
		currentCell.pencilmarks = [true, true, true, true, true, true, true, true, true];

		if (currentCell.value === 0) {
			currentCell.candidatesElement.innerHTML = "123456789";

		} else {
			currentCell.candidatesElement.innerHTML = currentCell.value + "";
		}

	}
}

function showDuplicates() {
	var currentCell;

	if (document.getElementById("show_duplicates").classList.contains("show_duplicates_selected")) {

		for (var i = 0; i < 81; i++) {
			currentCell = cells[i];
			currentCell.element.classList.remove("cell_duplicate");

			if (currentCell.value !== 0) {
				for (var k = 0; k < 20; k++) {
					if (currentCell.value === currentCell.neighbors[k].value) {
						currentCell.element.classList.add("cell_duplicate");
					}
				}

			}
		}
	} else {
		for (var i = 0; i < 81; i++) {
			cells[i].element.classList.remove("cell_duplicate");
		}
	}
}

function clearCells() {
	if (!window.confirm("Are you sure you want to clear this sudoku puzzle?")) return;
	window.location.reload();
}

function pastePuzzle() {
	var values = document.getElementById("paste_puzzle").value;
	
	values = values.replace(/[.*_]/g, "0");
	values = values.replace(/[^0-9]/g, "");
	
	if (values.length !== 81) {
		window.alert("Invalid input");
		return;
	}

	
	for (var i = 0; i < 81; i++) {
		var currentCell = cells[i];

		if (currentCell.element.children.length > 0) {
			currentCell.setValue(parseInt(values.charAt(i)));

			if (currentCell.value !== 0) {
				currentCell.element.firstChild.value = currentCell.value;
			} else {
				currentCell.element.firstChild.value = "";
			}
		}
	}
	
	clearPencilmarks();
	highlight(0);
	showDuplicates();
}

function savePuzzle() {
	window.prompt("Copy the text string below and paste it into a new text file.\nTo re-load the puzzle, paste the string into the paste puzzle tool.", encode());

}

function saveLoadPuzzle() {
	document.getElementById("side_bar").style.display="block";
	
	document.getElementById("copy_puzzle").value = cells.toString().replace(/[^0-9]/g, "");
	document.getElementById("export_save").value = encode();
}

function highlight(value) {
	
	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Highlight ' + value);
	}
	
	
	if (typeof value !== "number" && value !== 0) {
		value = parseInt(this.number);
	}
	
	if (value === 0) {
		for (var i = 0; i < 81; i++) {
			cells[i].element.classList.remove("cell_highlighted");
			cells[i].candidatesElement.classList.remove("candidates_highlighted");

		}
	} else {
		for (var i = 0; i < 81; i++) {
			var currentCell = cells[i];

			if (currentCell.value !== 0 || !currentCell.pencilmarks[value - 1]) {
				currentCell.candidatesElement.classList.add("candidates_highlighted");
				currentCell.element.classList.add("cell_highlighted");
			} else {
				currentCell.candidatesElement.classList.remove("candidates_highlighted");
				currentCell.element.classList.remove("cell_highlighted");
			}

		}
	}
}

function submitGivens() {
	var currentCell;
	var values = "";

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Begin Solving');
	}
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];
		values += currentCell.value;
	}

	var solution = "";
	
	if (document.getElementById("solution")) {
		solution = document.getElementById("solution").value;
	}
	
	if (solution.length !== 81 || /[^0-9]/.test(solution)) {
		var puzzle = new Puzzle(values);
		
		if (!puzzle.hasSolution()) {
			alert("There is no solution for the inputted values.");
			return;
		}
		
		cells.solution = puzzle.toString();
	} else {
		cells.solution = solution;
		document.body.removeChild(document.getElementById("solution_wrapper"));
	}

	document.getElementById("directions").style.display = "none";
	document.getElementById("begin_solving_button").style.display = "none";
	document.getElementById("side_bar").style.display = "none";
	document.getElementById("controls").style.display = "block";
	
	document.getElementById("import_save_button").title = "This option is disabled when a sudoku puzzle is in progress.";
	document.getElementById("import_save_button").disabled = true;
	document.getElementById("paste_puzzle_button").title = "This option is disabled when a sudoku puzzle is in progress.";
	document.getElementById("paste_puzzle_button").disabled = true;
	document.getElementById("load_cookie").title = "This option is disabled when a sudoku puzzle is in progress.";
	document.getElementById("load_cookie").disabled = true;
		
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		if (currentCell.value !== 0) {
			currentCell.element.innerHTML = currentCell.value;
			currentCell.isGiven = true;
		} else {
			currentCell.element.classList.add("blank_cell_highlight_black");
		}

		currentCell.solution = parseInt(cells.solution[i]);
	}

	document.getElementById("controls").appendChild(document.getElementById("options"));
	
	
	bindEventListener(window, "beforeunload", function(e) {
		e.returnValue = "You have unsaved changes.";
	});
}

function showSolution() {
	var currentElement;
	var row;
	var solution = "";

	if (cells.solution === undefined || !window.confirm("Are you sure you want to show the solution?")) {
		return;
	}

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Show Solution');
	}
	
	for (var i = 0; i < 9; i++) {
		row = i * 9;
		solution += cells.solution.charAt(row) + " " + cells.solution.charAt(row + 1) + " " + cells.solution.charAt(row + 2) + " | ";
		solution += cells.solution.charAt(row + 3) + " " + cells.solution.charAt(row + 4) + " " + cells.solution.charAt(row + 5) + " | ";
		solution += cells.solution.charAt(row + 6) + " " + cells.solution.charAt(row + 7) + " " + cells.solution.charAt(row + 8) + "<br />";
		
		if (i == 2 || i == 5) {
			solution += "------+-------+------<br />";
		}
	}
	
	if (window.solutionWindow) {
		window.solutionWindow.close();
	}
	
	window.solutionWindow = window.open("", "", "height=230,width=208,status=0,menubar=0");
	
	currentElement = window.solutionWindow.document.head.appendChild(document.createElement("title"));
	currentElement.textContent = "Solution";
	
	currentElement = window.solutionWindow.document.body.appendChild(document.createElement("div"));
	
	currentElement.innerHTML = solution;
	currentElement.style.fontFamily = "Consolas, Courier New, monospace";
	currentElement.style.fontColor = "#666666";
	currentElement.style.fontSize = "15px";
	
	bindEventListener(window, "beforeunload", function() {
		window.solutionWindow.close();
	});

}

function getHint() {
	if (cells.lastSelectedCell === null) {
		return;
	}

	var currentCell = cells[cells.lastSelectedCell];

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Get Hint');
	}
	
	if (cells.hints > 0 && currentCell.element.children.length > 0) {
		currentCell.value = currentCell.solution;
		currentCell.candidatesElement.innerHTML = currentCell.value + "";
		currentCell.setValue(currentCell.value);
		currentCell.element.innerHTML = currentCell.value;
		currentCell.element.classList.add("cell_hint");
		showDuplicates();

		cells.hints--;
		this.textContent = "Hint (" + cells.hints + ")";

		if (cells.hints === 2) {
			this.title = "Give a hint for the selected cell. There are two hints remaining.";
		} else if (cells.hints === 1) {
			this.title = "Give a hint for the selected cell. There is one hint remaining.";
		} else if (cells.hints <= 0) {
			this.disabled = true;
			this.title = "There are no more hints remaining.";
		}

	}
}

function setBlankCells() {
	var color = parseInt(this.number);
	var currentCell;

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Set Blank Cells ' + color);
	}
	
	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		if (currentCell.value === 0) {
			currentCell.setColor(color);
		}
	}
	
	// Highlight selected link.
	document.getElementById("mark_blank_cells_" + cells.blankCellColor).classList.remove("mark_blank_cells_selected");;
	this.classList.add("mark_blank_cells_selected");
	
	cells.blankCellColor = color;
}

function deleteColoredCells() {
	var color = parseInt(this.number);
	var colorValueList = ["black", "blue", "red", "green", "purple"];
	
	if (!confirm("Are you sure you want to delete all cells marked " + colorValueList[color] + "?")) {
		return;
	}

	// Log event.
	if (window.ga) { 
		ga('send', 'event', "sudoku", 'click', 'Sudoku - Delete ' + colorValueList[color] + ' Cells');
	}
	
	
	var currentCell;

	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		if (currentCell.value !== 0 && currentCell.getColor() === color) {
			currentCell.element.firstChild.value = "";
			currentCell.setValue(0);
			currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();

			currentCell.setColor(cells.blankCellColor);
		}
	}

	showDuplicates();
}

window.onload = function() {
	document.getElementById("noscript").style.display = "none"; // Hide this first.
	
	
	var Cell = function(index) {
		this.index = index;
		this.value = 0;
		this.element = undefined;
		this.candidatesElement = undefined;

		this.neighbors = [];
		this.rowNeighbors = [];
		this.columnNeighbors = [];
		this.blockNeighbors = [];
		this.candidates = [];
		this.pencilmarks = [true, true, true, true, true, true, true, true, true];
		this.isGiven = false;
		var color = 0;

		var blocks = [
			0, 0, 0, 1, 1, 1, 2, 2, 2,
			0, 0, 0, 1, 1, 1, 2, 2, 2,
			0, 0, 0, 1, 1, 1, 2, 2, 2,
			3, 3, 3, 4, 4, 4, 5, 5, 5,
			3, 3, 3, 4, 4, 4, 5, 5, 5,
			3, 3, 3, 4, 4, 4, 5, 5, 5,
			6, 6, 6, 7, 7, 7, 8, 8, 8,
			6, 6, 6, 7, 7, 7, 8, 8, 8,
			6, 6, 6, 7, 7, 7, 8, 8, 8
		];

		var blockIndeces = [0, 1, 2, 9, 10, 11, 18, 19, 20, 3, 4, 5, 12, 13, 14, 21, 22, 23, 6, 7, 8, 15, 16, 17, 24, 25, 26, 27, 28, 29, 36, 37, 38, 45, 46, 47, 30, 31, 32, 39, 40, 41, 48, 49, 50, 33, 34, 35, 42, 43, 44, 51, 52, 53, 54, 55, 56, 63, 64, 65, 72, 73, 74, 57, 58, 59, 66, 67, 68, 75, 76, 77, 60, 61, 62, 69, 70, 71, 78, 79, 80];

		var currentCell;
		var row = Math.floor(index / 9);
		var column = index % 9;
		var block = blocks[index];


		// Set neighbors.

		// row
		for (var i = row * 9; (i < (row + 1) * 9) && i < index; i++) {
			currentCell = cells[i];

			this.neighbors.push(currentCell);
			currentCell.neighbors.push(this);

			this.rowNeighbors.push(currentCell);
			currentCell.rowNeighbors.push(this);
		}

		// column
		for (var i = column; i < 81 && i < index; i += 9) {
			currentCell = cells[i];

			if (! this.neighbors.contains(currentCell)) {
				this.neighbors.push(currentCell);
				currentCell.neighbors.push(this);
			}

			this.columnNeighbors.push(currentCell);
			currentCell.columnNeighbors.push(this);
		}

		// block
		for (var i = block * 9; i < (block + 1) * 9; i++) {
			if (blockIndeces[i] < index) {

				currentCell = cells[blockIndeces[i]];

				if (! this.neighbors.contains(currentCell)) {
					this.neighbors.push(currentCell);
					currentCell.neighbors.push(this);
				}

				this.blockNeighbors.push(currentCell);
				currentCell.blockNeighbors.push(this);
			}
		}

		this.setValue = function(value) {
			this.value = value;

			if (value === 0) {
				this.candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			} else {
				this.candidates = [value];
			}
		};

		this.toString = function toString() {
			return this.value + "";
		};
		
		this.getPencilmarkString = function() {
			var result = "";
			for (var i = 0; i < 9; i++) {
				if (this.pencilmarks[i]) {
					result += i + 1;
				}
			}
			
			return result;
		};
		
		this.getColor = function() {
			return color;
		};
		
		this.setColor = function(value) {
			var colorValueList = ["black", "blue", "red", "green", "purple"];
			
			color = value;
			
			this.element.classList.remove("blank_cell_highlight_black");
			this.element.classList.remove("blank_cell_highlight_red");
			this.element.classList.remove("blank_cell_highlight_blue");
			this.element.classList.remove("blank_cell_highlight_green");
			this.element.classList.remove("blank_cell_highlight_purple");

			this.element.classList.add("blank_cell_highlight_" + colorValueList[color]);
		};
		
		this.setValue(0);
	};

	var isMobile = /android|webos|iphone|ipod|blackberry/i.test(navigator.userAgent.toLowerCase());
	
	var currentCell, currentInput;

	if (isMobile) {
		document.body.classList.add("mobile");
	}
	
	for (var row = 0; row < 9; row++) {
		for (var col = 0; col < 9; col++) {
			currentCell = new Cell(row * 9 + col);
			cells[row * 9 + col] = currentCell;

			currentCell.element = document.getElementById("cell"+(row * 9 + col));
			currentCell.candidatesElement = document.getElementById("candidates"+(row * 9 + col));
			
			if (currentCell.element.firstChild && parseInt(currentCell.element.firstChild.value) > 0) {
				currentCell.setValue(parseInt(currentCell.element.firstChild.value));
			}

			currentInput = document.getElementById("cell"+(row * 9 + col)+"_input");
			
			if (isMobile) {
				currentInput.type = "tel";
			}
			
			currentInput.index = currentCell.index;
			currentInput.onkeydown = inputOnKeyDown;
			currentInput.onfocus = inputOnFocus;
			
			// bindEventListener(currentInput, "keydown", inputOnKeyDown);
			// bindEventListener(currentInput, "focus", inputOnFocus);
		}
	}

	cells.lastSelectedCell = null;
	cells.hints = 3;
	cells.blankCellColor = 0;
	
	clearPencilmarks();
	
	bindEventListener(document.getElementById("begin_solving_button"), "click", submitGivens);
	bindEventListener(document.getElementById("paste_puzzle"), "keydown", function (e) {
		if (event && event.keyCode === 13) {
			pastePuzzle();
		}
	});
	
	bindEventListener(document.getElementById("import_save"), "keydown", function (e) {
		if (event && event.keyCode === 13) {
			decode(document.getElementById("import_save").value);
		}
	});
	
	bindEventListener(document.getElementById("save_load"), "click", saveLoadPuzzle);
	
	for (var i = 0; i < 10; i++) {
		document.getElementById("highlight_" + i).number = i;
		
		bindEventListener(document.getElementById("highlight_" + i), "click", highlight);
	}

	bindEventListener(document.getElementById("update_pencilmarks"), "click", updatePencilmarks);
	bindEventListener(document.getElementById("reset_pencilmarks"), "click", clearPencilmarks);
	bindEventListener(document.getElementById("auto_pencilmarks"), "click", function(e) {
		this.classList.toggle("auto_pencilmarks_selected");
		if (this.textContent == "On") {
			this.textContent = "Off";
		} else {
			this.textContent = "On";
		}
	});
	
	bindEventListener(document.getElementById("enter_values"), "click", function(e) {
		document.getElementById("enter_pencilmarks").classList.toggle("enter_controls_selected");
		this.classList.toggle("enter_controls_selected");
	});
	
	bindEventListener(document.getElementById("enter_pencilmarks"), "click", function(e) {
		document.getElementById("enter_values").classList.toggle("enter_controls_selected");
		this.classList.toggle("enter_controls_selected");
	});
	bindEventListener(document.getElementById("show_duplicates"), "click", function(e) {
		this.classList.toggle("show_duplicates_selected");
		if (this.textContent == "On") {
			this.textContent = "Off";
		} else {
			this.textContent = "On";
		}
	});
	bindEventListener(document.getElementById("show_duplicates"), "click", showDuplicates);
	bindEventListener(document.getElementById("show_solution"), "click", showSolution);
	bindEventListener(document.getElementById("get_hint"), "click", getHint);
	
	for (var i = 0; i < 5; i++) {
		document.getElementById("mark_blank_cells_" + i).number = i;
		document.getElementById("delete_cells_" + i).number = i;
		
		bindEventListener(document.getElementById("mark_blank_cells_" + i), "click", setBlankCells);
		bindEventListener(document.getElementById("delete_cells_" + i), "click", deleteColoredCells);
	}
	
	if (document.getElementById("solution") && document.getElementById("solution").value) {
		submitGivens();
	} else {
		document.getElementById("controls").style.display = "none";
	}
};

function bindEventListener(element, eventString, listenerFunction) {
    if (element.addEventListener){
        element.addEventListener(eventString, listenerFunction, false);
    } else if (element.attachEvent) {
        element.attachEvent('on' + eventString, listenerFunction);
    }
}