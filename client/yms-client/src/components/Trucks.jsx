import {useState, useEffect} from 'react';
import Loader from '../ui/Loader';
import axios from 'axios';
import Spinner from './Spinner';
import LinkButton from '../ui/LinkButton';
import { setTruckIDs, setSelectedTruck, getTruckIDs, getOrg, getSelectedTruck } from '../features/truck/truckSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../ui/Button';
// import { getTruckList } from '../../../../../server/db/handler.js';

function Trucks() {
  const [isLoading, setIsLoading] = useState(false);
  // const [selectedTruck, setSelectedTruck] = useState('')
  // const [truckIDs, setTruckIDs] = useState([])
  const [error, setError] = useState('')
  const trucks = useSelector((state) => state.truck.truckIDs)
  
  const orgCode = useSelector((state) => state.user.orgCode)
  const dispatch = useDispatch()
  const navigate = useNavigate()


  useEffect(() => {
    let array = [];
    setIsLoading(true);
    async function truckList() {
      try {
        setError("");
        const response = await axios.get(`http://localhost:8080/api/trucks?org_code=${orgCode}`)
        const {data} = response;
        for (let i = 0; i < data.length; i++) {
          const truckID = data[i]
          array.push(truckID)
        }
        console.log('array', array)
        dispatch(setTruckIDs(array))        
      } catch (err) {
        console.log('there was an error getting truck IDs', err.message)
        setError(err)
      } finally {
        setIsLoading(false)
      }
      }

      truckList();

  }, [])

  console.log('trucks',trucks)

  function handleSelection(e) {
    dispatch(setSelectedTruck(e))
  }

  function handleClick() {
    navigate('/')
  }

  return (
    <div className='text-center'>
      <div>
      <button className='inline-block text-sm rounded-full bg-blue-500 font-semibold uppercase tracking-wide text-stone-100 transition-colors duration-300 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-400 focus:ring-offset-2 disabled:cursor-not-allowed  px-4 py-3 sm:px-6 sm:py-4' onClick={handleClick}>Back to home</button>
      </div>
      {/* <LinkButton to='/'>&larr; Go Back</LinkButton> */}
      {isLoading && <Loader text={'Truck IDs'} />}
      <h1 className='text-center'>Truck Selection</h1>
      {!isLoading && (
        <select className='text-center appearance-none bg-gray-50' value='' onChange={e => handleSelection(e.target.value)} >
          {/* <option value="">Please select a truck ID</option> */}
          {trucks.map((truck, index) => (
            <option value={truck} key={index}>{truck}</option>
          ))}
        </select>
      )}
    </div>
  )
};

export default Trucks