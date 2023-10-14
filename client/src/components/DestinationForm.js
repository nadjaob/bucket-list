import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'

// BOOTSTRAP
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// COMPONENTS
import ImageUpload from './ImageUpload'


export default function DestinationForm({ title, handleCloseForm, request, onLoad, setRenderDestination, renderDestination }) {

  const [formData, setFormData] = useState({ categories: [] })
  const [options, setOptions] = useState([])
  const [selectedCategories, setSelectedCategories] = useState()
  const [errors, setErrors] = useState('')
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()


  useEffect(() => {
    async function getCategories(){
      try {
        const { data } = await axios.get('/api/categories/')
        setOptions(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getCategories()
  }, [])

  useEffect(() => {
    async function fillFormFields() {
      try {
        const { data } = await onLoad()
        setSelectedCategories(data.categories)
        setFormData({
          name: data.name,
          description: data.description,
          destination_image: data.destination_image,
          country: data.country,
          flag_image: data.flag_image,
          best_season: data.best_season,
          travel_experience: data.travel_experience,
          categories: data.categories.map(category => {
            return { ...category, label: category.name, value: category.id }
          }),
        })
      } catch (error) {
        console.log(error)
        setErrors(error)
      }
    }
    if (onLoad) {
      fillFormFields()
    }
  }, [onLoad])

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors('')
  }

  const handleSelect = (categories) => {
    setFormData({ ...formData, categories })
  }

  async function handleSubmit(e) {
    const form = e.currentTarget
    if (form.checkValidity() === false) {
      e.preventDefault()
      e.stopPropagation()
    }
    setValidated(true)
    e.preventDefault()
    const reformattedFormdata = { ...formData, categories: formData.categories.map(category => category.id) }
    try {
      const { data } = await request(reformattedFormdata)
      navigate(`/destinations/${data.id}/`)
      if (!renderDestination) {
        setRenderDestination(true)
      } else {
        setRenderDestination(false)
      }
      handleCloseForm()
    } catch (error) {
      console.log(error)
      const errorMessage = error.response.data.detail
      console.error(errorMessage)
      setErrors(errorMessage)
    }
  }


  // REACT SELECT STYLING
  const customStyles = {
    option: (defaultStyles, state) => ({
      ...defaultStyles,
      color: state.isSelected ? '#fff' : '#222',
      backgroundColor: state.isSelected ? '#222' : '#fff',
    }),

    control: (defaultStyles) => ({
      ...defaultStyles,
      backgroundColor: '#fff',
      padding: '4px',
      borderRadius: '10px',
      boxShadow: 'none',
      fontSize: '14px',
    }),
    
    singleValue: (defaultStyles) => ({ ...defaultStyles, color: '#fff' }),
  }


  return (
    <>
      <Modal.Header closeButton>
        <Modal.Title>{title} a new destination!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete='off' className='form-comment'>
          <Container style={{ padding: '0px' }}>
            <Row>
              <Col sm='12' md='6'>
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
                <Form.Group>
                  <Form.Label hidden htmlFor='country'>Country</Form.Label>
                  <Form.Control required type='text' name='country' placeholder='Country' value={formData['country']} onChange={handleChange}></Form.Control>
                  <Form.Control.Feedback type="invalid">Country is required.</Form.Control.Feedback>
                </Form.Group>
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
              </Col>
              <Col sm='12' md='6'>
                <Form.Group>
                  <Form.Label hidden htmlFor='categories'>Categories</Form.Label>
                  <Select
                    className='mb-3'
                    options={options.map(option => {
                      return { value: option.name, label: option.name, id: option.id }
                    })}
                    isMulti
                    name='categories'
                    onChange={handleSelect}
                    styles={customStyles}
                    placeholder={'Select categories'}
                    value={formData.categories}
                  />
                  {console.log('selected categories', selectedCategories)}
                </Form.Group>
                <span>Image of destination:</span>
                <ImageUpload required formData={formData} setFormData={setFormData} imageType='destination_image' />
                <span>Image of flag:</span>
                <ImageUpload required formData={formData} setFormData={setFormData} imageType='flag_image' />
                
              </Col>
            </Row>
          </Container>
          <button className='form-button' type='submit'>{title} destination</button>
          {errors && <p>{errors}</p>}
        </Form>
      </Modal.Body>
    </>
  )
}



