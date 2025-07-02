import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from "gsap";
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'
import { SocketContextData } from '../Context/SocketContext'
import axios from 'axios'
import FinishRide from '../Components/FinishRide'

const CaptainHome = () => {


    const [RidePopUpPanel, setRidePopUpPanel] = useState(false)
    const [ConfirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
    const [ride, setRide] = useState(null)
 

    const RidePopUpPanelRef = useRef(null)
    const ConfirmRidePopUpPanelRef = useRef(null)
    const CaptainDetailsPanelRef = useRef(null)
    const FinishRidePanelRef = useRef(null)

   
    const captain =  JSON.parse(  localStorage.getItem('captain'));
    const {socket} = useContext(SocketContextData)

    useEffect(()=>{
        socket.emit('join',{
            userId:captain?._id,
            userType:'captain'
        })

              const updateLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(position => {

                    socket.emit('update-location-captain', {
                        userId: captain._id,
                        location: {
                            ltd: position.coords.latitude,
                            lng: position.coords.longitude
                        }
                    })
                })
            }
        }

        const locationInterval = setInterval(updateLocation, 10000)
        updateLocation()
        //  return () => clearInterval(locationInterval)
    },[captain])
   
    socket.on('new-ride',(data)=>{
        setRide(data)
        setRidePopUpPanel(true)
        setConfirmRidePopUpPanel(false)
        console.log("new ride",data);
    })

    async function confirmRide() {

        const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/confirm`, {
            rideId: ride._id,
            captainId: captain?._id,
        }, { withCredentials: true})
        setRidePopUpPanel(false)
        setConfirmRidePopUpPanel(true)

    }

   
   

    useGSAP(() => {
        if (RidePopUpPanel) {
            gsap.to(RidePopUpPanelRef.current, {
                transform: "translateY(0)"
            })
        } else {
            gsap.to(RidePopUpPanelRef.current, {
                transform: "translateY(100%)"
            })
        }
    }, [RidePopUpPanel])

    useGSAP(() => {
        if (ConfirmRidePopUpPanel) {
            gsap.to(ConfirmRidePopUpPanelRef.current, {
                transform: "translateY(0)"
            })
        } else {
            gsap.to(ConfirmRidePopUpPanelRef.current, {
                transform: "translateY(100%)"
            })
        }
    }, [ConfirmRidePopUpPanel])

    return (
        <div className='h-screen fixed'>
            <div className='flex justify-between items-center '>
                <img className='w-40 absolute  top-2' src="./driver-logo.png" alt="logo" />
                <div>
                    <Link to='/captain-login' className='fixed h-18 w-18 bg-white rounded-full text-2xl p-2 font-medium flex justify-center items-center right-2 top-2'>
                        <i className="ri-logout-box-r-line"></i>
                    </Link>
                </div>
            </div>
            <div className="w-full h-[55%]">
                <img className="w-full h-full object-cover" src="/map.png" alt="Map" />
            </div>
            <div ref={CaptainDetailsPanelRef} className="w-full h-1/2 p-3 ">
                <CaptainDetails ride={ride} />
            </div>
            <div ref={RidePopUpPanelRef} className='fixed w-[100%] translate-y-full bottom-0  bg-white p-5 pt-9 pb-5 '>
                <RidePopUp
                    setRidePopUpPanel={setRidePopUpPanel}
                    setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
                    ride={ride}
                    confirmRide={confirmRide}
                />
            </div>
            <div ref={ConfirmRidePopUpPanelRef} className='fixed w-[100%] translate-y-full bottom-0  bg-white p-5 pt-9 pb-5 '>
                <ConfirmRidePopUp
                    ride={ride}
                    setConfirmRidePopUpPanel={setConfirmRidePopUpPanel}
                    setRidePopUpPanel={setRidePopUpPanel} 
                    
                    />
            </div>
           
            
      

        </div>
    )
}

export default CaptainHome
