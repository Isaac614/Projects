def split_array(arr, n):
    """
    Splits the contents of an array into several smaller arrays.
    """
    result = []
    for i in range(0, len(arr), n):
        chunk = arr[i:i + n]
        result.append(chunk)
    return result


def make_row(grid, y):
    """
    Returns a row in grid.
    """
    return grid[y]


def make_column(grid, x):
    """
    Returns a column in the grid.
    """
    column = []
    for row in grid:
        column.append(row[x])
    
    return column


def make_box(grid, i):
    """
    Returns the 3 x 3 box given a grid and i. i represents the box that will be returned 0 - 8; 0 being the box
    in the top left corner, 1 being the top middle box ... and 8 being the bottom right. 
    """
    # A new array is created from grid. The array is almost identical, but each row is split into 3 smaller arrays 
    # rather than a single large array
    split_grid = []
    for line in grid:
        split_line = split_array(line, 3)
        split_grid.append(split_line)

    # In order to get the correct y index we divide i by three and drop the remainder. This will return either 
    # 0, 1, or 2. We then multiply that value by three to get the correct starting y value for the box. 

    # To get the correct x index we divide i by 3 and keep only the remainder. This will return 0, 1, or 2
    y = i // 3 * 3
    x = i % 3

    # To get the correct 3 x 3 box we start with y (which will always be 0, 3, or 6) and get the correct array 
    # from y via x. Then we move down the next two rows and do the same thing. 
    box = []
    for j in range(y, y + 3):
        box.extend(split_grid[j][x])
    
    return box


def check_list(arr):
    """
    Checks to see if a number exists more than once in an array
    """
    for i in range(1, 10):
        if arr.count(i) > 1:
            return False
    
    return True


def check_grid(grid):
    """
    Checks to see if a grid is valid; ie there are no numbers in the same row, column, or box that contain the same
    number (0 excluded)
    """
    
    # Creates and checks every row, column, and box in the grid, and returns false if any number other than zero
    # exists more than once via the check_list function
    for i in range(len(grid)):
        row = make_row(grid, i)
        column = make_column(grid, i)
        box = make_box(grid, i)

        valid_row = check_list(row)
        valid_column = check_list(column)
        valid_box = check_list(box)

        if valid_row == False or valid_column == False or valid_box == False:
            return False
    
    return True


def check_sudoku(grid):
    """
    Checks if the grid is a sudoku; ie there are no empty spaces (zeroes) and the grid is valid 
    """
    # Checks for any zeros (aka empty spaces)
    for row in grid:
        if 0 in row:
            return False
        
    # Checks to make sure the grid is valid
    if check_grid(grid) == False:
        return False
            
    return True


def solve_sudoku(grid):
    """
    Uses recursion to solve a sudoku puzzle (fill in a 9x9 grid in a way that every row, column, and 3x3 box
    contains exactly one of each whole number 1 - 9)
    """

    # Base case: if it's a sudoku then True is returned along with the solved grid
    if check_sudoku(grid) == True:
        return grid, True
    
    # Checks to make sure the grid is still valid; if not False is returned alongside the grid
    valid = check_grid(grid)
    if valid == False:
        return grid, False

    # Looks for any zeros (empty spaces) in the grid. Once one is found the loop is exited
    for i in range(len(grid)):
        if 0 in grid[i]:
            j = grid[i].index(0)
            break

    # Recursive case: Begins plugging numbers into the empty space. The function calls itself, and if False is 
    # returned we try a new number. Otherwise we exit the loop. 
    for num in range(1, 10):
        grid[i][j] = num
        return_val = solve_sudoku(grid)
        grid = return_val[0]
        boolean = return_val[1]

        if boolean == False:
            grid[i][j] = 0
        else:
            break

    if boolean == False:
        return grid, False
    
    return grid, True

                      
def print_grid(grid):
    """
    Prints a grid in a much more readable format
    """
    for line in grid:
        for num in line:
            print(num, end="  ")
        print()


def main():
    grid = []
    for i in range(9):
        row = input(f"Please enter the {i + 1} row in the sudoku grid entering zero for any empty spaces, and be sure to include a space in between each number. If you would like to use the test grid, please type TEST: \n")
        print()
        if row.strip().upper() == "TEST":
            grid = [[3, 0, 6, 5, 0, 8, 4, 0, 0],
                    [5, 2, 0, 0, 0, 0, 0, 0, 0],
                    [0, 8, 7, 0, 0, 0, 0, 3, 1],
                    [0, 0, 3, 0, 1, 0, 0, 8, 0],
                    [9, 0, 0, 8, 6, 3, 0, 0, 5],
                    [0, 5, 0, 0, 9, 0, 6, 0, 0],
                    [1, 3, 0, 0, 0, 0, 2, 5, 0],
                    [0, 0, 0, 0, 0, 0, 0, 7, 4],
                    [0, 0, 5, 2, 0, 6, 3, 0, 0]]
            print("\nusing test grid: here is the grid that will be used - ")
            print_grid(grid)
            print()
            break


        row = row.strip()
        row = row.split()
        for j, num in enumerate(row):
            row[j] = int(num)
            
        grid.append(row)
        
    new_grid = (solve_sudoku(grid)[0])
    print("Here is the solution -")
    print_grid(new_grid)

if __name__ == "__main__":       
    main()