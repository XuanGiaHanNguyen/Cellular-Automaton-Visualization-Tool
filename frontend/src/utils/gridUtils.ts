// Manage creating and manuplating the map/ grid 
import {GRID_SIZE, RANDOM_PROBABILITY} from "../constants/config"
import type { Grid } from "../types/grid"

export const createEmptyGrid = (): Grid => {
    return Array(GRID_SIZE).fill(null).map(()=> Array(GRID_SIZE).fill(false))
}

export const createRandomGrid = (aliveProbability: number = RANDOM_PROBABILITY): Grid => {
    return Array(GRID_SIZE).fill(null).map(
        ()=> Array(GRID_SIZE).fill(null).map(()=> Math.random() < aliveProbability )
    )
}

export const toggleCell = (grid: Grid, row: number, col: number ): Grid => {
    return grid.map((rowArr, i)=> 
        rowArr.map((cell, j)=> (i === row && j == col) ? !cell: cell)
    )
}