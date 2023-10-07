import { Link, NavLink } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'

// IMAGES
import logo from '../images/logo-bucketlist.png'

// COMPONENTS
import Login from './Login'
import Register from './Register'
import { deleteToken } from '../lib/auth'


export default function Header({ usernameURL, setUsernameURL }) {

  const { user, setUser } = useContext(UserContext)
  const [ navbar, setNavbar ] = useState(false)
  const [ showLogin, setShowLogin ] = useState(false)
  const [ showRegister, setShowRegister ] = useState(false)

  // NAVBAR CHANGES ON SCROLL
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 88) {
      setNavbar(true)
    } else {
      setNavbar(false)
    }
  })

  // POPUP LOGIN FORM
  const handleShowLogin = () => setShowLogin(true)
  const handleCloseLogin = () => {
    setShowLogin(false)
    setShowRegister(false)
  }
  const handleShowRegister = () => setShowRegister(true)
  const handleCloseRegister = () => setShowRegister(false)

  return (
    <>
      <nav className={navbar ? 'navbar-container scrolled' : 'navbar-container'}>
        <Container>
          <Row className='navbar-row'>
            <Col><Link to='/'><img src={logo} /></Link></Col>
            <Col className='navbar-right'>
              <NavLink to='/destinations'>Destinations</NavLink>
              {user ?
                <>
                  <NavLink to={usernameURL}>Profile</NavLink>
                  <NavLink to='/' className='login-button' onClick={() => {
                    setUser(false)
                    deleteToken('access-token')
                    deleteToken('refresh-token')
                  }}>Logout</NavLink>
                </>
                :
                <NavLink onClick={handleShowLogin} className='login-button'>Login</NavLink>
              }
            </Col>
          </Row>
        </Container>
      </nav>

      <Modal show={showLogin} onHide={handleCloseLogin} backdrop='static' keyboard={false} centered size='sm'>
        {showRegister ?
          <Register handleCloseLogin={handleCloseLogin} handleCloseRegister={handleCloseRegister} />
          :
          <Login
            handleCloseLogin={handleCloseLogin}
            handleShowRegister={handleShowRegister}
            handleCloseRegister={handleCloseRegister}
            setUsernameURL={setUsernameURL}
          />
        }
      </Modal>
    </>
  )
}