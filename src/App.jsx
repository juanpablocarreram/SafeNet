import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Monitoreo from "./pages/Monitoreo";
import Chatbot from "./pages/Chatbot"
import Estudios from "./pages/Estudios"
import Header from "./components/Header"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Monitoreo />}/>
        <Route path="/chatbot" element={<Chatbot />}/>
        <Route path="/estudios" element={<Estudios />}/>
      </Routes>
    </>
  )
}

export default App
