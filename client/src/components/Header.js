import { Link, NavLink } from 'react-router-dom'
import { useContext, useEffect, useState, useRef } from 'react'
import { UserContext } from '../App'
import axios from 'axios'
import axiosAuth from '../lib/axios'

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
import { getToken } from '../lib/auth'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'


export default function Header({ user, setUser, userImage, username, setRenderApp, renderApp }) {



  const catMenu = useRef(null)
  // const { user, setUser } = useContext(UserContext)
  const [navbar, setNavbar] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [value, setValue] = useState('')
  const [destinations, setDestinations] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])

  


  useEffect(() => {
    async function getDestinations(){
      try {
        const { data } = await axios.get('/api/destinations/search/')
        setDestinations(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getDestinations()    
  }, [])

  useEffect(() => {
    console.log('all destinations', destinations)
    const regex = new RegExp(value, 'i')
    const filteredArray = destinations.filter(destination => {
      const filteredCategories = destination.categories.map(category => {
        return category.name
      })
      return (
        value &&
        (regex.test(destination.name) ||
        regex.test(destination.country) ||
        regex.test(filteredCategories)
        ))
    })
    setFilteredDestinations(filteredArray)
  }, [destinations, showSearch, value])


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
      setTimeout(() => {
        document.querySelector('.input-search').focus()
      }, 100)
    } else {
      setShowSearch(false)
      setValue('')
    }
    
  }

  const handleInput = (e) => {
    setValue(e.target.value)
  }

  const removeSearchlist = () => {
    setValue('')
    setShowSearch(false)
    setFilteredDestinations([])
    if (!renderApp) {
      setRenderApp(true)
    } else {
      setRenderApp(false)
    }
  }

  const closeSearchList = (e) => {
    if (catMenu.current && showSearch && !catMenu.current.contains(e.target)) {
      setShowSearch(false)
      // setFilteredDestinations([])
      setValue('')
    }
  }
  document.addEventListener('mousedown', closeSearchList)


  const changeUserProfile = () => {
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
            <Col className='navbar-logo'><Link to='/'><img src={logo} alt='BUCKET LIST' className='logo' /></Link></Col>
            <Col className='navbar-right'>
              {showSearch && 
                <div className='search-container' ref={catMenu}>
                  <input type='text' value={value} onChange={handleInput} className='input-search' placeholder='Search destination...'></input>
                  <div className='dropdown' onClick={removeSearchlist}>
                    {filteredDestinations.map(destination => {
                      return (
                        <div key={destination.id} className='search-list'>
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
                    {(value && filteredDestinations.length < 1) &&
                      <div className='search-list'>
                        <Link to='/destinations/'>
                          <p>No matching results.<br />See all destinations!</p>
                        </Link>
                      </div>
                    }
                  </div>
                </div>
              }
              <NavLink onClick={handleSearch}>
                <FontAwesomeIcon icon={faMagnifyingGlass} style={{ color: '#fff' }} size='sm' />
              </NavLink>
              <NavLink to='/destinations'>Destinations</NavLink>
              {user ?
                <>
                  <NavLink to='/' onClick={() => {
                    setUser(false)
                    deleteToken('access-token')
                    deleteToken('refresh-token')
                  }}>Logout</NavLink>
                  <NavLink to={`${username}`} onClick={changeUserProfile}>
                    <img className='profile-image-header' src={userImage} />
                  </NavLink>
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
            setUser={setUser}
            handleCloseLogin={handleCloseLogin}
            handleShowRegister={handleShowRegister}
            handleCloseRegister={handleCloseRegister}
          />
        }
      </Modal>
    </>
  )
}