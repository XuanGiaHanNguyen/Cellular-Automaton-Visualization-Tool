import { Upload, X, FileIcon } from "lucide-react"

function FileInput() {

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-50">
      <div className="bg-white shadow-md rounded-xl w-full max-w-md overflow-hidden">

        {/* Form */}
        <form className="p-6 space-y-4">
          {/* Drag and Drop Box */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
            <input type="file" id="file-upload" className="hidden" />
            <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-10 h-10 text-gray-400" />
              <div>
                <p className="text-sm font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">Any file type supported</p>
              </div>
            </label>
          </div>

          {/* Selected File Display (placeholder UI) */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <FileIcon className="w-8 h-8 text-gray-400 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">example_file.txt</p>
              <p className="text-xs text-gray-500">1.2 MB</p>
            </div>
            <button
              type="button"
              className="p-1 rounded hover:bg-gray-200 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Upload Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg text-white font-medium bg-gray-400 transition"
          >
            Upload File
          </button>
        </form>
      </div>
    </div>
  )
}

export default FileInput
