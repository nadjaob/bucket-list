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

// USER
export const UserContext = createContext(() => {
  if (tokenIsValid('refresh-token')) {
    return true
  }
  return false
})



export default function App() {
  const [user, setUser] = useState(() => {
    if (tokenIsValid('refresh-token')) {
      return true
    }
    return false
  })

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
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/destinations' element={<Destinations />} />
          <Route path='/:username' element={<UserProfile />} />
        </Routes>
        <Footer />
      </UserContext.Provider>
    </BrowserRouter>
  )
}
