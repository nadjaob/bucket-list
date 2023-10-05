import { useEffect } from 'react'
import axios from 'axios'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

// GLOBAL COMPONENTS
import Header from './components/Header'
import Footer from './components/Footer'

// PAGE COMPONENTS
import Home from './components/Home'

export default function App() {
  useEffect(() => {
    async function getData(){
      try {
        const { data } = await axios.get('/api/auth/nadjaob') // <---- Replace with your endpoint to test the proxy
        console.log(data)
      } catch (error) {
        console.log(error.response.data)
      }
    }
    getData()
  }, [])

  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
