import { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

// UTILS
import { stateValues, fieldValues } from '../utils/common'
import { setToken } from '../lib/auth'

export default function UserForm({ request, fields, title, handleCloseLogin, handleCloseRegister }) {

  const [formData, setFormData] = useState(stateValues(fields))
  const [errors, setErrors] = useState('')
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

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
      const { data } = await request(formData)
      console.log(data)

      if (data.access) {
        setToken('access-token', data.access)
        setToken('refresh-token', data.refresh)
      }

      handleCloseLogin()
      handleCloseRegister()
      navigate('/destinations')

    } catch (error) {
      console.log(error)
      const errorMessage = error.response.data.detail
      console.error(errorMessage)
      setErrors(errorMessage)
    }
  }

  return (
    <Fragment>
      {fields.length > 0 ?
        <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete='off' lg='12'>
          {fieldValues(fields).map(field => {
            const { type, name, variable } = field
            return (
              <Fragment key={variable}>
                <Form.Label hidden htmlFor={variable}>{name}</Form.Label>
                <Form.Control required type={type} name={variable} placeholder={name} value={formData[variable]} onChange={handleChange}></Form.Control>
                <Form.Control.Feedback type="invalid">{name} is required.</Form.Control.Feedback>
              </Fragment>
            )
          })}

          <button className='form-button' type='submit'>{title}</button>
          {errors && <p>{errors}</p>}
        </Form>
        :
        'Form Error'
      }
    </Fragment>
  )
}