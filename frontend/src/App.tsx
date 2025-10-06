import { BrowserRouter, Routes, Route } from "react-router-dom"
import FileInput from "./pages/File"
import Model from "./pages/Model"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<FileInput/>}/>
        <Route path="/result" element={<Model/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
