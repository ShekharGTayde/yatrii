import React from 'react'

const LocationSearchPanel = ({ suggestions, setPickup, setDestination, ActiveField ,setConfirmRidePanel }) => {

  const handleSuggestionClick = (suggestions) => {
    if (ActiveField === 'pickup') {
      setPickup(suggestions)
    } else if (ActiveField === 'destination') {
      setDestination(suggestions)
    }
    // setVehiclePanel(true)
    // setPanelOpen(false)
  }
 
  return (
    <div className='  '>
      {/* Display fetched suggestions */}
      {suggestions.map((elem, idx) => (
          <div key={idx}
            onClick={() =>{ handleSuggestionClick(elem)}}
            className="flex overflow-y-auto  items-start gap-3 border p-3 border-gray-300 hover:border-black rounded-xl my-2">

            {/* Icon Section */}
            <div className="bg-gray-200 h-10 w-10 flex items-center justify-center rounded-full shrink-0">
              <i className="ri-map-pin-fill text-gray-600"></i>
            </div>

            {/* Text Section */}
            <div className="flex-1">
              <h4 className="font-medium text-gray-800 leading-snug">{elem}</h4>
            </div>

          </div>




        ))
      }
    </div>
  )
}

export default LocationSearchPanel