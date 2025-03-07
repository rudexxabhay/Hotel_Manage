import {useState} from 'react'
import Home from './Home.jsx'
import Listings from './Lishtings.jsx'

const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from 'axios'
import { toast } from 'react-toastify'
function HomePage() {
  const [loding, setLoding] = useState(false);
  const [search, setSearch] = useState()
  
    const handleClick = async() =>{
      setLoding(true)
      try {
        const response = await axios.get(`${BASE_URL}/user/isowner`, { withCredentials: true })
        if(response.data.success){
          console.log(response.data.message)
         
          setLoding(false)
        }else{
          toast(response.data.message)
          setLoding(false)
        }
        
      } catch (error) {
        console.log(error.response)
      }
    }
  
  return (
    <>
    <Home handleClick={handleClick} loding={loding} searchItems={setSearch}/>
    <Listings search={search}/>
    </>
  )
}

export default HomePage