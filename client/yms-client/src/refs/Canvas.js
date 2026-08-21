import { useEffect, useRef, useState } from "react";

function Canvas() {
  const canvasRef = useRef(null)
  const [canvasElement, setCanvasElement] = useState(null)

  useEffect(() => {
    setCanvasElement(canvasRef.current)
  },[])

  return (
    <canvas ref={canvasRef} />
  )
}

export default Canvas
