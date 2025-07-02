import React, { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import FinishRide from '../Components/FinishRide'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'



const CaptainRiding = () => {

  const [FinishRidePanel, setFinishRidePanel] = useState(false)
  const [ride,setRide] = useState(null)

  const FinishRidePanelRef = useRef(null)
  
  const location = useLocation()

  useEffect(()=>{

    const rideData = location.state?.ride
    setRide(rideData)
    // console.log('rideData:',ride);
  },[ride])
  
  


  useGSAP(() => {
    if (FinishRidePanel) {
      gsap.to(FinishRidePanelRef.current, {
        transform: "translateY(0)"
      })
    } else {
      gsap.to(FinishRidePanelRef.current, {
        transform: "translateY(100%)"
      })
    }
  }, [FinishRidePanel])

  return (
    <div className='h-screen fixed'>
      <div className='flex justify-between items-center '>
        <img className='w-40 absolute  top-2' src="./driver-logo.png" alt="logo" />
        <div>
          <Link to='/captain-home' className='fixed h-18 w-18 bg-white rounded-full text-2xl p-2 font-medium flex justify-center items-center right-2 top-2'>
            <i className="ri-logout-box-r-line"></i>
          </Link>
        </div>
      </div>
      <div className="w-full h-[80%]">
        <img className="w-full h-full object-cover" src="/map.png" alt="Map" />
      </div>
      <div
        onClick={() => { setFinishRidePanel(true) }}
        className='w-full h-[20%] bg-yellow-400 fixed'>
        <h5 className='p-1 text-center w-[100%] absolute top-0'
        ><i className="text-3xl text-gray-200 ri-arrow-up-wide-line"></i></h5>
        <div className='flex justify-evenly items-center mt-8 p-5 '>
          <h3 className='font-medium'>4 km away</h3>
          <button className='flex justify-center text-white text-lg font-semibold p-2 bg-green-400 rounded-lg  w-[55%]'>complete ride</button>
        </div>
      </div>
      <div ref={FinishRidePanelRef}
        className='fixed w-[100%] translate-y-full bottom-0  bg-white p-5 pt-9 pb-5 '>
        <FinishRide
          setFinishRidePanel={setFinishRidePanel}
          ride={ride}
          setRide={setRide} 
          />
      </div>
    
    </div>
  )
}

export default CaptainRiding
