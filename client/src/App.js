import { useEffect, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { tokenIsValid, getUserID } from './lib/auth'
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


export default function App() {

  const [renderApp, setRenderApp] = useState(false)

  const [user, setUser] = useState(tokenIsValid('refresh-token'))
  const [userID, setUserID] = useState(getUserID('refresh-token'))
  const [userImage, setUserImage] = useState()
  const [username, setUsername] = useState()

  const location = useLocation()

  useEffect(() => {
    setUser(tokenIsValid('refresh-token'))
    setUserID(getUserID('refresh-token'))
  }, [location])

  useEffect(() => {
    async function getActiveUserDetails() {
      try {
        const { data } = await axiosAuth.get('/api/auth/userprofile/')
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
      <ScrollToTop />
      <Header user={user} setUser={setUser} userImage={userImage} username={username} setRenderApp={setRenderApp} renderApp={renderApp} />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/destinations' element={<Destinations />} />
        <Route path='/destinations/:id' element={<SingleDestination user={user} userID={userID} username={username} renderApp={renderApp} />} />
        <Route path='/:username' element={<UserProfile userID={userID} renderApp={renderApp} />} />
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
      <Footer />
    </>
  )
}
