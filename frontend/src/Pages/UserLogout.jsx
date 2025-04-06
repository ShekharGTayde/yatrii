import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import apiError from '../../../Backend/utils/apiError'


const UserLogout = async() => {
    const navigate = useNavigate()
   try {
   const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/users/logout`,{withCredentials:true})
   if (response.status===200) {
    navigate(`/user-login`)
   }


   } catch (error) {
    throw new apiError(400,'Logout Failed:',error)
   }

    return (
        <div>
            UserLogout
        </div>
    )
}

export default UserLogout
