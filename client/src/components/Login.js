import { Link } from 'react-router-dom'

// BOOTSTRAP
import axios from 'axios'
import Modal from 'react-bootstrap/Modal'

// COMPONENTS
import UserForm from './UserForm'

export default function Login({ handleCloseLogin, handleShowRegister, handleCloseRegister, setUsernameURL }) {



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
        <UserForm fields={fields} request={login} title='Login' handleCloseLogin={handleCloseLogin} handleCloseRegister={handleCloseRegister} setUsernameURL={setUsernameURL} />
      </Modal.Body>
      <Modal.Footer>Don&apos;t have an account? <Link onClick={handleShowRegister}>Sign up</Link></Modal.Footer>
    </>
  )
}