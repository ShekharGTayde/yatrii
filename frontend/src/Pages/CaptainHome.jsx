import React, { useContext, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import CaptainDetails from '../Components/CaptainDetails'
import RidePopUp from '../Components/RidePopUp'
import { useGSAP } from '@gsap/react'
import gsap from "gsap";
import ConfirmRidePopUp from '../Components/ConfirmRidePopUp'
import { CaptainContextData } from '../Context/CaptainContext'
import { SocketContextData } from '../Context/SocketContext'

const CaptainHome = () => {


    const [RidePopUpPanel, setRidePopUpPanel] = useState(true)
    const [ConfirmRidePopUpPanel, setConfirmRidePopUpPanel] = useState(false)
    const [ride, setRide] = useState(null)

    const RidePopUpPanelRef = useRef(null)
    const ConfirmRidePopUpPanelRef = useRef(null)
    const CaptainDetailsPanelRef = useRef(null)

   
    const captain =  JSON.parse(  localStorage.getItem('captain'));
    const {socket} = useContext(SocketContextData)

    useEffect(()=>{
        socket.emit('join',{
            userId:captain?._id,
            userType:'captain'
        })
    },[captain])


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
                <img className='w-16 absolute left-5 top-5' src="./uber-driver.svg" alt="logo" />
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
                    setRidePopUpPanel={setRidePopUpPanel} />
            </div>
        </div>
    )
}

export default CaptainHome
