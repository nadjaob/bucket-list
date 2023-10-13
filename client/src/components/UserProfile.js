import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useContext, Fragment } from 'react'
import { UserContext } from '../App'
import axiosAuth from '../lib/axios'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Modal from 'react-bootstrap/Modal'
import Carousel from 'react-bootstrap/Carousel'
import Accordion from 'react-bootstrap/Accordion'


// IMAGES
import DestinationCard from './DestinationCard'

// COMPONENTS
import CreateDestination from './CreateDestination'
import Spinner from './Spinner'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCheck, faTrashCan, faPen, faEnvelope } from '@fortawesome/free-solid-svg-icons'


export default function UserProfile({ userId, renderApp }) {

  const { username } = useParams()

  const { user, setUser } = useContext(UserContext)
  const [userData, setUserData] = useState()
  const [show, setShow] = useState(false)
  const [showInvitationsModal, setShowInvitationsModal] = useState(false)
  const [removeInvitation, setRemoveInvitation] = useState(false)


  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${username}/`)
        setUserData(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [renderApp, removeInvitation])


  // CREATE DESTINATION

  const createDestination = () => setShow(true)
  const handleCloseForm = () => setShow(false)

  
  // HANDLE INVITATION

  const handleInvitationsModal = () => setShowInvitationsModal(true)
  const closeInvitationsModal = () => setShowInvitationsModal(false)

  async function handleAcceptInvitation(destinationId) {
    console.log('id of invitation', destinationId)
    console.log('condition to check', !userData.bucketlist.some(destination => destination['id'] === destinationId))
    try {
      handleDeleteInvitation(destinationId)
      console.log('deleted invitation')
      // check if bucketlist contains destination not yet, then add it to bucketlist
      if (!userData.bucketlist.some(destination => destination['id'] === destinationId)) {
        const { data } = await axiosAuth.patch(`/api/destinations/${destinationId}/bucketlist/`)
        console.log('added to bucketlist')
        // remove from visited in case its there
        if (userData.visited.some(destination => destination['id'] === destinationId)) {
          const { data } = await axiosAuth.patch(`/api/destinations/${destinationId}/visited/`)
        }
      } else {
        console.log('destination is already in bucket list')
      }
      
      
    } catch (error) {
      console.log(error)
      console.log('failed invitation')
    }
  }


  async function handleDeleteInvitation(destinationId) {
    console.log('destination id', destinationId)
    console.log('user id', userId)
    console.log('request body')
    try {
      const { data } = await axiosAuth.delete(`/api/destinations/${destinationId}/invitations/delete/`, { data: { invitation_id: userId } })
      console.log('deleted invitation')
      if (!removeInvitation) {
        setRemoveInvitation(true)
      } else {
        setRemoveInvitation(false)
      }
    } catch (error) {
      console.log(error)
      console.log('failed invitation')
    }
  }


  return (
    <>
      {userData ?
        <>
          <Container fluid className='user-bg'>
            <img src={userData.profile_image} className='header-image' />
          </Container>

          <Container>
            <Row className='container-profile-details'>
              <Col sm='6' className='profile-image'>
                <img src={userData.profile_image} />
              </Col>
              <Col sm='6' className='profile-details'>
                <h1>{userData.username}</h1>
                <p className='user-bio-sm'>{userData.bio}</p>
                <p>Destinations on your bucket list: {userData.bucketlist.length}<br />
                Destinations visited: {userData.visited.length}</p>

                {(userId === userData.id) && userData.invitations.length > 0 && 
                <>
                  <Link className='button' onClick={handleInvitationsModal}><span className='space-before-icon'>You have {userData.invitations.length} new invitation{userData.invitations.length > 1 ? 's' : ''}!</span>
                    <FontAwesomeIcon icon={faEnvelope} style={{ color: '#ffffff' }} size='sm' />
                  </Link>
                  <Modal className='container-invitations' show={showInvitationsModal} onHide={closeInvitationsModal} backdrop='static' keyboard={false} centered size='md'>
                    <Modal.Header closeButton>
                      <Modal.Title>You have {userData.invitations.length} new invitation{userData.invitations.length > 1 ? 's' : ''}!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      {userData.invitations.map(destination => {
                        return (
                          <Fragment key={destination.id}>
                            <DestinationCard destination={destination} />
                            <div className='buttons-container mb-4'>
                              <Link onClick={() => handleAcceptInvitation(destination.id)}><span className='space-before-icon'>Accept invitation</span>
                                <FontAwesomeIcon icon={faHeart} style={{ color: '#ffffff' }} />
                              </Link>
                              <Link onClick={() => handleDeleteInvitation(destination.id)}><span className='space-before-icon'>Decline invitation</span>
                                <FontAwesomeIcon icon={faTrashCan} style={{ color: '#ffffff' }} />
                              </Link>
                            </div>
                          </Fragment>
                        )
                      })}
                    </Modal.Body>
                  </Modal>
                </>
                }
                
              </Col>
            </Row>
          </Container>

          <Container className='mb-6'>
            <Row>
              <Col className='button-create-destination'>
                {userId === userData.id &&
                <>
                  <Link className='button' onClick={createDestination}><span className='space-before-icon'>Create a new destination</span>
                    <FontAwesomeIcon icon={faPen} style={{ color: '#ffffff' }} size='sm' />
                  </Link>
                  <Modal show={show} onHide={handleCloseForm} backdrop='static' keyboard={false} centered size='xl'>
                    <CreateDestination handleCloseForm={handleCloseForm} />
                  </Modal>
                </>
                }
              </Col>
            </Row>
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
        <Spinner />
      }
    </>
  )
}