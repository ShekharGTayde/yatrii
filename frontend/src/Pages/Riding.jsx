import React, { useContext } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { SocketContextData } from '../Context/SocketContext'
import axios from 'axios'



const Riding = () => {

    const { socket } = useContext(SocketContextData)
    const location = useLocation()
    const { ride } = location.state || {} // Retrieve ride data

   // console.log(ride);
   const navigate = useNavigate()

    socket.on("ride-ended", () => {
        navigate('/home')
    })


//payment gateway
 const amount = ride?.fare * 100; // Convert to paise (Razorpay works in smallest currency unit)
  const currency = "INR";
const receiptId = `receipt_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

  const paymentHandler = async (e) => {
      e.preventDefault();

  // Load Razorpay script if not already loaded
  const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
  if (!res) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }
    const response = await fetch(`${import.meta.env.VITE_BASE_URL}/order`, {
      method: "POST",
      body: JSON.stringify({
        amount,
        currency,
        receipt: receiptId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const order = await response.json();
    console.log(order);
    console.log('keys:',import.meta.env.VITE_RAZORPAY_KEY_ID );
    
    var options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, 
      amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency,
      name: "Yatrii", //your business name
      description: "Test Transaction",
      image: "/logo.png",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      handler: async function (response) {
        const body = {
          ...response,
        };

        const validateRes = await fetch(
          `${import.meta.env.VITE_BASE_URL}/order/validate`,
          {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const jsonRes = await validateRes.json();
        console.log(jsonRes);
      },
      prefill: {
        //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
        name:ride.user.userName, //your customer's name
        email: ride.user.email, //Provide the customer's email address for better conversion rates
        contact: "9000000000", //Provide the customer's phone number for better conversion rates
      },
      notes: {
        address: "Razorpay Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };
    var rzp1 = new window.Razorpay(options);
    rzp1.on("payment.failed", function (response) {
      alert(response.error.code);
      alert(response.error.description);
      alert(response.error.source);
      alert(response.error.step);
      alert(response.error.reason);
      alert(response.error.metadata.order_id);
      alert(response.error.metadata.payment_id);
    });
    rzp1.open();
    e.preventDefault();
  };








return (
    <div className='h-screen fixed'>
        <Link to='/home' className='fixed h-18 w-18 bg-white rounded-full text-2xl p-2 font-medium flex justify-center items-center right-2 top-2'>
            <i className="ri-home-8-line"></i>
        </Link>

        <div className="w-full h-[50%]">
            <img className="w-full h-full object-cover" src="/map.png" alt="Map" />
        </div>

        <div className="w-full h-1/2 p-3 ">
            <div className='flex justify-between items-center'>
                <img className='size-20 rounded-full ml-2' src="/driver.jpg" alt="" />
                <div className='text-right'>
                    <h2 className='text-base font-medium'>{ride?.captain.captainName}</h2>
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
                    <button
                       onClick={paymentHandler}
                        className='text-xl font-semibold p-2 bg-green-400 rounded-lg m-1 w-[92%]'>Make a Payment
                    </button>
                </div>
            </div>
        </div>
    </div>
)
}

export default Riding
