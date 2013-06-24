#sudoku
This is a simple web page that provides tools to help solve sudoku puzzles.

To access the web page, go to http://delta42.github.io/sudoku.

Note: This web page does not save any entered values or pencilmarks. Refreshing or navigating away from it will reset the page to its initial state without warning.

##Features:
* Pencil marks
* Cell highlighting based on pencil marks
* Flag duplicate values
* Show solution
* Hints
* Mark guesses for quick removal

##Instructions:
1. To begin, __enter some values__. Find a sudoku puzzle and input its values using the number keys to insert values. The arrow keys, TAB, and ENTER can be used for navigation, while DELETE and BACKSPACE remove values. Alternatively enter values using the Paste puzzle link.
2. __Submit the values__ by clicking the begin solving link. This sets the values as read-only and enables several features.
3. __Solve the puzzle__ using pencil marks, cell highlighting, guesses, hints, and if all else fails, show solution.

##Button/link descriptions:
* __Clear cells__: Deletes all values, resets pencil marks, and removes all highlighting. This resets the page to its initial state.
* __Begin solving__: Sets the entered values as read-only and submits them to the puzzle solver. Once the values have been submitted, they cannot be changed. This generates a solution for the values and enables the solving features.
* __Paste puzzle__: Allows values to be inputted from the clipboard. This overwrites existing values. Zeros can be used as placeholders for empty cells. Characters other than 0-9 are ignored. There must be exactly 81 numbers for this to work properly.
* __1-9__: Highlights all cells that do not have a pencil mark of 1-9 a pale green color. If the pencil marks have been updated, this can be used to easily determine which cells do not have a value of 1-9. Does not update automatically.
* __Clear__: Removes all cell highlighting.
* __Enter values__: When this option is selected, typing a number in a cell changes its value.
* __Enter pencil marks__: When this option is selected, typing a number in a cell toggles the corresponding pencil mark.
* __Automatically remove pencil marks__: When this option is enabled, entering a value in a cell removes that pencil mark from all of the cell's neighbors (cells in the same row, box, or column).
* __Update__: Changes all pencil marks so that they show the possible values that each cell could have. This overwrites existing pencil marks.
* __Reset__: Adds all pencil marks to empty cells. Allows solving the puzzle without the aid of pencil marks. This overwrites existing pencil marks.
* __Show duplicates__: When this option is enabled, neighboring cells with the same value are flagged red.
* __Mark blank cells (color)__: Marks all blank cells with a certain color. Use this to make guesses so that if the guess is incorrect, all values entered afterward can be removed easily.
* __Delete cells marked (color)__: Deletes all cells that have been marked a certain color. Does not affect cells marked a different color or pencil marks.
* __Show solution__: When this option is enabled, the puzzle's solution will be shown. Does not affect cell values or pencil marks.
* __Hint__: Gives a hint for cell that was last selected, up to three hints. Hints are based on the solution.
