import { Link, NavLink } from 'react-router-dom'
import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../App'
import axios from 'axios'

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

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


export default function Header({ usernameURL, setUsernameURL, setRenderApp, renderApp }) {

  const { user, setUser } = useContext(UserContext)
  const [navbar, setNavbar] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [value, setValue] = useState('')
  const [destinations, setDestinations] = useState('')

  useEffect(() => {
    async function getDestinations(){
      try {
        const { data } = await axios.get('/api/destinations')
        setDestinations(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getDestinations()
  }, [showSearch])

  console.log('destinations', destinations)

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

  // SEARCH BAR
  const handleSearch = () => {
    if (!showSearch) {
      setShowSearch(true)
    } else {
      setShowSearch(false)
    }
  }

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const removeSearchlist = () => {
    setValue('')
    setShowSearch(false)
    if (!renderApp) {
      setRenderApp(true)
    } else {
      setRenderApp(false)
    }
    
  }

  return (
    <>
      <nav className={navbar ? 'navbar-container scrolled' : 'navbar-container'}>
        <Container>
          <Row className='navbar-row'>
            <Col><Link to='/'><img src={logo} /></Link></Col>
            <Col className='navbar-right'>
              {showSearch && 
                <div className='search-container'>
                  <input type='text' value={value} onChange={handleInput}></input>
                  <div className='dropdown'>
                    {destinations.filter(destination => {
                      const searchTerm = value.toLowerCase()
                      const name = destination.name.toLowerCase()
                      const country = destination.country.toLowerCase()
                      console.log('searchterm', searchTerm)
                      console.log('name of filtered destination', name)
                      return searchTerm && (name.startsWith(searchTerm) || country.startsWith(searchTerm))
                    })
                      .map(destination => {
                        return (
                          <div key={destination.id} className='search-list' onClick={removeSearchlist}>
                            <Link to={`/destinations/${destination.id}`}>
                              <p>{destination.name}</p>
                              <div className='country-container'>
                                <img src={destination.flag_image} alt={destination.country} />
                                <p>{destination.country}</p>
                              </div>
                            </Link>
                          </div>
                        )
                      })}
                  </div>
                </div>
              }
              <NavLink onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#fff' }} size='sm' />
              </NavLink>
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