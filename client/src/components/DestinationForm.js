import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Select from 'react-select'
import axios from 'axios'


// BOOTSTRAP
import Modal from 'react-bootstrap/Modal'
import Form from 'react-bootstrap/Form'


// COMPONENTS
import ImageUpload from './ImageUpload'



export default function DestinationForm({ title, handleCloseForm, request, onLoad }) {

  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState('')
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()
  const [selectedCategories, setSelectedCategories] = useState([])

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

  useEffect(() => {
    async function fillFormFields() {
      try {
        const { data } = await onLoad()
        data.categories = data.categories.map(category => category.id)
        console.log('my data', data)
        setFormData(data)
        setSelectedCategories(formData.categories)
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
    setFormData({ ...formData, categories: categories.map(category => category.id) })
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
      const { data } = await request(formData)
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
      <Modal.Header closeButton>
        <Modal.Title>{title} a new destination!</Modal.Title>
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
            {/* {selectedCategories.length > 0 ?
              <Select
                options={options.map(option => {
                  return { value: option.name, label: option.name, id: option.id }
                })}
                isMulti
                name='categories'
                onChange={handleSelect}
                defaultValue={selectedCategories}
              />
              : */}
            <Select
              options={options.map(option => {
                return { value: option.id, label: option.name, id: option.id }
              })}
              isMulti
              name='categories'
              onChange={handleSelect}
            />
            {/* } */}
          </Form.Group>
          <button className='form-button' type='submit'>{title} destination</button>
          {errors && <p>{errors}</p>}
        </Form>
      </Modal.Body>
    </>
  )
}



