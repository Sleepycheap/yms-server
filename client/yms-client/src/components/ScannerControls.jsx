import { BarcodeScanner, useStreamState, useTorch } from "react-barcode-scanner"

function ScannerControls() {
  const [stream] = useStreamState()
  const {isTorchSupported, isTorchOn, setIsTorchOn} = useTorch()
  return (
        <div style={{ marginTop: '10px' }}>
      <button 
        disabled={!stream || !isTorchSupported} 
        onClick={() => setIsTorchOn(!isTorchOn)}
        style={{
          padding: '10px 20px',
          backgroundColor: isTorchOn ? '#ffcc00' : '#007bff',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Torch: {isTorchOn ? 'ON' : 'OFF'}
      </button>
    </div>
  )
}

export default ScannerControls
