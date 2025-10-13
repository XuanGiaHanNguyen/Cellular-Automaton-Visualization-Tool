import { BrowserRouter, Routes, Route } from "react-router-dom"
import Model from "./pages/Model"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Model/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
