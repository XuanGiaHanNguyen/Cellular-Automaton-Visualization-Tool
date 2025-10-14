// Handle all the canvas drawing operation 
import { GRID_SIZE } from "../constants/config"
import type { Grid } from "../types/grid"

export const drawGrid = (Canvas: HTMLCanvasElement, grid: Grid) : void => {
    const ctx = Canvas.getContext('2d')
    if (!ctx) return 

    // Get container size for responsive rendering 
    const container = Canvas.parentElement
    if (!container) return 

    const containerWidth = container.clientWidth
    const containterHeight = container.clientHeight

    const cellWidth = containerWidth / GRID_SIZE
    const cellHeight = containterHeight / GRID_SIZE
    
    Canvas.width = containerWidth
    Canvas.height = containterHeight

    // Store cell dimensions on canvas for click handling 
    ;(Canvas as any).cellWidth = cellWidth
    ;(Canvas as any).cellHeight = cellHeight

    // Clearing background 
    ctx.fillStyle= '#fafafa'
    ctx.fillRect(0,0,Canvas.width, Canvas.height)

    // Draw each cell 
    grid.forEach((row, i) => {
        row.forEach((cell, j) => {
            ctx.fillStyle = cell ? '#000000' : '#ffffff'
            ctx.fillRect(j*cellWidth, i *cellHeight, cellWidth, cellHeight)
            
            ctx.strokeStyle = '#e5e5e5'
            ctx.strokeRect(j*cellWidth, i *cellHeight, cellWidth, cellHeight)
        }
    )})
}