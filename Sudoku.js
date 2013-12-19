var cells = [];

function inputOnKeyDown(e) {
	var code = e.keyCode;

	switch (code) {
		case 9: // tab
		case 27: // escape
		case 33: // page up
		case 34: // page down
			return true;
		break;

		case 37: // left
			if (this.index === 0) {
				if (document.getElementById("cell80_input")) {
					document.getElementById("cell80_input").focus();
				}
			} else {
				if (document.getElementById("cell" + (this.index - 1) + "_input")) {
					document.getElementById("cell" + (this.index - 1) + "_input").focus();
				}
			}
		break;

		case 38: // up
			if (this.index < 9) {
				if (document.getElementById("cell" + (this.index + 72) + "_input")) {
					document.getElementById("cell" + (this.index + 72) + "_input").focus();
				}
			} else {
				if (document.getElementById("cell" + (this.index - 9) + "_input")) {
					document.getElementById("cell" + (this.index - 9) + "_input").focus();
				}
			}
		break;

		case 39: // right
			if (this.index === 80) {
				if (document.getElementById("cell0_input")) {
					document.getElementById("cell0_input").focus();
				}
			} else {
				if (document.getElementById("cell" + (this.index + 1) + "_input")) {
					document.getElementById("cell" + (this.index + 1) + "_input").focus();
				}
			}
		break;

		case 13: // enter
		case 40: // down
			if (this.index > 71) {
				if (document.getElementById("cell" + (this.index - 72) + "_input")) {
					document.getElementById("cell" + (this.index - 72) + "_input").focus();
				}
			} else {
				if (document.getElementById("cell" + (this.index + 9) + "_input")) {
					document.getElementById("cell" + (this.index + 9) + "_input").focus();
				}
			}
		break;

		// 65-90 a-z
		// 48-57 0-9
		// 97-105 numpad 0-9

		default:

			// function keys
			if (code >= 112 && code <= 123) {
				return true;
			} else if (document.getElementById("write_mode_values").checked) {

				// backspace || delete
				if (code === 8 || code === 46) {
					var currentCell = cells[this.index];

					this.value = "";
					currentCell.setValue(0);
					currentCell.candidatesElement.innerHTML = currentCell.getPencilmarkString();
					showDuplicates();
					
					// Before givens are submitted, automatically update pencilmarks.
					if (!cells.hasOwnProperty("solution")) {
						updatePencilmarks();
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
						updatePencilmarks();
					} else if (document.getElementById("auto_pencilmarks").checked) {
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

	if (document.getElementById("show_duplicates").checked) {

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
	// var currentCell;

	// for (var i = 0; i < 81; i++) {
		// currentCell = cells[i];
		// currentCell.setValue(0);
		// currentCell.pencilmarks = [true, true, true, true, true, true, true, true, true];

		// currentCell.element.classList.remove("cell_highlighted");
		// currentCell.element.classList.remove("cell_duplicate");
		// currentCell.candidatesElement.classList.remove("candidates_highlighted");
		// currentCell.element.firstChild.value = "";
		// currentCell.candidatesElement.innerHTML = "123456789";
	// }
}

function pastePuzzle() {
	// var values = window.prompt("Enter a sudoku puzzle. Use \"0\", \".\", \"*\", or \"_\" for empty cells.\nAll other characters are ignored.\nAlternatively, load a previously saved puzzle.");
	var values = document.getElementById("paste_puzzle").value;
	
	if (!values) {
		return;
	}

	if (values.length === 81) {
		values = values.replace(/[.*_]/g, "0");
		values = values.replace(/[^0-9]/g, "");
		
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
	} else if (values.length === 243) {
		submitGivens();
		
		decode(values);
	
	} else {
		window.alert("Invalid input");
		return;
	}

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

	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		values += currentCell.value;

	}

	var puzzle = new Puzzle(values);

	if (!puzzle.hasSolution()) {
		alert("There is no solution for the inputted values.");
	} else {

		document.getElementById("top_bar").style.display = "none";
		document.getElementById("begin_solving").style.display = "none";
		// document.getElementById("submit_givens").style.display = "none";
		// document.getElementById("paste_puzzle").style.display = "none";
		// document.getElementById("solving_status").innerHTML = "Solving puzzle...";
		// document.getElementById("solving_status").title = "Enter values to solve the puzzle.";
		document.getElementById("controls").style.display = "block";
		document.getElementById("grid_table").style.position = "static";
		document.getElementById("grid_table").style.marginTop = "8px";
		document.getElementById("grid_table").style.marginLeft = "8px";
		document.getElementById("side_bar").style.display = "none";
		
		document.getElementById("import_save_button").title = "This option is disabled when a sudoku puzzle is in progress.";
		document.getElementById("import_save_button").disabled = true;
		document.getElementById("paste_puzzle_button").title = "This option is disabled when a sudoku puzzle is in progress.";
		document.getElementById("paste_puzzle_button").disabled = true;
		document.getElementById("load_cookie").title = "This option is disabled when a sudoku puzzle is in progress.";
		document.getElementById("load_cookie").disabled = true;
		
		cells.solution = puzzle.toString();
		for (var i = 0; i < 81; i++) {
			currentCell = cells[i];

			if (currentCell.value !== 0) {
				currentCell.element.innerHTML = currentCell.value;
				currentCell.isGiven = true;;
			} else {
				currentCell.element.classList.add("blank_cell_highlight_black");
			}

			currentCell.solution = parseInt(cells.solution[i]);
		}
	}
}

function showSolution() {
	var currentElement;
	var row;
	var solution = "";

	if (cells.solution === undefined || !window.confirm("Are you sure you want to show the solution?")) {
		return;
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
	
	// alert(solution);
	
	currentElement.innerHTML = solution;
	currentElement.style.fontFamily = "Consolas";
	currentElement.style.fontColor = "#666";
	
	window.onunload = function() {
		window.solutionWindow.close();
	};
	
	
	
	// if (document.getElementById("show_solution").checked) {
		// if (!window.confirm("Are you sure you want to show the solution?")) {
			// document.getElementById("show_solution").checked = false;
			// return;
		// }

		// for (var i = 0; i < 81; i++) {
			// currentCell = cells[i];

			// if (currentCell.element.children.length > 0) {
				// currentCell.element.firstChild.value = currentCell.solution;
				// currentCell.element.firstChild.disabled = true;
			// }


		// }
	// } else {
		// for (var i = 0; i < 81; i++) {
			// currentCell = cells[i];

			// if (currentCell.element.children.length > 0) {
				// currentCell.element.firstChild.disabled = false;

				// currentCell.element.firstChild.value = currentCell.value === 0 ? "" : currentCell.value;
			// }
		// }
	// }
}

function getHint() {
	if (cells.lastSelectedCell === null) {
		return;
	}

	var currentCell = cells[cells.lastSelectedCell];

	if (cells.hints > 0 && currentCell.element.children.length > 0) {
		currentCell.value = currentCell.solution;
		currentCell.candidatesElement.innerHTML = currentCell.value + "";
		currentCell.setValue(currentCell.value);
		currentCell.element.innerHTML = currentCell.value;
		currentCell.element.classList.add("cell_hint");
		showDuplicates();

		cells.hints--;
		document.getElementById("get_hint").value = "Hint (" + cells.hints + ")";

		if (cells.hints === 2) {
			document.getElementById("get_hint").title = "Give a hint for the selected cell. There are two hints remaining.";
		} else if (cells.hints === 1) {
			document.getElementById("get_hint").title = "Give a hint for the selected cell. There is one hint remaining.";

		} else if (cells.hints <= 0) {
			document.getElementById("get_hint").disabled = true;
			document.getElementById("get_hint").title = "There are no more hints remaining.";
		}

	}
}

function setBlankCells(color) {
	var currentCell;

	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		if (currentCell.value === 0) {
			currentCell.element.classList.remove("blank_cell_highlight_black");
			currentCell.element.classList.remove("blank_cell_highlight_red");
			currentCell.element.classList.remove("blank_cell_highlight_blue");
			currentCell.element.classList.remove("blank_cell_highlight_green");
			currentCell.element.classList.remove("blank_cell_highlight_purple");

			currentCell.element.classList.add("blank_cell_highlight_" + color);
			currentCell.color = cells.getColorIndex(color);
		}

	}
	
	// Highlight selected link.
	document.getElementById("mark_blank_cells_" + cells.blankCellColor).style.backgroundColor = "";
	document.getElementById("mark_blank_cells_" + color).style.backgroundColor = "#FF8";
	
	cells.blankCellColor = color;
}

function deleteColoredCells(color) {
	if (!confirm("Are you sure you want to delete all cells marked " + color + "?")) {
		return;
	}

	var currentCell;

	for (var i = 0; i < 81; i++) {
		currentCell = cells[i];

		if (currentCell.value !== 0 && currentCell.element.classList.contains("blank_cell_highlight_" + color)) {
			currentCell.element.firstChild.value = "";
			currentCell.setValue(0);
			currentCell.candidatesElement.innerHTML = currentCell.pencilmarks.map(function(value, index){if(value)return index + 1;}).join("");

			currentCell.element.classList.remove("blank_cell_highlight_" + color);

			currentCell.element.classList.add("blank_cell_highlight_" + cells.blankCellColor);
			currentCell.color = cells.getColorIndex(cells.blankCellColor);
		}
	}

	showDuplicates();
}

window.onload = function() {
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
		this.color = 0;

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
		}

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
		}

		this.setValue(0);
		
		
	};

	var tabIndex = 1;

	var grid_table = document.getElementById("grid_table");
	var currentRow, currentCell, currentInput;
	var currentCandidateRow;

	for (var row = 0; row < 9; row++) {
		currentRow = grid_table.children[0].appendChild(document.createElement("tr")); // Append row to <tbody>
		currentCandidateRow = grid_table.children[0].appendChild(document.createElement("tr")); // Append row to <tbody>

		for (var col = 0; col < 9; col++) {
			currentCell = new Cell(row * 9 + col);
			cells[row * 9 + col] = currentCell;

			currentCell.element = currentRow.appendChild(document.createElement("td"));
			currentCell.element.classList.add("cell");
			currentCell.candidatesElement = currentCandidateRow.appendChild(document.createElement("td"));
			currentCell.candidatesElement.classList.add("candidates");

			currentInput = currentCell.element.appendChild(document.createElement("input"));
			
			if (/android|webos|iphone|ipad|ipod|blackberry/i.test(navigator.userAgent.toLowerCase())) {
				currentInput.type = "tel";
			} else {
				currentInput.type = "text";
			}
			
			currentInput.tabIndex = tabIndex;
			tabIndex++;

			currentInput.index = currentCell.index;
			currentInput.id = "cell" + currentCell.index + "_input";
			currentInput.onkeydown = inputOnKeyDown;
			currentInput.onfocus = inputOnFocus;

			if (row === 0 || row === 3 || row === 6) {
				currentCell.element.style.borderTopStyle = "solid";
				currentCell.element.style.borderTopWidth = "2px";
			} else if (row === 8) {
				currentCell.candidatesElement.style.borderBottomStyle = "solid";
				currentCell.candidatesElement.style.borderBottomWidth = "2px";
			}

			if (col === 0 || col === 3 || col === 6) {
				currentCell.element.style.borderLeftStyle = "solid";
				currentCell.candidatesElement.style.borderLeftStyle = "solid";
				currentCell.element.style.borderLeftWidth = "2px";
				currentCell.candidatesElement.style.borderLeftWidth = "2px";
			} else if (col === 8) {
				currentCell.element.style.borderRightStyle = "solid";
				currentCell.candidatesElement.style.borderRightStyle = "solid";
				currentCell.element.style.borderRightWidth = "2px";
				currentCell.candidatesElement.style.borderRightWidth = "2px";
			}

		}
	}

	cells.lastSelectedCell = null;
	cells.hints = 3;
	cells.blankCellColor = "black";
	
	cells.getColorIndex = function(color) {
		var colorIndexList = {"black":0, "blue":1, "red":2, "green":3, "purple": 4};
		return colorIndexList[color];
	}
	
	cells.getColorValue = function(num) {
		var colorValueList = ["black", "blue", "red", "green", "purple"];
		return colorValueList[num];
	}
	
	updatePencilmarks();
	
	
	// var sideBar = document.body.appendChild(document.createElement("div"));
	// var sideBarDragPos = 0;
	
	// sideBar.id = "side_bar";
	// sideBar.style.width = "450px";
	
	// sideBar.onmousedown = function() {
		// sideBarDragPos = window.event.clientX;
	// }
	
	// sideBar.onmousemove = function() {
		// if (sideBarDragPos) {
			// if (sideBarDragPos - window.event.clientX < 0) {
				// sideBar.style.right = (sideBarDragPos - window.event.clientX) + "px";
			// }
		// }
	// }
	
	// sideBar.onmouseup = function() {
		// sideBar.style.right = -parseInt(sideBar.style.width) + "px";
		// sideBarDragPos = 0;
	// }
	
	// var currentElement = sideBar.appendChild(document.createElement("div"));
	
	// currentElement.className = "small_header";
	// currentElement.textContent = "Paste Puzzle:";
	
	// currentElement = sideBar.appendChild(document.createElement("input"));
	// currentElement.type = "text";
	// currentElement.id = "paste_puzzle";
};