import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateOrgCode } from "../user/userSlice";

const url = 'http://localhost:8080/api';

function OrgCodeSelector() {
  const [orgCodes, setOrgCodes] = useState('');
  const [selectedOrg, setSelectedOrg] = useState('');
  const dispatch = useDispatch();

  
  useEffect(() => {
    async function getOrgCodes() {
      const response = await axios.get(`${url}/orgcodes`);
      const {data} = response;
      setOrgCodes(data)
    }
    
    getOrgCodes()
  }, [])

  function handleSelection(e) {
    dispatch(updateOrgCode(selectedOrg))
  }
  
  return (
    <div>
    <select value={selectedOrg} onChange={e => handleSelection(e.target.value)} className="justify-self-center  text-center h-auto w-200 text-3xl appearance-none row-start-3 bg-stone-200">
      <option value="">Please select an Organization</option>
      {orgCodes.map((code) => (
        <option value={code} key={code}>{code}</option>
        ))}
    </select>
    </div>
  )

}