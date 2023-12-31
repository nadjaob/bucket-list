import { Link } from 'react-router-dom'

// BOOTSTRAP
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'

// COMPONENTS
import UserForm from './UserForm'

export default function Login({ setUser, handleCloseLogin, handleShowRegister, handleCloseRegister }) {

  const fields = [
    {
      type: 'text',
      name: 'Username',
    },
    {
      type: 'password',
      name: 'Password',
    }
  ]

  function login(formData) {
    return axios.post('/api/auth/login/', formData)
  }

  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>Login</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>Log in to be able to add your favourite destinations to your bucket list!</p>
        <UserForm setUser={setUser} fields={fields} request={login} title='Login' handleCloseLogin={handleCloseLogin} handleCloseRegister={handleCloseRegister} />
      </Modal.Body>
      <Modal.Footer>Don&apos;t have an account? <Link className='fw-bold' onClick={handleShowRegister}>Sign up</Link></Modal.Footer>
    </>
  )
}