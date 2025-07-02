
import React from 'react'

const RidePopUp = (props) => {



  return (
    <div>
       <h5 className='p-1 text-center w-[93%] absolute top-0' 
            onClick={() => {
                props.setRidePopUpPanel(false)

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
                    <button onClick={()=>{props.setConfirmRidePopUpPanel(true),props.setRidePopUpPanel(false), props.confirmRide();}} className='text-xl font-semibold p-2 bg-green-400 rounded-lg m-2 w-[92%]'>Accept</button>
                    <button onClick={()=>{props.setRidePopUpPanel(false)}} className='text-xl font-semibold p-2 bg-gray-200 text-gray-600 rounded-lg m-2 w-[92%]'>Ignore</button>
                </div>
            </div>
    </div>
  )
}

export default RidePopUp
