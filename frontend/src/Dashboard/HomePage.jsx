import {useState} from 'react'
import Home from './Home.jsx'
import Listings from './Lishtings.jsx'
import Modal from './Model.jsx'
const BASE_URL = import.meta.env.VITE_BASE_URL;
import axios from 'axios'
import { toast } from 'react-toastify'
function HomePage() {
  const [loding, setLoding] = useState(false);
    const [state , setState] = useState(false);
  
    const handleClick = async() =>{
      setLoding(true)
      try {
        const response = await axios.get(`${BASE_URL}/user/isowner`, { withCredentials: true })
        if(response.data.success){
          console.log(response.data.message)
          setState(true)
          setLoding(false)
        }else{
          toast(response.data.message)
          setLoding(false)
        }
        
      } catch (error) {
        console.log(error.response)
      }
    }
    const [item, setItem] = useState([])
  return (
    <>
    <Home handleClick={handleClick} loding={loding}/>
    <Modal open={state} close={()=> setState(false)} item={setItem}/>
    <Listings item={item}/>
    </>
  )
}

export default HomePage