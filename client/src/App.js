import { useEffect } from 'react'
import axios from 'axios'

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

  return <h1>Hello World</h1>
}
