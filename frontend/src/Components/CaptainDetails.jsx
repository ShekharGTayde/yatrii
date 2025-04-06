import React, { useContext } from 'react'
import { CaptainContextData } from '../Context/CaptainContext';


const CaptainDetails = () => {
  const captain =  JSON.parse(  localStorage.getItem('captain'));
  // console.log('Captain from localStorage:', captain);
    
  // const {captain} = useContext(CaptainContextData)
  // console.log('captain from context',captain);
  
    if (!captain || !captain.captainName) {
      return <p>Loading captain details...</p>;
    }
    
  return (
    <div>
       <div className='flex p-3 justify-between text-center items-center gap-2 mt-4' >
                    <img className='size-20 rounded-full' src="/driver.jpg" alt="" />
                    <h4 className='text-xl font-semibold underline capitalize'>{captain?.captainName}</h4>
                    <div  >
                        <p className='text-xl font-bold'>₹455.60</p>
                        <p className='text-sm text-gray-600'>Earned</p>
                    </div>
                </div>
                <div className='flex  justify-between items-center p-4 mt-6 bg-gray-100 rounded-lg'>
                    <div className='text-center'>
                        <i className="text-3xl mb-3 font-thin ri-time-line"></i>
                        <h4 className='text-lg font-medium'>9.20</h4>
                        <p className='text-sm text-gray-600'>Hours</p>
                    </div>
                    <div className='text-center'>
                        <i className="text-3xl mb-3 font-thin ri-speed-up-line"></i>
                        <h4 className='text-lg font-medium'>92 km</h4>
                        <p className='text-sm text-gray-600'>Distance</p>
                    </div>
                    <div className='text-center'>
                        <i className="text-3xl mb-3 font-thin ri-booklet-line"></i>
                        <h4 className='text-lg font-medium'>9</h4>
                        <p className='text-sm text-gray-600'>Rides</p>
                    </div>
                </div>
    </div>
  )
}

export default CaptainDetails
