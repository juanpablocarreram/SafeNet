import { useState } from 'react'
import { Route, Routes } from "react-router-dom"
import Monitoreo from "./pages/Monitoreo";
import Chatbot from "./pages/Chatbot"
import Denuncia from "./pages/Denuncia"
import Header from "./components/Header"

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Monitoreo />}/>
        <Route path="/chatbot" element={<Chatbot />}/>
        <Route path="/denuncia" element={<Denuncia />}/>
      </Routes>
    </>
  )
}

export default App
