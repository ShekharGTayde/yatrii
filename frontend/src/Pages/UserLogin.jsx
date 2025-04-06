import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContextData } from '../Context/UserContext'
import axios from 'axios'
import apiError from '../../../Backend/utils/apiError'

const UserLogin = () => {

  
 const [email,setEmail] = useState('')
 const [password,setPassword] = useState('')
//  const [userData,setUserdata] = useState({ })

 const navigate = useNavigate()
 const {setUser} = useContext(UserContextData)
 
 const submitHandler = async(e) =>{
 e.preventDefault()
 const userData=({
   email:email,
   password:password
  })


  //always use cookies for storing jwt tokens
  try {
    const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/login`,
      userData,
      {withCredentials:true})


    if (response.status===200) {
      const data = response.data.data
      setUser(data.user)
     navigate('/home')
    }

    setEmail('')
    setPassword('')
  } catch (error) {
   throw new apiError(400,'Loggin Failed:',error)    
  }
}

  return (
    <div className='bg-white p-7 h-screen flex flex-col justify-between'>
    <div>
       <img className='w-20 ml-2 mb-8' src="./logo.png" alt="logo" />
    <form onSubmit={(e)=>{
      submitHandler(e)
    }}>
      <div className='bg-white '>

        <h3 className='text-lg font-medium mb-2'>What's your email</h3>
        <input type="email" required placeholder='email@example.com' 
        value={email}
        onChange={(e)=>{
          setEmail(e.target.value)
        }}
        className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'/>

        <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
        <input type="password" required placeholder='password'
        value={password}
        onChange={(e)=>{
          setPassword(e.target.value)
        }}
         className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base'/>

        <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
          >Login</button>
          
      </div>
     </form>
      <div className='bg-white '>
        <p className='text-center'>New Here? <Link to='/user-signup' className='text-blue-600'>Create New Account</Link> </p>
      </div>
      <Link to='/captain-login' 
            className='bg-[#10b461] flex items-center justify-center text-white font-semibold mt-9 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'>Sign in as a Captain</Link>
    </div>
    </div>
  )
}

export default UserLogin
