This is a simple web page that provides tools to help solve sudoku puzzles.

To access the web page, go to http://delta42.github.io/sudoku.

Note: This web page does not save any entered clues or values. Refreshing or navigating away from it will reset the page to its initial state.

###Features:
* Pencil marks
* Cell highlighting based on pencil marks
* Flag duplicate values
* Show solution
* Hints
* Mark guesses for quick removal

###Instructions:
1. To begin, __enter some clues__. Find a sudoku puzzle and input its clues using the number keys to insert values. The arrow keys, TAB, and ENTER can be used for navigation, while DELETE and BACKSPACE remove values. Alternatively enter clues using the Paste puzzle button.
2. __Submit the clues__ by clicking the Submit clues button. This sets the clues as read-only and enables several features.
3. __Solve the puzzle__ using pencil marks, cell highlighting, guesses, hints, and if all else fails, show solution.

###Button descriptions:
* __Clear cells__: Deletes all clues and values, resets pencil marks, and removes all highlighting. This resets the page to its initial state.
* __Submit clues__: Marks the entered values as read-only clues and submits them to the puzzle solver. Also enables hints, show solution, and guess removal. Once the clues have been submitted, they cannot be changed.
* __Paste puzzle__: Allows values to be inputted from the clipboard. This overwrites existing values. Zeros can be used as placeholders for empty cells. Characters other than 0-9 are ignored. There must be exactly 81 numbers for this to work properly.
* __1-9__: Highlights all cells that do not have a pencil mark of 1-9 a pale green color. If the pencil marks are updated, this can be used to easily determine which cells do not have a value of 1-9. Does not update automatically.
* __Clear__: Removes all cell highlighting.

* __Reset__: THIS CAN BE USED IF YOU DO NOT WANT TO HAVE THE HELP OF PENCIL MARKS.