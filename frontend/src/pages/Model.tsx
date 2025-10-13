import { useState, useRef, useEffect } from "react"
import { Upload, Loader2 } from "lucide-react"

function Model() {
  const [grid, setGrid] = useState<boolean[][]>(() => 
    Array(100).fill(null).map(() => Array(100).fill(false))
  )
  const [isRunning, setIsRunning] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const animationRef = useRef<number>(null)
  
  const GRID_SIZE = 100
  const CELL_SIZE = 10

  // Draw grid on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = '#fafafa'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        ctx.fillStyle = cell ? '#000000' : '#ffffff'
        ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        
        // Grid lines
        ctx.strokeStyle = '#e5e5e5'
        ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE)
      })
    })
  }, [grid])

  // Conway's Game of Life rules
  const getNextGeneration = (currentGrid: boolean[][]) => {
    const newGrid = currentGrid.map((row, i) => 
      row.map((cell, j) => {
        let neighbors = 0
        for (let di = -1; di <= 1; di++) {
          for (let dj = -1; dj <= 1; dj++) {
            if (di === 0 && dj === 0) continue
            const ni = (i + di + GRID_SIZE) % GRID_SIZE
            const nj = (j + dj + GRID_SIZE) % GRID_SIZE
            if (currentGrid[ni][nj]) neighbors++
          }
        }
        
        if (cell) {
          return neighbors === 2 || neighbors === 3
        } else {
          return neighbors === 3
        }
      })
    )
    return newGrid
  }

  // Animation loop
  useEffect(() => {
    if (!isRunning) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      return
    }

    let lastTime = 0
    const fps = 10

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= 1000 / fps) {
        setGrid(prevGrid => getNextGeneration(prevGrid))
        lastTime = currentTime
      }
      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning])

  const handleFileUpload = async (file: File) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", file)

    try {
      const response = await fetch("http://localhost:8080/pixelate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)

      // Load the pixelated image and convert to grid
      const img = new Image()
      img.onload = () => {
        const tempCanvas = document.createElement('canvas')
        tempCanvas.width = GRID_SIZE
        tempCanvas.height = GRID_SIZE
        const tempCtx = tempCanvas.getContext('2d')
        
        if (tempCtx) {
          // Draw image scaled to grid size
          tempCtx.drawImage(img, 0, 0, GRID_SIZE, GRID_SIZE)
          const imageData = tempCtx.getImageData(0, 0, GRID_SIZE, GRID_SIZE)
          
          // Convert to boolean grid (black = alive, white = dead)
          const newGrid = Array(GRID_SIZE).fill(null).map(() => 
            Array(GRID_SIZE).fill(false)
          )
          
          for (let i = 0; i < GRID_SIZE; i++) {
            for (let j = 0; j < GRID_SIZE; j++) {
              const index = (i * GRID_SIZE + j) * 4
              const r = imageData.data[index]
              const g = imageData.data[index + 1]
              const b = imageData.data[index + 2]
              const brightness = (r + g + b) / 3
              
              // Black pixels (low brightness) = alive cells
              newGrid[i][j] = brightness < 128
            }
          }
          
          setGrid(newGrid)
        }
        
        // Clean up the blob URL
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleStart = () => {
    setIsRunning(true)
  }

  const handleStop = () => {
    setIsRunning(false)
  }

  const handleClearPatterns = () => {
    const emptyGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(false)
    )
    setGrid(emptyGrid)
    setIsRunning(false)
  }

  const handleResetGrid = () => {
    const randomGrid = Array(GRID_SIZE).fill(null).map(() => 
      Array(GRID_SIZE).fill(null).map(() => Math.random() > 0.7)
    )
    setGrid(randomGrid)
    setIsRunning(false)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isRunning) return
    
    const canvas = canvasRef.current
    if (!canvas) return
    
    const rect = canvas.getBoundingClientRect()
    const x = Math.floor((e.clientX - rect.left) / CELL_SIZE)
    const y = Math.floor((e.clientY - rect.top) / CELL_SIZE)
    
    if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
      const newGrid = grid.map((row, i) => 
        row.map((cell, j) => (i === y && j === x) ? !cell : cell)
      )
      setGrid(newGrid)
    }
  }

  return (
    <div className="flex flex-row">
      {/* Left Visualization Area */}
      <div className="flex-[2.5] h-screen bg-neutral-50 border-r border-gray-200 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={GRID_SIZE * CELL_SIZE}
          height={GRID_SIZE * CELL_SIZE}
          className="border border-gray-300 shadow-lg cursor-pointer"
          onClick={handleCanvasClick}
        />
      </div>

      {/* Right Control Panel */}
      <div className="flex-1 h-screen bg-white border-l border-gray-200 overflow-y-auto">
        <h1 className="text-3xl font-black text-center mx-10 py-8 pt-13 text-gray-800 border-gray-200">
          Cellular Automaton Visualizer
        </h1>

        {/* Error Message */}
        {error && (
          <div className="mx-7 mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-red-700 text-sm">{error}</p>
          </div>
        )}

        {/* Upload Section */}
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

        {/* Start / Stop Controls */}
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
        <div className="mx-7 mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
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