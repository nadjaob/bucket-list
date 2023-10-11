import axiosAuth from '../lib/axios'
import { useParams } from 'react-router-dom'

// COMPONENTS
import DestinationForm from './DestinationForm'
import axios from 'axios'

export default function UpdateDestination ({ handleCloseForm }) {

  const { id } = useParams()

  function updateDestination(formData) {
    return axiosAuth.patch(`/api/destinations/${id}/`, formData)
  }

  function getDestinationData() {
    return axios.get(`/api/destinations/${id}/`)
  }

  return (
    <DestinationForm title='Edit' request={updateDestination} handleCloseForm={handleCloseForm} onLoad={getDestinationData} />
  )
}