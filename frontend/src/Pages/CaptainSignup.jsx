import axios from 'axios'
import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainContextData } from '../Context/CaptainContext'

const CaptainSignup = () => {

  const [captainName, setCaptainName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [vehicleColor, setVehicleColor] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [vehiclePlate, setVehiclePlate] = useState('')
  const [vehicleCapacity, setVehicleCapacity] = useState('')

 

  const navigate = useNavigate()
  const { captain, setCaptain } = useContext(CaptainContextData); // ✅ Access context correctly


  

  

  const submitHandler = async(e) => {
    e.preventDefault()
    const captainData = {
      captainName: captainName,
      email: email,
      password: password,
      vehicle: {
        color: vehicleColor,
        plate: vehiclePlate,
        vehicleType: vehicleType,
        capacity: vehicleCapacity
      },

    }
    
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/register`, captainData, { withCredentials: true });
      // console.log('API Response:', response.data); // Log the API response
      if (response.status === 200) {
        const data = response.data.data;
        // console.log('Captain Data:', data.captain); // Log the captain data
        setCaptain(data.captain);
      
        if (captain) {
          localStorage.setItem('captain', JSON.stringify(data.captain))
          console.log("localstorage set",data.captain);
          
        }
        navigate(`/captain-login`);
      }
      
      
      setCaptainName('')
      setEmail('')
      setPassword("")
      setVehicleColor('')
      setVehicleType('')
      setVehiclePlate('')
      setVehicleCapacity('')

    } catch (error) {
      console.error('ERROR:', error)
    }

}

  return (
    <div className='py-5 px-5 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-20 mb-3' src="https://www.svgrepo.com/show/505031/uber-driver.svg" alt="" />

        <form onSubmit={submitHandler} >

          <h3 className='text-base w-full  font-medium mb-2'>What's our Captain's name</h3>

          <input
            required
            className='bg-[#eeeeee] mb-5 w-full rounded-lg px-4 py-2 border  text-base placeholder:text-base'
            type="text"
            placeholder='captains name'
            value={captainName}
            onChange={(e) => {
              setCaptainName(e.target.value)
            }}
          />



          <h3 className='text-base font-medium mb-2'>What's our Captain's email</h3>
          <input
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
            className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-base placeholder:text-base'
            type="email"
            placeholder='email@example.com'
          />

          <h3 className='text-base font-medium mb-2'>Enter Password</h3>

          <input
            className='bg-[#eeeeee] mb-5 rounded-lg px-4 py-2 border w-full text-base placeholder:text-base'
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
            required type="password"
            placeholder='password'
          />

          <h3 className='text-base font-medium mb-2'>Vehicle Information</h3>
          <div className='flex gap-4 mb-5'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-base'
              type="text"
              placeholder='Vehicle Color'
              value={vehicleColor}
              onChange={(e) => {
                setVehicleColor(e.target.value)
              }}
            />
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-base'
              type="text"
              placeholder='Vehicle Plate'
              value={vehiclePlate}
              onChange={(e) => {
                setVehiclePlate(e.target.value)
              }}
            />
          </div>
          <div className='flex gap-4 mb-7'>
            <input
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-base'
              type="number"
              placeholder='Vehicle Capacity'
              value={vehicleCapacity}
              onChange={(e) => {
                setVehicleCapacity(e.target.value)
              }}
            />
            <select
              required
              className='bg-[#eeeeee] w-1/2 rounded-lg px-4 py-2 border text-base placeholder:text-base'
              value={vehicleType}
              onChange={(e) => {
                setVehicleType(e.target.value)
              }}
            >
              <option value="" disabled>Select Vehicle Type</option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="bike">bike</option>
            </select>
          </div>

          <button
            className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Create Captain Account</button>

        </form>
        <p className='text-center'>Already have a account? <Link to='/captain-login' className='text-blue-600'>Login here</Link></p>
      </div>

    </div>
  )
}


export default CaptainSignup
