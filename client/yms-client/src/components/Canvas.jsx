import styles from './Canvas.module.css'
import {useRef, useEffect, useState} from 'react'
import { setCanvasElement } from '../features/refs/canvasSlice'
import { useDispatch, useSelector } from 'react-redux'

function Canvas() {
  const canvasRef = useRef(null)
  const canvasElement = useSelector((state) => state.canvas.canvasElement)
  const [isDrawing, setIsDrawing] = useState(false)
  const [previousCoords, setPreviousCoords] = useState(null)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setCanvasElement(canvasRef.current))
    console.log('canvas', canvasRef)
  }, [])

  const markCanvas = (event) => {
    if (!isDrawing) return;
    const rect = canvasElement.getBoundingClientRect();

    const coords = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    }

    const canvasContext = canvasElement.getContext('2d');
    canvasContext.beginPath();
    if (previousCoords) {
      canvasContext.moveTo(previousCoords.x, previousCoords.y);
      canvasContext.lineTo(coords.x, coords.y);
    }
    canvasContext.stroke();
    setPreviousCoords(coords);
}

  return (
    <div>
      <canvas ref={canvasRef} onMouseDown={() => setIsDrawing(true)}
        onMouseMove={(markCanvas)} onMouseUp={() => setIsDrawing(false)}/>
    </div>
  )
}

export default Canvas
