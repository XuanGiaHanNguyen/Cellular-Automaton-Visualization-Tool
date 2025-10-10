import { Upload, Loader2 } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type {ChangeEvent, DragEvent} from "react"

function FileInput() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [processedImage, setProcessedImage] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dragCounter = useRef(0)

  useEffect(() => {
    const handleDragEnter = (e: globalThis.DragEvent) => {
      e.preventDefault()
      dragCounter.current++
      if (e.dataTransfer?.types.includes('Files')) {
        setIsDragging(true)
      }
    }
    
    const handleDragLeave = (e: globalThis.DragEvent) => {
      e.preventDefault()
      dragCounter.current--
      if (dragCounter.current === 0) {
        setIsDragging(false)
      }
    }
    
    const handleDragOver = (e: globalThis.DragEvent) => {
      e.preventDefault()
    }
    
    const handleDropAnywhere = (e: globalThis.DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setIsDragging(false)
      
      const droppedFile = e.dataTransfer?.files?.[0]
      if (droppedFile && droppedFile.type.startsWith("image/")) {
        setFile(droppedFile)
        setPreview(URL.createObjectURL(droppedFile))
        setProcessedImage(null)
        setError(null)
      } else if (droppedFile) {
        alert("Please drop a valid image file")
      }
    }

    window.addEventListener("dragenter", handleDragEnter)
    window.addEventListener("dragleave", handleDragLeave)
    window.addEventListener("dragover", handleDragOver)
    window.addEventListener("drop", handleDropAnywhere)

    return () => {
      window.removeEventListener("dragenter", handleDragEnter)
      window.removeEventListener("dragleave", handleDragLeave)
      window.removeEventListener("dragover", handleDragOver)
      window.removeEventListener("drop", handleDropAnywhere)
    }
  }, [])

  const HandleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setProcessedImage(null)
      setError(null)
    } else {
      alert("Please select a valid image file (png, jpg, jpeg, etc.)")
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleSubmit = async () => {
    if (!file) {
      alert("Please upload an image first.")
      return
    }

    setIsLoading(true)
    setError(null)

    const formData = new FormData()
    formData.append("image", file)

    try {
      // Call the Spring Boot backend API
      const response = await fetch("http://localhost:8080/pixelate", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      // Convert the response to a blob and create an object URL
      const blob = await response.blob()
      const imageUrl = URL.createObjectURL(blob)
      setProcessedImage(imageUrl)
      
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Failed to process image")
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setPreview(null)
    setFile(null)
    setProcessedImage(null)
    setError(null)
  }

  const handleDownload = () => {
    if (processedImage) {
      const link = document.createElement('a')
      link.href = processedImage
      link.download = `pixelated-${file?.name || 'image.png'}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
  <>
    <div
      className={`fixed inset-0 flex items-center justify-center bg-gray-700/60 z-50 transition-opacity duration-200 pointer-events-none ${
        isDragging ? "opacity-100" : "opacity-0"
      }`}
    >
      <p className="text-white text-6xl font-black font-semibold px-6 py-3">
        Drop image anywhere
      </p>
    </div>

    <div className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-2xl">

        {/* Upload Section */}
        <div className="p-6 space-y-6">
          {/* Drag and Drop Box */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {processedImage ? (
              <div className="w-full space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 text-center">Original</p>
                    <img
                      src={preview!}
                      alt="Original"
                      className="max-h-64 w-full rounded-lg object-contain border border-gray-200"
                    />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600 text-center">Pixelated</p>
                    <img
                      src={processedImage}
                      alt="Processed"
                      className="max-h-64 w-full rounded-lg object-contain border border-gray-200"
                    />
                  </div>
                </div>
              </div>
            ) : preview ? (
              <img
                src={preview}
                alt="Preview"
                className="max-h-80 rounded-lg object-contain"
              />
            ) : (
              <>
                <Upload className="w-10 h-10 text-gray-500 mb-3" />
                <p className="text-gray-700 font-medium text-lg">
                  Drag and drop your image here
                </p>
                <p className="text-gray-400 text-sm">or</p>
                <label className="mt-3 border-2 border-gray-300 px-6 py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition cursor-pointer">
                  Browse Files
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={HandleFileChange}
                  />
                </label>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center flex-col gap-2">
            {processedImage ? (
              <>
                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-blue-600 text-white text-lg py-2 rounded-lg w-full hover:bg-blue-700 transition font-medium"
                >
                  Download Pixelated Image
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="border-2 border-gray-300 text-lg py-2 rounded-lg w-full text-gray-700 hover:bg-neutral-100 transition"
                >
                  Process Another Image
                </button>
              </>
            ) : preview ? (
              <>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-blue-600 text-white text-lg py-2 rounded-lg w-full hover:bg-blue-700 transition font-medium disabled:bg-blue-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Pixelate Image"
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  disabled={isLoading}
                  className="border-2 border-gray-300 text-lg py-2 rounded-lg w-full text-gray-700 hover:bg-neutral-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Pick Another Image
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled
                className="border-2 border-gray-300 text-lg py-2 rounded-lg w-full text-gray-400 cursor-not-allowed"
              >
                Upload
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  </>
  )
}

export default FileInput