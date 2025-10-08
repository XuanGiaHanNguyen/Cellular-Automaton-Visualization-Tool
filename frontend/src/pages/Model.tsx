function Model() {
  return (
    <div className="flex flex-row">
      {/* Left Visualization Area */}
      <div className="flex-[2.5] h-screen bg-neutral-50 border-r border-gray-200">
        {/* Visualization Canvas Placeholder */}
      </div>

      {/* Right Control Panel */}
      <div className="flex-1 h-screen bg-white border-l border-gray-200">
        <h1 className="text-3xl font-black text-center mx-10 py-8 pt-13 text-gray-800 border-gray-200">
          Cellular Automation Visualizer
        </h1>

        {/* Upload Section */}
        <div className="flex flex-col items-center pb-4">
          <button className="border-2 text-lg border-gray-300 w-80 py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition">
            Upload File
          </button>
        </div>

        {/* Start / Stop Controls */}
        <div className="flex justify-center gap-4 px-7 pb-4">
          <button className="border-2 border-gray-300 px-14 py-2 text-lg rounded-lg text-gray-700 hover:bg-neutral-100 transition">
            Start
          </button>
          <button className="border-2 border-gray-300 px-14 py-2 text-lg rounded-lg text-gray-700 hover:bg-neutral-100 transition">
            Stop
          </button>
        </div>

        {/* Pattern Controls */}
        <div className="flex flex-col gap-4 items-center">
          <button className="border-2 border-gray-300 w-80 text-lg py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition">
            Clear Patterns
          </button>
          <button className="border-2 border-gray-300 w-80 text-lg py-2 rounded-lg text-gray-700 hover:bg-neutral-100 transition">
            Reset Grid
          </button>
        </div>
      </div>
    </div>
  )
}

export default Model
