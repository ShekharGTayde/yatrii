import React, { useContext } from 'react'
import {Link, useLocation, useNavigate} from 'react-router-dom'




const Riding = () => {

    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data

    const navigate = useNavigate()

    socket.on("ride-ended", () => {
        navigate('/home')
    })

    return (
        <div className='h-screen'>
            <Link to='/home' className='fixed h-18 w-18 bg-white rounded-full text-2xl p-2 font-medium flex justify-center items-center right-2 top-2'>
            <i className="ri-home-8-line"></i>
            </Link>
           
            <div className="w-full h-1/2 p-3">
                <div className='flex justify-between items-center'>
                    <img className='size-20 rounded-full ml-2' src="/driver.jpg" alt="" />
                    <div className='text-right'>
                        <h2 className='text-base font-medium'>{ride?.user.userName}</h2>
                        <h4 className='text-xl font-semibold'>{ride?.captain.vehicle.plate}</h4>
                        <p className='text-sm'>Mahindra Thar 4*4</p>
                    </div>
                </div>

                <div className='flex gap-1 justify-between flex-col items-center mt-2 '>

                    <div className='w-full mt-2'>
                        <div className='flex items-center gap-2 p-3 border-b-2'>
                            <i className="ri-map-pin-user-fill"></i>
                            <div>
                                {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
                                <p className='text-base font-medium -mt-1 text-gray-600'>{ride?.pickup}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 p-3 border-b-2'>
                            <i className="text-lg ri-map-pin-2-fill"></i>
                            <div>
                                {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
                                <p className='text-base font-medium -mt-1 text-gray-600'>{ride?.destination}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2 p-3'>
                            <i className="ri-currency-line"></i>
                            <div>
                                <h3 className='text-lg font-medium'>₹{ride?.fare}</h3>
                                <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                            </div>
                        </div>
                        <button className='text-xl font-semibold p-2 bg-green-400 rounded-lg m-3 w-[92%]'>Make a Payment</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

            export default Riding
