import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CaptainContextData } from '../Context/CaptainContext'
import axios from 'axios'

const CaptainLogin = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

const navigate = useNavigate()
const {captain,setCaptain} = useContext(CaptainContextData)

  const submitHandler = async(e) => {
    e.preventDefault()
   const newCaptain = {
      email: email,
      password: password
    }
    
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/captains/login`,newCaptain,{withCredentials:true})
    if (response.status===200) {
      const data = response.data.data
      setCaptain(data.captain)
      navigate('/captain-home')
    }

    setEmail('')
    setPassword('')
  }

  return (
    <div className='bg-white p-7 h-screen flex flex-col justify-between'>
      <div>
        <img className='w-40 -ml-6 mb-4' src="./driver-logo.png" alt="logo" />
        <form onSubmit={submitHandler}>
          <div className='bg-white '>

            <h3 className='text-lg font-medium mb-2'>What's your email</h3>
            <input type="email" required placeholder='email@example.com' autoComplete="current-email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' />

            <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
            <input type="password" required placeholder='password' autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
              }}
              className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' />

            <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
            >Login</button>

          </div>
        </form>
        <div className='bg-white '>
          <p className='text-center'>Join to fleet? <Link to='/captain-signup' className='text-blue-600'>Register as a Captain</Link> </p>
        </div>
        <Link to='/user-login'
          className='bg-[#d5622d] flex items-center justify-center text-white font-semibold mt-9 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>Sign in as a User</Link>
      </div>
    </div>
  )
}

export default CaptainLogin
CaptainLogin