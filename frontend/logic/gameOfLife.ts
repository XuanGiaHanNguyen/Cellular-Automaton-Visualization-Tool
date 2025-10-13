import { Grid } from "../src/types/grid"
import { GRID_SIZE } from "../src/constants/config"

// Counting living neighbors around a cell 
export const countNeighbors = (grid: Grid, row: number, col: number): number => {
    let neighbors = 0 
    // Check all 8 surrounding cells (toả độ x, y)
    for (let dx =-1; dx <= 1; dx ++){
        for(let dy = -1; dy<= 1; dy ++){
            if(dx === 0 && dy === 0) continue // skip the cell itself 
            const nx = (row + dx + GRID_SIZE) % GRID_SIZE  // Wrap vertically
            const ny = (col + dy + GRID_SIZE) % GRID_SIZE  // Wrap horizontally
            if (grid[nx][ny]) neighbors += 1 // if at (nx, ny), cell is true => +1 neighbor
        }
    }
    return neighbors
}

export const getNextGeneration = (currentGrid: Grid) => {
    return currentGrid.map(
        (row, i)=> 
            row.map((cell,j)=> {
                const neighbors = countNeighbors(currentGrid, i, j)
                if (cell) { // if the cell is alive 
                    return neighbors === 2 || neighbors === 3 // stay alive if 2 or 3 neighbor
                }else {
                    return neighbors === 3
                }
            })
    )
}
