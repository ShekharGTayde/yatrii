import React from 'react'

const LookingForDriver = (props) => {
    const fareData = props.fare?.data ?? {};
    return (
        <div>
            <h5 className='p-1 text-center w-[93%] absolute top-0' onClick={() => {
                props.setDriverFound(false)
               
            }}><i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i></h5>
            <h3 className='font-bold text-2xl'>Looking For a Driver</h3>


            <div className='flex gap-2 justify-between flex-col items-center mt-3'>
            <img className="h-20" src={`/${props.vehicleType}.jpg`} alt="" />
                <div className='w-full mt-5'>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="ri-map-pin-user-fill"></i>
                        <div>
                            {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
                            <p className='text-base font-medium -mt-1 text-gray-600'>{props.pickup}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3 border-b-2'>
                        <i className="text-lg ri-map-pin-2-fill"></i>
                        <div>
                         {/* <h3 className='text-lg font-medium'>562/11-A</h3> */}
                         <p className='text-base font-medium -mt-1 text-gray-600'>{props.destination}</p>
                        </div>
                    </div>
                    <div className='flex items-center gap-5 p-3'>
                        <i className="ri-currency-line"></i>
                        <div>
                        <h3 className='text-lg font-medium'>₹{fareData[ props.vehicleType ]}</h3>
                            <p className='text-sm -mt-1 text-gray-600'>Cash</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LookingForDriver
