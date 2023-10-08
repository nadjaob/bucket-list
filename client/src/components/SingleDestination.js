import { useEffect, useState, useContext } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'
import { UserContext } from '../App'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'

// COMPONENTS
import Spinner from './Spinner'
import axiosAuth from '../lib/axios'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCheck, faTrashCan, faPen } from '@fortawesome/free-solid-svg-icons'


export default function SingleDestination({ userId }) {

  const { id } = useParams()
  console.log('id is', id)

  console.log(userId)
  const { user, setUser } = useContext(UserContext)
  const [formData, setFormData] = useState({ 'destination': id })
  const [errors, setErrors] = useState('')
  const [validated, setValidated] = useState(false)
  const [reviewSent, setReviewSent] = useState(false)
  const [reviewDeleted, setReviewDeleted] = useState(false)
  const [show, setShow] = useState(false)

  const [destination, setDestination] = useState()
  const [bucketlist, setBucketlist] = useState(false)
  const [visited, setVisited] = useState(false)



  useEffect(() => {
    async function getDestination(){
      try {
        const { data } = await axios.get(`/api/destinations/${id}`)
        console.log('first render', data)
        setDestination(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getDestination()
  }, [bucketlist, visited, reviewSent, reviewDeleted])

  console.log(destination)


  async function handleBucketlist() {
    try {
      if (destination.visited.some(destination => destination['id'] === userId) && !destination.bucketlist.includes(userId)) {
        const { data } = await axiosAuth.patch(`/api/destinations/${id}/visited/`)
      } else {
        const { data } = await axiosAuth.patch(`/api/destinations/${id}/bucketlist/`)
      }
      
      console.log('success bucketlist')
      if (!bucketlist) {
        setBucketlist(true)
      } else {
        setBucketlist(false)
      }
    } catch (error) {
      console.log(error)
      console.log('failed bucketlist')
    }
  }


  async function handleVisited() {
    try {
      const { data } = await axiosAuth.patch(`/api/destinations/${id}/visited/`)
      if (destination.bucketlist.includes(userId)) {
        const { data } = await axiosAuth.patch(`/api/destinations/${id}/bucketlist/`)
      }
      
      console.log('success visited')
      if (!visited) {
        setVisited(true)
      } else {
        setVisited(false)
      }
    } catch (error) {
      console.log(error)
      console.log('failed visited')
    }
  }


  // ADD COMMENT

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors('')
    setReviewSent(false)
  }

  async function handleSubmit(e) {
    console.log('hit submit button')
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    setValidated(true)
    e.preventDefault()
    try {
      const { data } = await axiosAuth.post('/api/comments/', formData)
      setFormData({ 'destination': id })
      e.target.reset()
      setValidated(false)
      setReviewSent(true)
      handleClose()
    } catch (error) {
      console.log(error)
      const errorMessage = error.response.data.detail
      console.error(errorMessage)
      setErrors(errorMessage)
    }
  }

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

  return (
    <>
      {destination ?
        <>
          <Container fluid className='header-bg-image' style={{ backgroundImage: `url(${destination.destination_image})` }}>
            <Row>
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
            <Row>
              <Col md={{ span: 8, offset: 2 }} className='description-container'>
                <p>{destination.description}</p>
                {user &&
                <div className='buttons-container'>
                  {destination.visited.some(destination => destination['id'] === userId) ?
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
                      <Link onClick={handleBucketlist}><span className='space-before-icon'>{destination.bucketlist.includes(userId) ? 'Remove from' : 'Add to'} my bucket list</span>
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
            </Row>
          </Container>

          <Container>
            <Row>
              <h3 className='mb-5'>Other people say about this destination:</h3>
              <Col md='7'>
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
                            {userId === comment.user.id &&
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
                      <Modal.Header closeButton>
                        <Modal.Title>Share your experience!</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p>Leave a comment about your unforgettable journey!</p>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete='off' className='form-comment'>
                          <Form.Group>
                            <Form.Label hidden htmlFor='title'>Title</Form.Label>
                            <Form.Control required type='text' name='title' placeholder='Title' value={formData['title']} onChange={handleChange}></Form.Control>
                            <Form.Control.Feedback type="invalid">Title is required.</Form.Control.Feedback>
                          </Form.Group>
                          <Form.Group>
                            <Form.Label hidden htmlFor='title'>Comment</Form.Label>
                            <Form.Control required as='textarea' rows={3} name='content' placeholder='Your comment' value={formData['content']} onChange={handleChange}></Form.Control>
                            <Form.Control.Feedback type="invalid">Your comment is required.</Form.Control.Feedback>
                          </Form.Group>
                          <button className='form-button' type='submit'>Submit comment</button>
                          {errors && <p>{errors}</p>}
                        </Form>
                      </Modal.Body>
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
                  {destination.visited.map(user => {
                    return (
                      <div key={user.id} className='user-title-container'>
                        <Link to={`/${user.username}`}><img className='user-img-sm' src={user.profile_image} alt={user.username} /></Link>
                        <div className='user-title-information'>
                          <Link to={`/${user.username}`}><p className='fw-bold'>{user.username}</p></Link>
                          <p className='user-bio-sm'>{user.bio}</p>
                        </div>
                      </div>
                    )
                  })}
                </>
                }
              </Col>
            </Row>
          </Container>
        </>
        :
        <Spinner />
      }
    </>
  )
}