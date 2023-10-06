import { Link } from 'react-router-dom'

// BOOTSTRAP
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'

// COMPONENTS
import UserForm from './UserForm'

export default function Register({ handleCloseLogin, handleCloseRegister }) {

  const fields = [
    {
      type: 'text',
      name: 'Username',
    },
    {
      type: 'email',
      name: 'Email',
    },
    {
      type: 'text',
      name: 'Bio',
    },
    {
      type: 'password',
      name: 'Password',
    },
    {
      type: 'password',
      name: 'Password Confirmation',
    }
  ]

  function register(formData) {
    return axios.post('/api/auth/register/', formData)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Sign up</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Sign up to be able to add your favourite destinations to your bucket list!</p>
        <UserForm fields={fields} request={register} title='Sign up' handleCloseLogin={handleCloseLogin} handleCloseRegister={handleCloseRegister} />
      </Modal.Body>
      <Modal.Footer>Already have an account? <Link onClick={handleCloseRegister}>Log in</Link></Modal.Footer>
    </>
  )
}