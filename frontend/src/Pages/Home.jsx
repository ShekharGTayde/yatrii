import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios"
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import "remixicon/fonts/remixicon.css";
import LocationSearchPanel from "../Components/LocationSearchPanel";
import VehiclePanel from "../Components/VehiclePanel";
import ConfirmRide from "../Components/ConfirmRidePanel";
import LookingForDriver from "../Components/LookingForDriver";
import WaitingForDriver from "../Components/WaitingForDriver";
import { useNavigate } from "react-router-dom";

import { UserContextData } from "../Context/UserContext";
import { SocketContextData } from "../Context/SocketContext";

const Home = () => {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [panelOpen, setPanelOpen] = useState(false);
  const [VehiclesPanel, setVehiclesPanel] = useState(false)
  const [ConfirmRidePanel, setConfirmRidePanel] = useState(false)
  const [DriverFound, setDriverFound] = useState(false)
  const [WaitingForDrivers, setWaitingForDrivers] = useState(false)
  const [ActiveField, setActiveField] = useState(null)
  const [PickupSuggestion, setPickupSuggestion] = useState([])
  const [DestinationSuggestion, setDestinationSuggestion] = useState([])
  const [fare, setFare] = useState({})
  const [vehicleType, setVehicleType] = useState(null)
  const [ride, setRide] = useState(null)

  const panelRef = useRef(null);
  const panelCloseRef = useRef(null);
  const VehiclePanelRef = useRef(null)
  const ConfirmRidePanelRef = useRef(null)
  const DriverFoundeRef = useRef(null)
  const WaitingFordriversRef = useRef(null)

  const navigate = useNavigate()


  const { user } = useContext(UserContextData)
  const { socket } = useContext(SocketContextData)
  
  useEffect(() => {
    if (!user) {
      console.error('User is not defined');
      navigate('/user-login'); // Redirect to login if user is not defined
      return;
    }
  
    socket.emit('join', {
      userId: user._id,
      userType: 'user',
    });
  }, [user]);


  const submitHandler = (e) => {
    e.preventDefault();

  };

  const handelPickupChange = async (e) => {
    const userInput = e.target.value;
    setPickup(userInput);
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: userInput }, // Fix: Pass user input correctly
          withCredentials: true,
        }
      );

      setPickupSuggestion(response.data);
    } catch (error) {
      console.log(error);
    }

  };

  const handelDestinationChange = async (e) => {
    const userInput = e.target.value
    setDestination(userInput)
    try {
      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/maps/get-suggestions`,
        {
          params: { input: userInput },
          withCredentials: true,
        }
      )
      setDestinationSuggestion(response.data)

    } catch (error) {
      console.log(error);

    }

  }



  const findTrip = async () => {
    setVehiclesPanel(true)
    setPanelOpen(false)
    const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/rides/get-fare`, {
      params: { pickup, destination },
      withCredentials: true
    })
    setFare(response.data)

  }

  const createRide = async () => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/rides/create`, {
        pickup,
        destination,
        vehicleType
      }, { withCredentials: true })
      console.log(response.data);
    } catch (error) {
      console.error(error)
    }
  }

  useGSAP(() => {
    gsap.to(panelRef.current, {
      height: panelOpen ? "100%" : "36%",
      padding: panelOpen ? 24 : 16,
      duration: 0.3,
    });
    gsap.to(panelCloseRef.current, {
      opacity: panelOpen ? 1 : 0,
      duration: 0.2,
    });
  }, [panelOpen]);

  useGSAP(() => {
    if (VehiclesPanel) {
      gsap.to(VehiclePanelRef.current, {
        transform: 'translateY(0)',
      })
    } else {
      gsap.to(VehiclePanelRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [VehiclesPanel])

  useGSAP(() => {
    if (ConfirmRidePanel) {
      gsap.to(ConfirmRidePanelRef.current, {
        y: '0',
      })
    } else {
      gsap.to(ConfirmRidePanelRef.current, {
        y: '100%'
      })
    }
  }, [ConfirmRidePanel])

  useGSAP(() => {
    if (DriverFound) {
      gsap.to(DriverFoundeRef.current, {
        transform: 'translateY(0)',
      })
    } else {
      gsap.to(DriverFoundeRef.current, {
        transform: 'translateY(100%)'
      })
    }
  }, [DriverFound])


  useGSAP(() => {
    if (WaitingForDrivers) {
      gsap.to(WaitingFordriversRef.current, {
        transform: "translateY(0)"
      })
    } else {
      gsap.to(WaitingFordriversRef.current, {
        transform: "translateY(100%)"
      })
    }
  }, [WaitingForDrivers])


  return (
    <div className="h-screen fixed overflow-hidden">
      {/* Logo */}
      <img className="w-16 absolute left-5 top-5" src="/logo.png" alt="logo" />

      {/* Map Background */}
      <div className="w-screen h-screen">
        <img className="w-full h-full object-cover" src="/map.png" alt="Map" />

      </div>

      {/* Bottom Trip Finder */}
      <div className="absolute top-0 w-full h-screen flex flex-col justify-end">
        <div ref={panelRef} className="h-[36%] p-6 bg-white relative transition-all">
          {/* Close Button */}
          <h5
            ref={panelCloseRef}
            onClick={() => { setPanelOpen(false) }}
            className="absolute cursor-pointer opacity-1 right-6 top-6 text-2xl"
          >
            <i className="ri-arrow-down-s-line"></i>
          </h5>

          <h4 className="font-semibold text-2xl">Find a trip</h4>

          <form className="mt-3" onSubmit={submitHandler}>
            <input
              value={pickup}
              onClick={() => {
                setPanelOpen(true)
                setActiveField('pickup')
              }}
              onChange={handelPickupChange}

              className="w-full h-12 rounded-lg px-4 py-3 bg-gray-200"
              type="text"
              placeholder="Add a pick-up location"
            />
            <input
              value={destination}
              onClick={() => {
                setPanelOpen(true)
                setActiveField('destination')
              }}
              onChange={handelDestinationChange}
              className="w-full h-12 rounded-lg px-4 py-3 mt-2 bg-gray-200"
              type="text"
              placeholder="Enter your destination"
            />
            <button
              onClick={findTrip}
              type="submit"
              className="w-full h-12 bg-blue-500 rounded-lg px-4 py-3 font-semibold mt-2 text-xl flex justify-center items-center text-white"
            >
              Find Trip
            </button>
          </form>




          {/* location panel */}
          <div ref={panelRef} className='bg-white h-0 mt-5 ' >
            <LocationSearchPanel
              suggestions={ActiveField === 'pickup' ? PickupSuggestion : DestinationSuggestion}
              setPanelOpen={setPanelOpen}
              setVehiclesPanel={setVehiclesPanel}
              setPickup={setPickup}
              setDestination={setDestination}
              ActiveField={ActiveField} />

          </div>

          {/* vehicle option panel */}
          <div ref={VehiclePanelRef} className='fixed w-[100%]  bottom-0 translate-y-full bg-white p-5 pt-9 pb-5 ml-[-4%]'>
            <VehiclePanel
              // setPickup={setPickup}
              // setDestination={setDestination} 
              // setFare={setFare} 
              setVehiclesPanel={setVehiclesPanel}
              fare={fare}
              setVehicleType={setVehicleType}
              setConfirmRidePanel={setConfirmRidePanel} />
          </div>

          {/* confirm ride panel */}
          <div ref={ConfirmRidePanelRef} className='fixed w-[100%]  bottom-0  bg-white p-5 pt-9 pb-5 ml-[-4%]'>
            <ConfirmRide
              createRide={createRide}
              pickup={pickup}
              destination={destination}
              vehicleType={vehicleType}
              fare={fare}
              setConfirmRidePanel={setConfirmRidePanel}
              // setVehiclesPanel={setVehiclesPanel} 
              setDriverFound={setDriverFound}
            />
          </div>

          {/* looking for driver panel */}
          <div ref={DriverFoundeRef} className='fixed w-[100%]  bottom-0 translate-y-full bg-white p-5 pt-9 pb-5 ml-[-4%]'>
            <LookingForDriver
              pickup={pickup}
              destination={destination}
              vehicleType={vehicleType}
              fare={fare}
              setDriverFound={setDriverFound}
              createRide={createRide}
            // setConfirmRidePanel={setConfirmRidePanel} 
            // setWaitingForDrivers={setWaitingForDrivers}
            />
          </div>

          {/* waiting for driver panel */}
          <div ref={WaitingFordriversRef} className='fixed w-[100%]  bottom-0 translate-y-full bg-white p-5 pt-9 pb-5 ml-[-4%]'>
            <WaitingForDriver
              setWaitingForDrivers={setWaitingForDrivers}
              WaitingForDrivers={WaitingForDrivers}
              ride={ride}
              setDriverFound={setDriverFound}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Home;
