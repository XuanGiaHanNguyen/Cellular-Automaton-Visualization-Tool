import { useState, useRef, useEffect } from "react"
import { Upload, Loader2 } from "lucide-react"
import type { Grid } from "../types/grid"
import { createEmptyGrid, createRandomGrid, toggleCell } from '../utils/gridUtils'
import { getNextGeneration } from '../logic/gameOfLife'
import { drawGrid } from '../rendering/canvasRenderer'
import { imageToGrid } from '../services/imageProcessor'
import { uploadImageForPixelation } from '../services/api'
import { GRID_SIZE, FPS } from '../constants/config'


function Model() {
  const [grid, setGrid] = useState<Grid>(createEmptyGrid)
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState< string | null >(null)

  // ========== REFS ==========
  const canvasRef = useRef<HTMLCanvasElement>(null)           // Canvas element
  const fileInputRef = useRef<HTMLInputElement>(null)         // Hidden file input
  const animationRef = useRef<number | null>(null)            // Animation frame ID

  // ========== EFFECT: Redraw canvas when grid changes ==========
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    drawGrid(canvas, grid)
  }, [grid])

  // ========== EFFECT: Handle window resize ==========
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      drawGrid(canvas, grid)
    }
    
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [grid])

  // ========== EFFECT: Animation loop for simulation ==========
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    let lastTime = 0

    const animate = (currentTime: number) => {
      // Update at specified FPS rate
      if (currentTime - lastTime >= 1000 / FPS) {
        setGrid(prevGrid => getNextGeneration(prevGrid))
        lastTime = currentTime
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    // Cleanup when stopping or unmounting
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  // ========== HANDLER: Process uploaded image file ==========
  const handleFileUpload = async (file: File) => {
    // Validate file type
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      // Send to backend for pixelation
      const blob = await uploadImageForPixelation(file)
      const imageUrl = URL.createObjectURL(blob)

      // Load pixelated image
      const img = new Image()
      img.onload = () => {
        // Convert to grid and update state
        const newGrid = imageToGrid(img)
        setGrid(newGrid)
        
        // Clean up temporary URL
        URL.revokeObjectURL(imageUrl)
      }
      img.src = imageUrl
      
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setIsLoading(false)
    }
  }

  // ========== HANDLER: File input change ==========
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // ========== HANDLER: Start simulation ==========
  const handleStart = () => {
    setIsRunning(true)
  }

  // ========== HANDLER: Stop simulation ==========
  const handleStop = () => {
    setIsRunning(false)
  }

  // ========== HANDLER: Clear all cells ==========
  const handleClearPatterns = () => {
    setGrid(createEmptyGrid())
    setIsRunning(false)
  }

  // ========== HANDLER: Generate random pattern ==========
  const handleResetGrid = () => {
    setGrid(createRandomGrid())
    setIsRunning(false)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return  // Prevent editing during simulation
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Calculate clicked cell coordinates using canvas dimensions
    const rect = canvas.getBoundingClientRect()
    const cellWidth = rect.width / GRID_SIZE
    const cellHeight = rect.height / GRID_SIZE
    
    const x = Math.floor((e.clientX - rect.left) / cellWidth)
    const y = Math.floor((e.clientY - rect.top) / cellHeight)
    
    // Toggle cell if within grid bounds
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      setGrid(prevGrid => toggleCell(prevGrid, y, x))
    }
  }

  return (
    <div className="flex flex-row h-screen">
      {/* LEFT PANEL: Canvas Visualization */}
      <div className="flex-[2.5] bg-neutral-50 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          className="border border-gray-300 shadow-lg cursor-pointer max-w-full max-h-full"
          onClick={handleCanvasClick}
        />
      </div>

      {/* RIGHT PANEL: Control Interface */}
      <div className="w-96 bg-white border-l border-gray-200 overflow-y-auto">
        {/* Title */}
        <h1 className="text-3xl font-black text-center mx-10 py-8 pt-13 text-gray-800 border-gray-200">
          Cellular Automaton Visualizer
        </h1>

        {/* Error Display */}
        {error && (
          <div className="mx-7 mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Image Upload Button */}
        <div className="flex flex-col items-center pb-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="border-2 text-lg border-gray-300 w-80 py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Image
              </>
            )}
          </button>
        </div>

        {/* Start/Stop Controls */}
        <div className="flex justify-center gap-4 px-7 pb-4">
          <button
            onClick={handleStart}
            disabled={isRunning}
            className="border-2 border-gray-300 px-14 py-2 text-lg rounded-lg text-gray-700 hover:bg-neutral-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Start
          </button>
          <button
            onClick={handleStop}
            disabled={!isRunning}
            className="border-2 border-gray-300 px-14 py-2 text-lg rounded-lg text-gray-700 hover:bg-neutral-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            Stop
          </button>
        </div>

        {/* Pattern Controls */}
        <div className="flex flex-col gap-4 items-center">
          <button
            onClick={handleClearPatterns}
            className="border-2 border-gray-300 w-80 text-lg py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition"
          >
            Clear Patterns
          </button>
          <button
            onClick={handleResetGrid}
            className="border-2 border-gray-300 w-80 text-lg py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition"
          >
            Random Grid
          </button>
        </div>

        {/* Instructions */}
        <div className="mx-7 mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">How to use:</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• Upload an image to convert it to a cellular automaton</li>
            <li>• Click cells to toggle them on/off</li>
            <li>• Press Start to run Conway's Game of Life</li>
            <li>• Black pixels become alive cells</li>
          </ul>
        </div>
      </div>
    </div>
  )

}

export default Model