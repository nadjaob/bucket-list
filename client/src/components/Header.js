import { Link, NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

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


export default function Header() {

  const [navbar, setNavbar] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)

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
              <NavLink onClick={handleShowLogin} className='login-button'>Login</NavLink>
            </Col>
          </Row>
        </Container>
      </nav>

      <Modal show={showLogin} onHide={handleCloseLogin} backdrop='static' keyboard={false} centered size='sm'>
        {showRegister ?
          <Register handleCloseLogin={handleCloseLogin} handleCloseRegister={handleCloseRegister} />
          :
          <Login handleCloseLogin={handleCloseLogin} handleShowRegister={handleShowRegister} handleCloseRegister={handleCloseRegister} />
        }
      </Modal>
    </>
  )
}