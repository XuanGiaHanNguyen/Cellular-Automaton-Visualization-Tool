import { Upload } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type {ChangeEvent, DragEvent} from "react"

function FileInput() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string |null>(null)
  const [isDragging, setIsDragging] = useState(false)
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

  const handleSubmit = () => {
    if (!file) {
      alert("Please upload an image first.")
      return
    }

    const formData = new FormData()
    formData.append("image", file)

    console.log("Uploading:", file.name)
    // fetch("/upload", { method: "POST", body: formData }) ...
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

    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md">

        {/* Upload Section */}
        <div className="p-6 space-y-6">
          {/* Drag and Drop Box */}
          <div 
            className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {preview ? (
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

          {/* Submit Button */}
          <div className="flex justify-center flex-col gap-2">
            
            {preview ? (
              <>
              <button
              type="button"
              onClick={()=> {setPreview(null); setFile(null)}}
              className="border-2 border-gray-300 text-lg py-2 rounded-lg w-full text-gray-700 hover:bg-neutral-100 transition"
            >
              Pick another image
            </button>
              <button
              type="button"
              onClick={handleSubmit}
              className="border-2 border-gray-300 text-lg py-2 rounded-lg w-full text-gray-700 hover:bg-neutral-100 transition"
            >
              Upload
            </button>
              </>
            ) : (
              <button
              type="button"
              onClick={handleSubmit}
              className="border-2 border-gray-300 text-lg py-2 rounded-lg w-full text-gray-700 hover:bg-neutral-100 transition"
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