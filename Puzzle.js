// puzzle.js - Solves Sudoku puzzles.
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


Array.prototype.remove = function(val) {
	var length = this.length;
	for (var i = 0; i < length; i++) {
		if (this[i] === val) {
			this.splice(i, 1); // Remove the element
			return true;
		}
	}

	return false;
};

Array.prototype.contains = function(val) {
	var length = this.length;

	for (var i = 0; i < length; i++) {
		if (this[i].constructor.name === "Cell" && this[i].index === val.index) {
			return true;
		} else if (this[i] === val) {
			return true;
		}
	}

	return false;
}


function Puzzle(givens) {
	
	var cells = [];
	var guessCell; // Store guess cell (the cell with the least candidates) after processing in case it changes.
	var guessCellCandidates;
	var solution;

	var Cell = function Cell(index, value) {
		this.neighbors = [];
		this.rowNeighbors = [];
		this.columnNeighbors = [];
		this.blockNeighbors = [];
		this.candidates = [];

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

		var blockIndeces = [
			 0,  1,  2,  9, 10, 11, 18, 19, 20,
			 3,  4,  5, 12, 13, 14, 21, 22, 23,
			 6,  7,  8, 15, 16, 17, 24, 25, 26,
			27, 28, 29, 36, 37, 38, 45, 46, 47,
			30, 31, 32, 39, 40, 41, 48, 49, 50,
			33, 34, 35, 42, 43, 44, 51, 52, 53,
			54, 55, 56, 63, 64, 65, 72, 73, 74,
			57, 58, 59, 66, 67, 68, 75, 76, 77,
			60, 61, 62, 69, 70, 71, 78, 79, 80
		];

		var currentCell;
		var row = Math.floor(index / 9);
		var column = index % 9;
		var block = blocks[index];

		this.processed = true;
		this.index = index;
		this.value = value;
		this.color = 0;

		if (value === 0) {
			for (var i = 1; i <= 9; i++) {
				this.candidates.push(i);
			}
		} else {
			this.candidates.push(value);
		}

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
	};

	// Initialize cells.
	for (var i = 0; i < 81; i++) {
		cells[i] = new Cell(i, 0);
	}

	var processSingles = function() {
		var currentCell;
		var result = false;

		for (var i = 0; i < 81; i++) {
			currentCell = cells[i];

			if (currentCell.candidates.length === 1 && !currentCell.processed) {
				result = true;

				currentCell.value = currentCell.candidates[0];
				currentCell.processed = true;

				for (var v = 0; v < currentCell.neighbors.length; v++) {


					if (currentCell.neighbors[v].candidates.remove(currentCell.value)) {
						currentCell.neighbors[v].processed = false;
					}
				}
			}
		}

		return result;
	};

	var processHiddenSingles = function() {
		var currentCell;
		var uniqueCandidates = [];
		var result = false;

		for (var i = 0; i < 81; i++) {
			currentCell = cells[i];

			if (currentCell.value !== 0) {
				continue;
			}

			uniqueCandidates.length = 0;

			// row
			uniqueCandidates = uniqueCandidates.concat(currentCell.candidates);

			for (var v = 0; v < currentCell.rowNeighbors.length; v++) {
				for (var u = 0; u < currentCell.rowNeighbors[v].candidates.length; u++) {
					uniqueCandidates.remove(currentCell.rowNeighbors[v].candidates[u]);
				}
			}

			if (uniqueCandidates.length === 1) {
				currentCell.value = uniqueCandidates[0];
				currentCell.candidates.length = 0;
				currentCell.candidates.push(currentCell.value);
				currentCell.processed = true;

				for (var v = 0; v < currentCell.neighbors.length; v++) {
					if (currentCell.neighbors[v].candidates.remove(currentCell.value)) {
						currentCell.neighbors[v].processed = false;
					}
				}

				result = true;
				continue;
			}

			uniqueCandidates.length = 0;

			// column
			uniqueCandidates = uniqueCandidates.concat(currentCell.candidates);

			for (var v = 0; v < currentCell.columnNeighbors.length; v++) {
				for (var u = 0; u < currentCell.columnNeighbors[v].candidates.length; u++) {
					uniqueCandidates.remove(currentCell.columnNeighbors[v].candidates[u]);
				}
			}

			if (uniqueCandidates.length === 1) {
				currentCell.value = uniqueCandidates[0];
				currentCell.candidates.length = 0;
				currentCell.candidates.push(currentCell.value);
				currentCell.processed = true;

				for (var v = 0; v < currentCell.neighbors.length; v++) {
					if (currentCell.neighbors[v].candidates.remove(currentCell.value)) {
						currentCell.neighbors[v].processed = false;
					}
				}

				result = true;
				continue;
			}

			uniqueCandidates.length = 0;

			// block
			uniqueCandidates = uniqueCandidates.concat(currentCell.candidates);

			for (var v = 0; v < currentCell.blockNeighbors.length; v++) {
				for (var u = 0; u < currentCell.blockNeighbors[v].candidates.length; u++) {
					uniqueCandidates.remove(currentCell.blockNeighbors[v].candidates[u]);
				}
			}

			if (uniqueCandidates.length === 1) {
				currentCell.value = uniqueCandidates[0];
				currentCell.candidates.length = 0;
				currentCell.candidates.push(currentCell.value);
				currentCell.processed = true;

				for (var v = 0; v < currentCell.neighbors.length; v++) {
					if (currentCell.neighbors[v].candidates.remove(currentCell.value)) {
						currentCell.neighbors[v].processed = false;
					}
				}

				result = true;
				continue;
			}
		}

		return result;
	};

	var intersectionRemoval = function() {
		var currentCell;
		var uniqueCandidates = [];
		var intersection = [];
		var result = false;
		var size;

		for (var i = 0; i < 81; i += 3) {
			currentCell = cells[i];

			if (currentCell.candidates.length <= 1) {
				continue;
			}

			intersection.length = 0;
			uniqueCandidates.length = 0;

			for (var v = 0; v < currentCell.blockNeighbors.length; v++) {
				if (currentCell.blockNeighbors[v].value === 0 && currentCell.rowNeighbors.contains(currentCell.blockNeighbors[v])) {
					intersection.push(currentCell.blockNeighbors[v]);
				}
			}

			if (intersection.length <= 1) {
				continue;
			}

			for (var v = 0; v < intersection.length; v++) {
				for (var u = 0; u < intersection[v].candidates.length; u++) {
					if (!uniqueCandidates.contains(intersection[v].candidates[u])) {
						uniqueCandidates.push(intersection[v].candidates[u]);
					}
				}
			}

			if (uniqueCandidates.length === 0) {
				continue;
			}

			for (var v = 0; v < currentCell.rowNeighbors.length; v++) {
				if (! intersection.contains(currentCell.rowNeighbors[v])) {
					for (var u = 0; u < currentCell.rowNeighbors[v].candidates.length; u++) {
						uniqueCandidates.remove(currentCell.rowNeighbors[v].candidates[u]);
					}
				}
			}

			if (uniqueCandidates.length > 0 && intersection.length >= uniqueCandidates.length) {

				for (var v = 0; v < currentCell.blockNeighbors.length; v++) {

					if (currentCell.blockNeighbors[v].value === 0 && ! intersection.contains(currentCell.blockNeighbors[v])) {
						size = currentCell.blockNeighbors[v].candidates.length;

						for (var u = 0; u < uniqueCandidates.length; u++) {
							currentCell.blockNeighbors[v].candidates.remove(uniqueCandidates[u]);
						}

						if (currentCell.blockNeighbors[v].candidates.length != size) {
							currentCell.blockNeighbors[v].processed = false;
							result = true;
						}
					}
				}
			}

			uniqueCandidates.length = 0;

			for (var v = 0; v < intersection.length; v++) {
				if (intersection[v].value === 0) {

					for (var u = 0; u < intersection[v].candidates.length; u++) {
						if (!uniqueCandidates.contains(intersection[v].candidates[u])) {
							uniqueCandidates.push(intersection[v].candidates[u]);
						}
					}
				}
			}

			if (uniqueCandidates.length === 0) {
				continue;
			}

			for (var v = 0; v < currentCell.blockNeighbors.length; v++) {
				if (!intersection.contains(currentCell.blockNeighbors[v])) {
					for (var u = 0; u < currentCell.blockNeighbors[v].candidates.length; u++) {
						uniqueCandidates.remove(currentCell.blockNeighbors[v].candidates[u]);
					}
				}
			}

			if (uniqueCandidates.length > 0 && intersection.length >= uniqueCandidates.length) {
				for (var v = 0; v < currentCell.rowNeighbors.length; v++) {
					if (currentCell.rowNeighbors[v].value === 0 && !intersection.contains(currentCell.rowNeighbors[v])) {
						size = currentCell.rowNeighbors[v].candidates.length;

						for (var u = 0; u < uniqueCandidates.length; u++) {
							currentCell.rowNeighbors[v].candidates.remove(uniqueCandidates[u]);
						}

						if (currentCell.rowNeighbors[v].candidates.length != size) {
							currentCell.rowNeighbors[v].processed = false;
							result = true;
						}
					}
				}
			}
		}

		for (var i = 0; i < 81; i = i % 9 === 8 ? i + 18 : i + 1) {
			currentCell = cells[i];

			if (currentCell.candidates.length <= 1) {
				continue;
			}

			intersection.length = 0;

			for (var v = 0; v < currentCell.blockNeighbors.length; v++) {
				if (currentCell.blockNeighbors[v].value === 0 && currentCell.columnNeighbors.contains(currentCell.blockNeighbors[v])) {
					intersection.push(currentCell.blockNeighbors[v]);
				}
			}

			if (intersection.length <= 1) {
				continue;
			}


			for (var v = 0; v < intersection.length; v++) {
				for (var u = 0; u < intersection[v].candidates.length; u++) {
					if (!uniqueCandidates.contains(intersection[v].candidates[u])) {
						uniqueCandidates.push(intersection[v].candidates[u]);
					}
				}
			}

			if (uniqueCandidates.length === 0) {
				continue;
			}

			for (var v = 0; v < currentCell.columnNeighbors.length; v++) {
				if (! intersection.contains(currentCell.columnNeighbors[v])) {
					for (var u = 0; u < currentCell.columnNeighbors[v].candidates.length; u++) {
						uniqueCandidates.remove(currentCell.columnNeighbors[v].candidates[u]);
					}
				}
			}

			if (uniqueCandidates.length > 0 && intersection.length >= uniqueCandidates.length) {
				for (var v = 0; v < currentCell.blockNeighbors.length; v++) {
					if (currentCell.blockNeighbors[v].value === 0 && !intersection.contains(currentCell.blockNeighbors[v])) {
						size = currentCell.blockNeighbors[v].candidates.length;

						for (var u = 0; u < uniqueCandidates.length; u++) {
							currentCell.blockNeighbors[v].candidates.remove(uniqueCandidates[u]);
						}

						if (currentCell.blockNeighbors[v].candidates.length != size) {
							currentCell.blockNeighbors[v].processed = false;
							result = true;
						}
					}
				}
			}

			uniqueCandidates.length = 0;

			for (var v = 0; v < intersection.length; v++) {
				if (intersection[v].value === 0) {
					for (var u = 0; u < intersection[v].candidates.length; u++) {
						if (!uniqueCandidates.contains(intersection[v].candidates[u])) {
							uniqueCandidates.push(intersection[v].candidates[u]);
						}
					}
				}
			}

			if (uniqueCandidates.length === 0) {
				continue;
			}

			for (var v = 0; v < currentCell.blockNeighbors.length; v++) {
				if (! intersection.contains(currentCell.blockNeighbors[v])) {
					for (var u = 0; u < currentCell.blockNeighbors[v].candidates.length; u++) {
						uniqueCandidates.remove(currentCell.blockNeighbors[v].candidates[u]);
					}
				}
			}

			if (uniqueCandidates.length > 0 && intersection.length >= uniqueCandidates.length) {
				for (var v = 0; v < currentCell.columnNeighbors.length; v++) {
					if (currentCell.columnNeighbors[v].value === 0 && ! intersection.contains(currentCell.columnNeighbors[v])) {
						size = currentCell.columnNeighbors[v].candidates.length;

						for (var u = 0; u < uniqueCandidates.length; u++) {
							currentCell.columnNeighbors[v].candidates.remove(uniqueCandidates[u]);
						}

						if (currentCell.columnNeighbors[v].candidates.length != size) {
							currentCell.columnNeighbors[v].processed = false;
							result = true;
						}
					}
				}
			}
		}

		return result;
	};

	// Perform function of grid.
	// Reset cells to values.
	// Process singles, hidden singles.
	// Set guessCell to the index of the cell with the least number of candidates; set guessCellCandidates.
	// Return each cell's value concatenated in a string.
	var process = function(values) {
		var currentCell;

		for (var i = 0; i < 81; i++) {
			cells[i].setValue(0);
		}

		for (var i = 0; i < 81; i++) {
			value = parseInt(values[i]);

			currentCell = cells[i];

			if (value !== 0) {
				currentCell.setValue(value);
				currentCell.processed = true;

				for (var v = 0; v < currentCell.neighbors.length; v++) {

					if (currentCell.neighbors[v].candidates.remove(value)) {
						currentCell.neighbors[v].processed = false;
					}
				}
			} else {
				currentCell.processed = false;
			}
		}

		while (processSingles() || processHiddenSingles() || intersectionRemoval()) {}

		guessCell = cells[0];

		for (var i = 1; i < 81; i++) {
			if (guessCell.value !== 0) {
				guessCell = cells[i];
			} else {
				currentCell = cells[i];
				
				// Choose the cell with the least candidates:
				// if (currentCell.value === 0 && currentCell.candidates.length < guessCell.candidates.length) {
					// guessCell = currentCell;
				// }
				
				// Choose the first empty cell.
				break;
			}
		}

		guessCellCandidates = guessCell.candidates;

		var result = "";

		for (var i = 0; i < 81; i++) {

			result += cells[i].value;
		}

		return result;
	};

	var isValid = function(values) {
		var currentCell;

		for (var i = 0; i < 81; i++) {
			currentCell = cells[i];

			if (values[i] !== "0") {

				for (var v = 0; v < currentCell.neighbors.length; v++) {
					if (values[currentCell.neighbors[v].index] === values[i]) {
						return false;
					}
				}
			}
		}

		return true;
	};

	var isFilled = function(values) {
		 return values.indexOf("0") === -1;
	};

	this.hasSolution = function() {
		return isFilled(solution) && isValid(solution);
	};

	this.toString = function() {
		return solution;
	};

	
	var solve = function solve(givens) {
		var stack = [];
		var values;
		var length;

		stack.push(givens);

		while(stack.length > 0) {
			values = stack.pop();
			values = process(values);

			if (isFilled(values)) {
				return values;
			}

			if (isValid(values)) {
				length = guessCellCandidates.length;

				for (var i = length - 1; i >= 0; i--) {
					stack.push(values.substr(0, guessCell.index) + guessCellCandidates[i] + values.substr(guessCell.index + 1));
				}
			}
		}

		return givens;
	};

	solution = solve(givens);
}
