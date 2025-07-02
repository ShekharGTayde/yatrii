import axios from 'axios'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'


const ConfirmRidePopUp =  (props) => {

    const [otp, setOtp] = useState('')
    const navigate = useNavigate()

    const submitHandler =  async(e) => {
       try {
         e.preventDefault()
 
         const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/start-ride`, {
             params: {
                 rideId: props.ride._id,
                 otp: otp
             }
             
         },{withCredentials:true})

        //  console.log('response:',response);
         
 
         if (response.status === 200) {
             props.setConfirmRidePopUpPanel(false)
             props.setRidePopUpPanel(false)
             navigate('/captain-riding', { state: { ride: props.ride } })
         }
       } catch (error) {
        console.error(error)
       }
    }

    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setConfirmRidePopUpPanel(false)

            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='font-bold text-2xl'>New Ride Available</h3>
            <div className='flex justify-between items-center gap-3 mt-5 w-[93%] bg-green-400 rounded-lg p-3 '>
                <div className='flex justify-between items-center gap-3'>
                    <img className='size-16 object-cover rounded-full' src="/user.jpg" alt="" />
                    <h3 className='text-xl font-medium'>{props.ride?.user.userName}</h3>
                </div>
                <h4 className='text-lg font-semibold'>2.2 KM</h4>
            </div>

            <div className='flex gap-2 justify-between flex-col items-center '>

                <div className='w-full mt-3'>
                    <div className='flex items-center gap-5 p-3 border-b-2 w-[93%]'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
                            <p className='text-base font-medium -mt-1 text-gray-600'>{props.ride?.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2 w-[93%]'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                            {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
                            <p className='text-base font-medium -mt-1 text-gray-600'>{props.ride?.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                            <h3 className='text-lg font-medium'>₹{props.ride?.fare}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>
                    <div className='flex flex-col w-full'>
                        <form onSubmit={ submitHandler } className='w-full'>
                            <input value={otp} onChange={(e) => { setOtp(e.target.value) }} type="number" placeholder='Enter OTP' className='flex border-2 justify-center text-xl bg-gray-100 items-center font-semibold p-2 rounded-lg m-2 w-[92%]' />
                            <button  className='flex justify-center text-xl font-semibold p-2 bg-green-400 rounded-lg m-2 w-[92%]'>Confirm </button>
                            <button type='button' onClick={() => { props.setConfirmRidePopUpPanel(false), props.setRidePopUpPanel(false) }} className='flex justify-center text-xl font-semibold p-2 bg-red-400 rounded-lg m-2 w-[92%]'>Cancel </button>
                        </form>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ConfirmRidePopUp
