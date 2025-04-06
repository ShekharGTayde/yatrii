import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserContextData } from '../Context/UserContext'
import axios from 'axios'


const UserSignup = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')


  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContextData)

  const submitHandler = async (e) => {
    e.preventDefault()
    const userData = {
      userName: userName,
      email: email,
      password: password
    }

    try {

      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/users/register`, userData, { withCredentials: true })
      if (response.status === 200) {
        const data = response.data.data
        // console.log(data.user);
        setUser(data.user)
        if (user) {
          localStorage.setItem('user', JSON.stringify(data.user))
          // console.log("localstorage set", data.user);
        }
        navigate('/user-login')
      }

      setUserName('')
      setEmail('')
      setPassword('')


    } catch (error) {
      console.error('Signup Error:', error?.response?.data?.message || 'Something went wrong');
      alert(error?.response?.data?.message || 'Signup failed. Try again!');
    }
  }
  return (
    <div>
      <div className='bg-white p-7 h-screen flex flex-col justify-between'>
        <div>
          <img className='w-20 ml-2 mb-8' src="./logo.png" alt="logo" />
          <form onSubmit={(e) => {
            submitHandler(e)
          }}>
            <div className='bg-white '>

              <h3 className='text-lg font-medium mb-2'>What's your name</h3>
              <div className='flex '>
                <input type="text" required placeholder='user name'
                  value={userName}
                  onChange={(e) => {
                    setUserName(e.target.value)
                  }}
                  className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' />


              </div>

              <h3 className='text-lg font-medium mb-2'>What's your email</h3>
              <input type="email" required placeholder='email@example.com'
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
                className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' />

              <h3 className='text-lg font-medium mb-2'>Enter Password</h3>
              <input type="password" required placeholder='password'
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
                className='bg-[#eeeeee] mb-7 rounded-lg px-4 py-2 border w-full text-lg placeholder:text-base' />

              <button className='bg-[#111] text-white font-semibold mb-3 rounded-lg px-4 py-2 w-full text-lg placeholder:text-base'
              >Register</button>

            </div>
          </form>
          <div className='bg-white '>
            <p className='text-center'>Allready Existed? <Link to='/user-login' className='text-blue-600'>Login</Link> </p>
          </div>
          <div>
            <p className='text-[10px] leading-tight mt-28'>This site is protected by reCAPTCHA and the <span className='underline'>Google Privacy
              Policy</span> and <span className='underline'>Terms of Service apply</span>.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserSignup
