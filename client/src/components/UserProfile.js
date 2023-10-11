import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Modal from 'react-bootstrap/Modal'

// IMAGES
import DestinationCard from './DestinationCard'

// COMPONENTS
import CreateDestination from './CreateDestination'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'


export default function UserProfile({ userId, renderApp }) {

  const { username } = useParams()

  const { user, setUser } = useContext(UserContext)
  const [userData, setUserData] = useState()
  const [show, setShow] = useState(false)


  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${username}`)
        setUserData(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [renderApp])


  // CREATE DESTINATION

  const createDestination = () => setShow(true)
  const handleCloseForm = () => setShow(false)


  return (
    <>
      {userData ?
        <>
          <Container fluid className='user-bg'>
            <img src={userData.background_image} className='header-image' />
          </Container>

          <Container>
            <Row>
              <Col className='profile-image' md='4'>
                <img src={userData.profile_image} />
              </Col>
              <Col className='profile-details' md='4'>
                <h1>{userData.username}</h1>
                <p className='user-bio-sm'>{userData.bio}</p>
                <p>Destinations on your bucket list: {userData.bucketlist.length}<br />
                Destinations visited: {userData.visited.length}</p>
                {userId === userData.id &&
                <>
                  <Link className='button' onClick={createDestination}><span className='space-before-icon'>Create a new destination</span>
                    <FontAwesomeIcon icon={faPen} style={{ color: '#ffffff' }} size='sm' />
                  </Link>
                  <Modal show={show} onHide={handleCloseForm} backdrop='static' keyboard={false} centered size='lg'>
                    <CreateDestination handleCloseForm={handleCloseForm} />
                  </Modal>
                </>
                }
              </Col>
            </Row>
          </Container>

          <Container>
            <Tabs
              defaultActiveKey="bucket-list"
              transition={false}
              id="noanim-tab-example"
              className="mb-3"
            >
              <Tab eventKey="bucket-list" title='BUCKET LIST'>
                <Row>
                  {userData.bucketlist.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Tab>
              <Tab eventKey="visited" title="VISITED">
                <Row>
                  {userData.visited.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Tab>
              <Tab eventKey="created" title="CREATED">
                <Row>
                  {userData.created.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Tab>
            </Tabs>
          </Container>
        </>
        :
        <p>Loading</p>
      }
    </>
  )
}