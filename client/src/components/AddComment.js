import { useState } from 'react'
import axiosAuth from '../lib/axios'

// BOOTSTRAP
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'


export default function AddComment({ id, handleClose, setReviewSent }) {

  const [formData, setFormData] = useState({ 'destination': id })
  const [errors, setErrors] = useState('')
  const [validated, setValidated] = useState(false)

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setErrors('')
    setReviewSent(false)
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

  return (
    <>
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
    </>
  )
}