import { Link, NavLink, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'
import Select from 'react-select'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'

// IMAGES
import headerImage from '../images/rocky-mountains-canada.jpg'
import DestinationCard from './DestinationCard'

// COMPONENTS
import ImageUpload from './ImageUpload'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import axiosAuth from '../lib/axios'

export default function UserProfile({ userId, renderApp }) {

  const { username } = useParams()

  const { user, setUser } = useContext(UserContext)
  const [userData, setUserData] = useState()
  const [show, setShow] = useState(false)
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState('')
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()


  const [options, setOptions] = useState([])

  useEffect(() => {
    async function getCategories(){
      try {
        const { data } = await axios.get('/api/categories/')
        setOptions(data)
        console.log('all categories', data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getCategories()
  }, [])

  const handleSelect = (categories) => {
    setFormData({ ...formData, categories: categories.map(category => category.id) })
  }


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

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors('')
  }

  async function handleSubmit(e) {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    setValidated(true)
    e.preventDefault()
    try {
      const { data } = await axiosAuth.post(formData)

      navigate('/destinations/')

      handleCloseForm()

    } catch (error) {
      console.log(error)
      const errorMessage = error.response.data.detail
      console.error(errorMessage)
      setErrors(errorMessage)
    }
  }


  return (
    <>
      {userData ?
        <>
          <Container fluid>
            <img src={headerImage} className='header-image' />
          </Container>

          <Container>
            <Row>
              <Col className='profile-image' md='4'>
                <img src={userData.profile_image} />
              </Col>
              <Col className='profile-details' md='4'>
                <h1>{userData.username}</h1>
                <p>{userData.bio}</p>
                <p>Destinations on your bucket list: {userData.bucketlist.length}<br />
                Destinations visited: {userData.visited.length}</p>
                {userId === userData.id &&
                <>
                  <Link className='button' onClick={createDestination}><span className='space-before-icon'>Create a new destination</span>
                    <FontAwesomeIcon icon={faPen} style={{ color: '#ffffff' }} size='sm' />
                  </Link>
                  <Modal show={show} onHide={handleCloseForm} backdrop='static' keyboard={false} centered size='lg'>
                    <Modal.Header closeButton>
                      <Modal.Title>Add a new destination!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete='off' className='form-comment'>
                        <Form.Group>
                          <Form.Label hidden htmlFor='name'>Name</Form.Label>
                          <Form.Control required type='text' name='name' placeholder='Name of destination' value={formData['name']} onChange={handleChange}></Form.Control>
                          <Form.Control.Feedback type="invalid">Name is required.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label hidden htmlFor='description'>Description</Form.Label>
                          <Form.Control required as='textarea' rows={3} name='description' placeholder='Description' value={formData['description']} onChange={handleChange}></Form.Control>
                          <Form.Control.Feedback type="invalid">Description is required.</Form.Control.Feedback>
                        </Form.Group>
                        <ImageUpload required formData={formData} setFormData={setFormData} imageType='destination_image' />
                        <Form.Group>
                          <Form.Label hidden htmlFor='country'>Country</Form.Label>
                          <Form.Control required type='text' name='country' placeholder='Country' value={formData['country']} onChange={handleChange}></Form.Control>
                          <Form.Control.Feedback type="invalid">Country is required.</Form.Control.Feedback>
                        </Form.Group>
                        <ImageUpload required formData={formData} setFormData={setFormData} imageType='flag_image' />
                        <Form.Group>
                          <Form.Label hidden htmlFor='best_season'>Best season</Form.Label>
                          <Form.Control required type='text' name='best_season' placeholder='Best season' value={formData['best_season']} onChange={handleChange}></Form.Control>
                          <Form.Control.Feedback type="invalid">Season is required.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label hidden htmlFor='travel_experience'>Travel experience</Form.Label>
                          <Form.Control required type='text' name='travel_experience' placeholder='Travel experience' value={formData['travel_experience']} onChange={handleChange}></Form.Control>
                          <Form.Control.Feedback type="invalid">Travel experience is required.</Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group>
                          <Form.Label hidden htmlFor='categories'>Categories</Form.Label>
                          <Select
                            options={options.map(option => {
                              return { value: option.name, label: option.name, id: option.id }
                            })}
                            isMulti
                            name='categories'
                            onChange={handleSelect}
                          />
                        </Form.Group>
                        <button className='form-button' type='submit'>Add destination</button>
                        {errors && <p>{errors}</p>}
                      </Form>
                    </Modal.Body>
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