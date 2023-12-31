import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import { useParams, Link, useNavigate } from 'react-router-dom'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

// COMPONENTS
import Spinner from './Spinner'
import axiosAuth from '../lib/axios'
import UpdateDestination from './UpdateDestination'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCheck, faTrashCan, faPen, faTrash, faEnvelope } from '@fortawesome/free-solid-svg-icons'
import AddComment from './AddComment'


export default function SingleDestination({ user, userID, username, renderApp }) {

  const { id } = useParams()
  const catMenu = useRef(null)
  const redirect = useNavigate()

  const [reviewSent, setReviewSent] = useState(true)
  const [reviewDeleted, setReviewDeleted] = useState(false)
  const [show, setShow] = useState(false)
  const [renderDestination, setRenderDestination] = useState(false)
  const [allUsers, setAllUsers] = useState([])
  const [invitationData, setInvitationData] = useState({})
  const [successfulInvitation, setSuccessfulInvitation] = useState()
  const [errorInvitation, setErrorInvitation] = useState()
  const [value, setValue] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  const [friend, setFriend] = useState()
  const [destination, setDestination] = useState()
  const [showEdit, setShowEdit] = useState(false)


  useEffect(() => {
    async function getDestination(){
      try {
        const { data } = await axios.get(`/api/destinations/${id}/`)
        setDestination(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getDestination()
  }, [reviewSent, reviewDeleted, renderDestination, renderApp])

  // BUTTONS ADD AND REMOVE FROM BUCKETLIST
  async function handleBucketlist() {
    try {
      if (destination.visited.some(destination => destination['id'] === userID) && !destination.bucketlist.includes(userID)) {
        const { data } = await axiosAuth.patch(`/api/destinations/${id}/visited/`)
      } else {
        const { data } = await axiosAuth.patch(`/api/destinations/${id}/bucketlist/`)
      }
      if (!renderDestination) {
        setRenderDestination(true)
      } else {
        setRenderDestination(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  async function handleVisited() {
    try {
      const { data } = await axiosAuth.patch(`/api/destinations/${id}/visited/`)
      if (destination.bucketlist.includes(userID)) {
        const { data } = await axiosAuth.patch(`/api/destinations/${id}/bucketlist/`)
      }
      if (!renderDestination) {
        setRenderDestination(true)
      } else {
        setRenderDestination(false)
      }
    } catch (error) {
      console.log(error)
    }
  }


  // ADD COMMENT
  const handleShow = () => setShow(true)
  const handleClose = () => setShow(false)

  // DELETE COMMENT
  const deleteComment = (e, index) => {
    setReviewDeleted(false)
    e.preventDefault()
    async function deleteReviewNow() {
      try {
        const { data } = await axiosAuth.delete(`/api/comments/${index}/`)
        setReviewDeleted(true)
      } catch (error) {
        console.log(error)
      }
    }
    deleteReviewNow()
  }


  // EDIT DESTINATION
  const editDestination = () => setShowEdit(true)
  const handleCloseForm = () => setShowEdit(false)

  // DELETE DESTINATION
  const deleteDestination = () => {
    async function deleteItem() {
      try {
        const { data } = await axiosAuth.delete(`/api/destinations/${id}/`)
        redirect(`/${username}/`)
      } catch (error) {
        console.log(error)
      }
    }
    deleteItem()
  }


  // INVITE A FRIEND
  useEffect(() => {
    async function getUsers(){
      try {
        const { data } = await axios.get('/api/auth/users/')
        setAllUsers(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getUsers()
    
  }, [])

  useEffect(() => {
    const regex = new RegExp(value, 'i')
    const filteredArray = allUsers.filter(user => {
      if (user.id !== userID) {
        return value && (regex.test(user.username))
      }
    })
    setFilteredUsers(filteredArray)
  }, [value])

  const handleInvitationData = (e) => {
    setValue(e.target.value)
    setErrorInvitation()
    setSuccessfulInvitation()
  }

  const handleFriend = (name, id) => {
    setFriend(name)
    setInvitationData({ 'user_id_to_invite': id })
  }

  async function handleInvitation(e) {
    setValue('')
    e.preventDefault()
    try {
      const { data } = await axiosAuth.patch(`/api/destinations/${id}/invitations/`, invitationData)
      setSuccessfulInvitation(friend)
    } catch (error) {
      console.log(error)
      const errorMessageInvitation = error.response.data.error
      console.error(errorMessageInvitation)
      setErrorInvitation(errorMessageInvitation)
    }
    setFriend()
  }

  const removeSearchlist = () => {
    setValue('')
    setFilteredUsers([])
  }

  const closeSearchList = (e) => {
    if (catMenu.current && !catMenu.current.contains(e.target)) {
      setValue('')
    }
  }
  document.addEventListener('mousedown', closeSearchList)


  return (
    <>
      {destination ?
        <>
          <Container fluid className='header-bg-image'>
            <img src={destination.destination_image} />
            <Row className='content-after-header-img'>
              <Col>
                <Container className='content-on-header'>
                  <Row>
                    <Col>
                      <h1>{destination.name}</h1>
                      <div className='country-container'>
                        <img src={destination.flag_image} alt={destination.country} />
                        <h2>{destination.country}</h2>
                      </div>
                      <div className='categories'>
                        {destination.categories.map(category => {
                          return <span key={category.id} className='category-button'>{category.name}</span>
                        })}
                      </div>
                    </Col>
                  </Row>
                </Container>
              </Col>
            </Row>
          </Container>
          <Container>
            {userID === destination.user.id &&
            <Row>
              <Col className='edit-icons'>
                <Link onClick={editDestination}><FontAwesomeIcon icon={faPen} style={{ color: '#ffffff' }} /></Link>
                <Link onClick={deleteDestination}><FontAwesomeIcon icon={faTrash} style={{ color: '#ffffff' }} /></Link>
              </Col>
            </Row>
            }
            <Row>
              <Col md={{ span: 10, offset: 1 }} lg={{ span: 8, offset: 2 }} className='description-container'>
                <p>{destination.description}</p>
                {user &&
                <div className='buttons-container'>
                  {destination.visited.some(destination => destination['id'] === userID) ?
                    <>
                      <Link onClick={handleBucketlist}><span className='space-before-icon'>Remove from my bucket list</span>
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ffffff' }} />
                      </Link>
                      <Link disabled className='active-button'><span className='space-before-icon'>You have already visited this place</span>
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#ffffff' }} />
                      </Link>
                    </>
                    :
                    <>
                      <Link onClick={handleBucketlist}><span className='space-before-icon'>{destination.bucketlist.includes(userID) ? 'Remove from' : 'Add to'} my bucket list</span>
                        <FontAwesomeIcon icon={faHeart} style={{ color: '#ffffff' }} />
                      </Link>
                      <Link onClick={handleVisited}><span className='space-before-icon'>Cross off my bucket list</span>
                        <FontAwesomeIcon icon={faCheck} style={{ color: '#ffffff' }} />
                      </Link>
                    </>
                  }
                </div>
                }
                <div className='details-container-w-border'>
                  <p>Travel experience: {destination.travel_experience}<br />
                  Best season: {destination.best_season}</p>
                </div>
              </Col>
              <Col>
                {user &&
                  <>
                    <div className='container-user-search'  ref={catMenu}>
                      <input type='text' className='search-container-input input-search' value={value} onChange={handleInvitationData} placeholder='Search friends...'></input>
                      <Button className='button-invite' onClick={handleInvitation}>Invite {friend ? <><span className='space-before-icon'>{friend}</span><FontAwesomeIcon icon={faEnvelope} shake style={{ color: '#ffffff' }} size='sm' /></> : 'a friend!'}</Button>
                      <div className='dropdown-user-search' onClick={removeSearchlist}>
                        {filteredUsers.map(user => {
                          return (
                            <div key={user.id} className='search-list'>
                              <Link onClick={() => handleFriend(user.username, user.id)}>
                                <p>{user.username}</p>
                              </Link>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                    {(value && filteredUsers.length < 1) &&
                        <div style={{ textAlign: 'center', color: 'red', position: 'relative', top: '-60px', marginBottom: '-38px' }}>
                          <p>No users with this name found!</p>
                        </div>
                    }
                    {errorInvitation && <p className='error-invitation'>{errorInvitation}!</p>}
                    {successfulInvitation && <p className='successful-invitation'>You successfully invited {successfulInvitation}!</p>}
                  </>
                }
              </Col>
            </Row>
          </Container>
          <Container>
            <Row>
              <h3 className='mb-5'>Other people say about this destination:</h3>
              <Col md='7' className='mb-5'>
                {destination.comments.length > 0 ?
                  <>
                    {destination.comments.map(comment => {
                      return (
                        <div key={comment.id} className='comment-container'>
                          <div className='comment-container-inside'>
                            <div className='user-title-container'>
                              <Link to={`/${comment.user.username}`}><img className='user-img-sm' src={comment.user.profile_image} alt={comment.user.username} /></Link>
                              <div className='user-title-information'>
                                <Link to={`/${comment.user.username}`}><p>{comment.user.username}</p></Link>
                                <p className='fw-bold'>{comment.title}</p>
                              </div>
                            </div>
                            {userID === comment.user.id &&
                            <div className='trash-icon'>
                              <FontAwesomeIcon onClick={(e) => deleteComment(e, comment.id)} icon={faTrashCan} style={{ color: '#fff' }} />
                            </div>
                            }
                          </div>
                          <p className='mt-2'>{comment.content}</p>
                        </div>
                      )
                    })} 
                  </>
                  :
                  <p>Unfortunately there are no comments yet.</p>
                }
                {user &&
                  <>
                    <Link className='button-border' onClick={handleShow}><span className='space-before-icon'>Leave a comment</span>
                      <FontAwesomeIcon icon={faPen} style={{ color: '#ffffff' }} size='sm' />
                    </Link>
                    <Modal show={show} onHide={handleClose} backdrop='static' keyboard={false} centered size='lg'>
                      <AddComment id={id} handleClose={handleClose} setReviewSent={setReviewSent} />
                    </Modal>
                  </>
                }
              </Col>
              <Col md='2'></Col>
              <Col md='3'>
                <h4 className='h4-sidebar'>Created by</h4>
                <div className='user-title-container'>
                  <Link to={`/${destination.user.username}`}><img className='user-img-sm' src={destination.user.profile_image} alt={destination.user.username} /></Link>
                  <div className='user-title-information'>
                    <Link to={`/${destination.user.username}`}><p className='fw-bold'>{destination.user.username}</p></Link>
                    <p className='user-bio-sm'>{destination.user.bio}</p>
                  </div>
                </div>
                {destination.visited.length > 0 &&
                <>
                  <h4 className='h4-sidebar mt-4'>Visited by</h4>
                  {destination.visited.slice(0,3).map(user => {
                    if (user.username !== destination.user.username) {
                      return (
                        <div key={user.id} className='user-title-container'>
                          <Link to={`/${user.username}`}><img className='user-img-sm' src={user.profile_image} alt={user.username} /></Link>
                          <div className='user-title-information'>
                            <Link to={`/${user.username}`}><p className='fw-bold'>{user.username}</p></Link>
                            <p className='user-bio-sm'>{user.bio}</p>
                          </div>
                        </div>
                      )
                    }
                  })}
                </>
                }
              </Col>
            </Row>
          </Container>
          <Modal show={showEdit} onHide={handleCloseForm} backdrop='static' keyboard={false} centered size='lg'>
            <UpdateDestination handleCloseForm={handleCloseForm} setRenderDestination={setRenderDestination} renderDestination={renderDestination} />
          </Modal>
        </>
        :
        <Spinner />
      }
    </>
  )
}