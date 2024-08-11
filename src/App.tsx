import { useState } from 'react'
import './App.css'
import CameraCapture from './camera'

function App() {
  const [count, setCount] = useState(0)

  return (
 
      <CameraCapture />
  
  )
}

export default App
