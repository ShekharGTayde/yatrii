
import React from "react";

const VehiclePanel = (props) => {

  const fareData = props.fare?.data ?? {}; // Ensure fareData is always an object
  
  
  return (
    <div>
      <h5
        className="p-1 text-center w-[93%] absolute top-0"
        onClick={() => props.setVehiclesPanel(false)}
      >
        <i className="text-3xl text-gray-200 ri-arrow-down-wide-line"></i>
      </h5>

      <h3 className="font-bold text-2xl">Choose a Vehicle</h3>

      {/* UberGo */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true);
          props.setVehiclesPanel(false);
          props.setVehicleType('car')
        }}
        className="flex p-2 items-center justify-between w-full hover:border-black border-2 rounded-xl mt-6"
      >
        <img className="w-24 h-12" src="/car.jpg" alt="Car" />
        <div className="w-1/2">
          <h5 className="text-xl font-semibold">
            UberGo<span className="ml-3"><i className="ri-user-3-fill"></i>4</span>
          </h5>
          <h4 className="text-base font-medium">2 mins away</h4>
          <p className="text-xs">Affordable compact rides</p>
        </div>
        <h2 className="text-lg font-bold mr-1"><i className="ri-money-rupee-circle-fill"></i>{fareData.car || "Loading..."}</h2>
      </div>

      {/* Moto */}
      <div
        onClick={() => {
          props.setConfirmRidePanel(true),
          props.setVehiclesPanel(false),
          props.setVehicleType('bike')}}
        className="flex p-2 items-center justify-between w-full hover:border-black border-2 rounded-xl mt-6"
      >
        <img className="w-24 h-12" src="/bike.jpg" alt="Bike" />
        <div className="w-1/2">
          <h5 className="text-xl font-semibold">
            Moto<span className="ml-3"><i className="ri-user-3-fill"></i>1</span>
          </h5>
          <h4 className="text-base font-medium">3 mins away</h4>
          <p className="text-xs">Affordable bike rides</p>
        </div>
        <h2 className="text-lg font-bold mr-1"><i className="ri-money-rupee-circle-fill"></i>{fareData.bike || "Loading..."}</h2>
      </div>

      {/* UberAuto */}
      <div
        onClick={() =>{ 
          props.setConfirmRidePanel(true), 
          props.setVehiclesPanel(false),
          props.setVehicleType('auto')}}
        className="flex p-2 items-center justify-between w-full hover:border-black border-2 rounded-xl mt-6"
      >
        <img className="w-20 h-12" src="/auto.jpg" alt="Auto" />
        <div className="w-1/2 ">
          <h5 className="text-xl font-semibold">
            UberAuto<span className="ml-3"><i className="ri-user-3-fill"></i>3</span>
          </h5>
          <h4 className="text-base font-medium">4 mins away</h4>
          <p className="text-xs">Affordable auto rides</p>
        </div>
        <h2 className="text-lg font-bold mr-1"><i className="ri-money-rupee-circle-fill"></i>{fareData.auto || "Loading..."}</h2>
      </div>
    </div>
  );
};

export default VehiclePanel;
