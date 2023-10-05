import axios from 'axios'
import { getToken, setToken, tokenIsValid } from './auth'

const axiosAuth = axios.create()

axiosAuth.interceptors.request.use(async function(config){
  if (!tokenIsValid('access-token')){
    if (tokenIsValid('refresh-token')) {
      const { data } = await axios.post('/api/auth/refresh/', {
        refresh: getToken('refresh-token'),
      })
      setToken('access-token', data.access)
    } else {
      throw new axios.Cancel('Your session has expired, please sign in again')
    }
  } 
  config.headers.Authorization = `Bearer ${getToken('access-token')}`
  return config
})

export default axiosAuth