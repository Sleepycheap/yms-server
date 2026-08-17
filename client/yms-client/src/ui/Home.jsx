import { useEffect, useState } from "react"
import axios from 'axios'
import { getContext } from "@microsoft/power-apps/app";
// import { getOrgCodes } from "../../../../server/db/handler";

function Home() {
  const [orgCodes, setOrgCodes] = useState([])
  // const [name, setName] = useState('');

  useEffect(() => {
  async function getOrgCodes() {
    const response = await axios.get('http://localhost:8080/api/orgcodes');
    const {data} = response;
    setOrgCodes(data)
  }

  getOrgCodes()
  }, [])

     // This takes the name out of the user's email address and 
    //const nameFixed = userPrincipalName.split('@')[0].split('.').join(' ').toUpperCase()
  
  return (
    <div className="grid grid-rows-[auto-auto]">
      <h1 className="text-6xl text-center row-span-1 p-10">Welcome to the Yard Management System!</h1>
      <div className="row-start-2 p-10">
        <p className="text-center">Start by entering your organization code</p>
        {orgCodes}

      </div>
   
    </div>

  )
}

export default Home

