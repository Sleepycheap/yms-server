import { useSelector } from "react-redux"
import { Link } from "react-router-dom"


function TruckFooter({setFooter}) {
  const orgCode = useSelector((state) => state.user.orgCode)
  const selectedTruck = useSelector((state) => state.truck.selectedTruck)
  const orderNumber = useSelector((state) => state.order.orderNumber)
  
  function togglerFooter() {
    setFooter(false)
  }
  
  return (
    <div className="grid grid-flow-row grid-cols-3 items-center justify-between bg-blue-700 px-4 py-4 text-sm uppercase text-stone-200">
      <p className="space-x-2 flex">
        {/* <span>{orgCode}</span> */}
        <span>Truck ID: {selectedTruck}</span>
        <span>Order#: {orderNumber}</span>
      </p>
      <div className="col-start-3">
      <Link to='/load' onClick={togglerFooter} className="text-1xl hover:shadow-xl ">Next &rarr;</Link>
      </div>
    </div>
  )
}

export default TruckFooter


// org, orderNum, truckID/created truck