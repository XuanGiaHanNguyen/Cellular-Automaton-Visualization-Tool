import { Upload } from "lucide-react"

function FileInput() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm w-full max-w-md">

        {/* Upload Section */}
        <form className="p-6 space-y-6">
          {/* Drag and Drop Box */}
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition">
            <Upload className="w-10 h-10 text-gray-500 mb-3" />
            <p className="text-gray-700 font-medium text-lg">Drag and drop your file here</p>
            <p className="text-gray-400 text-sm">or</p>
            <button
              type="button"
              className="mt-3 border-2 border-gray-300 px-6 py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition"
            >
              Browse Files
            </button>
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
