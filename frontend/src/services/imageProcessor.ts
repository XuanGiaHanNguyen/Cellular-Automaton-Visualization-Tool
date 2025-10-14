// Converts an image to a boolean grid based on pixel brightness
import type { Grid } from "../types/grid"
import { GRID_SIZE, BRIGHTNESS_THRESHOLD } from "../constants/config"
import { createEmptyGrid } from "../utils/gridUtils"

export const imageToGrid = (img: HTMLImageElement): Grid => {
  // Create temporary canvas for image processing
  const tempCanvas = document.createElement('canvas')
  tempCanvas.width = GRID_SIZE
  tempCanvas.height = GRID_SIZE
  const tempCtx = tempCanvas.getContext('2d')
  
  if (!tempCtx) return createEmptyGrid()
  
  // Draw and scale image to grid dimensions
  tempCtx.drawImage(img, 0, 0, GRID_SIZE, GRID_SIZE)
  const imageData = tempCtx.getImageData(0, 0, GRID_SIZE, GRID_SIZE)
  
  // Initialize empty grid
  const newGrid: Grid = Array(GRID_SIZE).fill(null).map(() => 
    Array(GRID_SIZE).fill(false)
  )
  
  // Convert each pixel to alive/dead based on brightness
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const index = (i * GRID_SIZE + j) * 4  // RGBA = 4 values per pixel
      const r = imageData.data[index]        // Red channel
      const g = imageData.data[index + 1]    // Green channel
      const b = imageData.data[index + 2]    // Blue channel
      const brightness = (r + g + b) / 3     // Average brightness
      
      // Dark pixels (brightness < 128) become alive cells
      newGrid[i][j] = brightness < BRIGHTNESS_THRESHOLD
    }
  }
  
  return newGrid
}