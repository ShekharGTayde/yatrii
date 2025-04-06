import React from 'react'
import {Link} from 'react-router-dom'


const Start = () => {
  return (
    <div>
    <div className='bg-cover bg-[url(./bg.png)] w-full h-screen bg-red-400 flex flex-col justify-between pt-10 '>
        <img className='w-20 ml-8' src="./logo.png" alt="logo" />
        <div className='bg-white p-5 '>
            <h2 className='font-bold text-2xl'>Get Started with Uber</h2> 
            <Link to='/user-login' className='flex items-center justify-center bg-black text-white mt-2 p-5 w-full rounded-md font-semibold text-base'>Continue</Link>
        </div>
    </div>
    </div>
  )
}

export default Start
