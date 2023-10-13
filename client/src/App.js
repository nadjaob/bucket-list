import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { tokenIsValid, getToken } from './lib/auth'
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


// USER
export const UserContext = createContext(() => {
  if (tokenIsValid('refresh-token')) {
    return true
  }
  return false
})



export default function App() {

  const [userId, setUserId] = useState()
  const [userImage, setUserImage] = useState()
  const [username, setUsername] = useState()
  const [renderApp, setRenderApp] = useState(false)
  const [destinations, setDestinations] = useState([])

  const [user, setUser] = useState(() => {
    if (tokenIsValid('refresh-token')) {
      return true
    }
    return false
  })

  useEffect(() => {
    async function getUserId() {
      try {
        const { data } = await axiosAuth.get('/api/auth/userprofile/')
        console.log('hit user profile')
        setUserId(data.id)
        setUserImage(data.profile_image)
        setUsername(data.username)
      } catch (error) {
        console.log(error)
      }
    }
    getUserId()
  }, [user])

  console.log('user id', userId)

  useEffect(() => {
    console.log('app was rendered')
  }, [renderApp])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <ScrollToTop />
        <Header setRenderApp={setRenderApp} renderApp={renderApp} userImage={userImage} username={username} destinations={destinations} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/destinations' element={<Destinations />} />
          <Route path='/destinations/:id' element={<SingleDestination userId={userId} renderApp={renderApp} />} />
          <Route path='/:username' element={<UserProfile userId={userId} renderApp={renderApp} />} />
        </Routes>
        <Footer />
      </UserContext.Provider>
    </BrowserRouter>
  )
}
