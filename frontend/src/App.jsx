import React from 'react'
import Start from './Pages/Start'
import { Routes , Route } from 'react-router-dom'
import UserLogin from './Pages/UserLogin'
import UserSignup from './Pages/UserSignup'
import CaptainLogin from './Pages/CaptainLogin'
import CaptainSignup from './Pages/CaptainSignup'
import Home from './Pages/Home'
import {UserWraper} from './Pages/Wraper'
import {CaptainWraper} from './Pages/Wraper'
import UserLogout from './Pages/UserLogout'
import CaptainLogout from './Pages/CaptainLogout'
import CaptainHome from './Pages/CaptainHome'
import Riding from './Pages/Riding'
import CaptainRiding from './Pages/CaptainRiding'


const App = () => {

 
  
  return (
    <div >
     <Routes>
      
    <Route path='/' element={<Start/>}/>
    <Route path='/user-signup' element={<UserSignup/>}/>
    <Route path='/user-login' element={<UserLogin/>}/>
    <Route path='/riding' element={<Riding/>}/>
    <Route path='/captain-signup' element={<CaptainSignup/>}/>
    <Route path='/captain-login' element={<CaptainLogin/>}/>
    <Route path='/home' element={<UserWraper><Home/></UserWraper>}/>
    <Route path='/user-logout' element={<UserWraper><UserLogout/></UserWraper>}/>
    <Route path='/captain-logout' element={<CaptainWraper><CaptainLogout/></CaptainWraper>}/>
    <Route path='/captain-home' element={<CaptainWraper><CaptainHome/></CaptainWraper>}/>
    <Route path='/captain-riding' element={<CaptainRiding/>}/>

    
     </Routes>
    </div>
  )
}

export default App
