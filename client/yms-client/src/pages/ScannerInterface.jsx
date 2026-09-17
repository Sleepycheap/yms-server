import { useDispatch, useSelector } from "react-redux"
import ScanTruckBarcode from "../components/ScanTruckBarcode"
import { useNavigate } from "react-router-dom"
import { setScannedObject } from "../features/pictures/pictureSlice"


function ScannerInterface() {
  const navigate = useNavigate()
  const scannedContainer = useSelector((state) => state.picture.scannedContainer)

  const dispatch = useDispatch()

  function handleClick() {
    const org_code = scannedContainer.split('|')[0]
    const order_number = scannedContainer.split('|')[1].split('|')[0]
    const cont_name = scannedContainer.split('|')[2]
    dispatch(setScannedObject({org_code, order_number, cont_name}))
    navigate(-1)
  }
  

  return (<>
    <ScanTruckBarcode />
    {/* <button onClick={handleSubmit}>Submit</button> */}
    <button onClick={handleClick}>Go back</button> 
  </>
  )
}

export default ScannerInterface
