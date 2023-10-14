import axiosAuth from '../lib/axios'

// COMPONENTS
import DestinationForm from './DestinationForm'


export default function CreateDestination({ handleCloseForm }) {

  function createDestination(formData) {
    return axiosAuth.post('/api/destinations/', formData)
  }

  return (
    <DestinationForm title='Create' request={createDestination} handleCloseForm={handleCloseForm} />
  )
}