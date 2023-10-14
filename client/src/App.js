import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { tokenIsValid, getToken, getUserID } from './lib/auth'
import axiosAuth from './lib/axios'

// GLOBAL COMPONENTS
import Header from './components/Header'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

// PAGE COMPONENTS
import Home from './components/Home'
import Destinations from './components/Destinations'
import UserProfile from './components/UserProfile'
import SingleDestination from './components/SingleDestination'
import NotFound from './components/NotFound'


// // USER
// export const UserContext = createContext(() => {
//   if (tokenIsValid('refresh-token')) {
//     return true
//   }
//   return false
// })


export default function App() {

  // const [userId, setUserId] = useState()

  const [renderApp, setRenderApp] = useState(false)
  const [destinations, setDestinations] = useState([])
  const location = useLocation()

  const [user, setUser] = useState(tokenIsValid('refresh-token'))
  const [userID, setUserID] = useState(getUserID('refresh-token'))

  const [userImage, setUserImage] = useState()
  const [username, setUsername] = useState()

  console.log('this is my user id from auth.js', userID)

  useEffect(() => {
    setUser(tokenIsValid('refresh-token'))
    setUserID(getUserID('refresh-token'))
  }, [location])

  // const [user, setUser] = useState(() => {
  //   if (tokenIsValid('refresh-token')) {
  //     return true
  //   }
  //   return false
  // })

  useEffect(() => {
    async function getActiveUserDetails() {
      try {
        const { data } = await axiosAuth.get('/api/auth/userprofile/')
        console.log('hit user profile')
        setUserImage(data.profile_image)
        setUsername(data.username)
      } catch (error) {
        console.log(error)
      }
    }
    getActiveUserDetails()
  }, [user])



  useEffect(() => {
    console.log('app was rendered')
  }, [renderApp])

  return (
    <>
      {/* <UserContext.Provider value={{ user: user, setUser: setUser }}> */}
      <ScrollToTop />
      <Header user={user} setUser={setUser} userImage={userImage} username={username} setRenderApp={setRenderApp} renderApp={renderApp} destinations={destinations} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/destinations' element={<Destinations />} />
        <Route path='/destinations/:id' element={<SingleDestination user={user} userID={userID} username={username} renderApp={renderApp} />} />
        <Route path='/:username' element={<UserProfile userID={userID} renderApp={renderApp} />} />
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
      <Footer />
      {/* </UserContext.Provider> */}
    </>
  )
}
