import { useLoaderData } from "react-router-dom"
import {getTrucks} from '../../utils/apiFunctions'

let orgcode = ''

function TruckIDs() {
  const trucks = useLoaderData()
  console.log('trucks', trucks)
  return (
    <div>
      Trucks
    </div>
  )
}

export default TruckIDs

// export async function loader({params}) {
//   const {orgcode} = params;
//   const trucks = await getTrucks(orgcode)
//   return trucks
// }
