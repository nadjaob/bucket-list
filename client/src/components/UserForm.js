import { useState, Fragment, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserContext } from '../App'
import axios from 'axios'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'

// COMPONENTS
import ImageUpload from './ImageUpload'

// UTILS
import { stateValues, fieldValues } from '../utils/common'
import { setToken } from '../lib/auth'

export default function UserForm({ request, fields, title, handleCloseLogin, handleCloseRegister }) {

  const { user, setUser } = useContext(UserContext)
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

      if (data.access) {
        setToken('access-token', data.access)
        setToken('refresh-token', data.refresh)
        setUser(true)
        navigate(`/${formData.username}`)
      }
      handleCloseLogin()
      handleCloseRegister()

    } catch (error) {
      console.log(error)
      const errorObj = error.response.data
      const errorMessage = Object.values(errorObj)[0]
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
                {type === 'image' ?
                  <ImageUpload required formData={formData} setFormData={setFormData} imageType={variable} />
                  :
                  <>
                    <Form.Label hidden htmlFor={variable}>{name}</Form.Label>
                    <Form.Control required type={type} name={variable} placeholder={name} value={formData[variable]} onChange={handleChange}></Form.Control>
                  </>
                }  
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