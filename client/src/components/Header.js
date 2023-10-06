import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// IMAGES
import logo from '../images/logo-bucketlist.png'


export default function Header() {

  // NAVBAR
  const [navbar, setNavbar] = useState(false)

  // NAVBAR CHANGES ON SCROLL
  window.addEventListener('scroll', () => {
    if (window.scrollY >= 88) {
      setNavbar(true)
    } else {
      setNavbar(false)
    }
  })

  return (
    <nav className={navbar ? 'navbar-container scrolled' : 'navbar-container'}>
      <Container>
        <Row className='navbar-row'>
          <Col><img src={logo} /></Col>
          <Col className='navbar-right'>
            <NavLink to='/destinations'>Destinations</NavLink>
            <NavLink className='login-button'>Login</NavLink>
          </Col>
        </Row>
      </Container>
    </nav>
  )
}