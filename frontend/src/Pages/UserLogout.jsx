import React from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { buildApiUrl } from '../utils/apiConfig'


const UserLogout = async() => {
    const navigate = useNavigate()
   try {
    const response = await axios.get(buildApiUrl('/users/logout'),{withCredentials:true})
   if (response.status===200) {
    navigate(`/user-login`)
   }


   } catch (error) {
    console.error('Logout Failed:', error?.response?.data?.message || error.message)
   }

    return (
        <div>
            UserLogout
        </div>
    )
}

export default UserLogout
