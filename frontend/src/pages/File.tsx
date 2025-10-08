import { Upload } from "lucide-react"
import { useState } from "react"
import type {ChangeEvent, DragEvent} from "react"

function FileInput() {
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string |null>(null)

  const HandleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile && selectedFile.type.startsWith("image/")) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
    } else {
      alert("Please select a valid image file (png, jpg, jpeg, etc.)")
    }
  }

  // Handle drag and drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile)
      setPreview(URL.createObjectURL(droppedFile))
    } else {
      alert("Please drop a valid image file")
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  // Handle form submit (you can send file to backend here)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      alert("Please upload an image first.")
      return
    }

    // Example: send to backend using FormData
    const formData = new FormData()
    formData.append("image", file)

    console.log("Uploading:", file.name)
    // fetch("/upload", { method: "POST", body: formData }) ...
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md">

        {/* Upload Section */}
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
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
                className="max-h-60 rounded-lg object-contain"
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
          <div className="flex justify-center">
            <button
              type="submit"
              className="border-2 border-gray-300 w-80 text-lg py-2 rounded-lg w-full text-gray-700 hover:bg-neutral-100 transition"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default FileInput
