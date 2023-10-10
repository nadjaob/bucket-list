import { createContext, useEffect, useState } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { tokenIsValid } from './lib/auth'

// GLOBAL COMPONENTS
import Header from './components/Header'
import Footer from './components/Footer'

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

  const [usernameURL, setUsernameURL] = useState('')
  const [userId, setUserId] = useState()
  const [userImage, setUserImage] = useState()
  const [renderApp, setRenderApp] = useState(false)

  const [user, setUser] = useState(() => {
    if (tokenIsValid('refresh-token')) {
      return true
    }
    return false
  })

  useEffect(() => {
    async function getUserId() {
      try {
        const { data } = await axios.get(`/api/auth/${usernameURL}`)
        setUserId(data.id)
        setUserImage(data.profile_image)
      } catch (error) {
        console.log(error)
      }
    }
    getUserId()
  }, [usernameURL])

  console.log('user id', userId)

  useEffect(() => {
    console.log('app was rendered')
  }, [renderApp])


  // useEffect(() => {
  //   async function getData(){
  //     try {
  //       const { data } = await axios.get('/api/auth/nadjaob') // <---- Replace with your endpoint to test the proxy
  //       console.log(data)
  //     } catch (error) {
  //       console.log(error.response.data)
  //     }
  //   }
  //   getData()
  // }, [])

  return (
    <BrowserRouter>
      <UserContext.Provider value={{ user: user, setUser: setUser }}>
        <Header usernameURL={usernameURL} setUsernameURL={setUsernameURL} setRenderApp={setRenderApp} renderApp={renderApp} userImage={userImage} />
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
