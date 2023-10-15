import { useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

// BOOTSTRAP
import Form from 'react-bootstrap/Form'

// COMPONENTS
import ImageUpload from './ImageUpload'

// UTILS
import { stateValues, fieldValues } from '../utils/common'
import { setToken } from '../lib/auth'

export default function UserForm({ setUser, request, fields, title, handleCloseLogin, handleCloseRegister }) {

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
      setToken('access-token', data.access)
      setToken('refresh-token', data.refresh)
      handleCloseLogin()
      handleCloseRegister()
      navigate(`/${formData.username}`)
    } catch (error) {
      if (error.response.data.detail) {
        setErrors(error.response.data.detail)
      } else if (error.response.status === 422) {
        setErrors(error.response.data.non_field_errors)
      }
    }
  }

  
  return (
    <Fragment>
      {fields.length > 0 ?
        <Form noValidate validated={validated} onSubmit={handleSubmit} autoComplete='off' lg='12'>
          {errors && <p className='display-errors'>{errors}</p>}
          {fieldValues(fields).map(field => {
            const { type, name, variable } = field
            return (
              <Fragment key={variable}>
                {type === 'image' ?
                  <>
                    <span>Upload a profile image:</span>
                    <ImageUpload formData={formData} setFormData={setFormData} imageType={variable} />
                  </>
                  :
                  <>
                    <Form.Label hidden htmlFor={variable}>{name}</Form.Label>
                    <Form.Control required type={type} name={variable} placeholder={name} value={formData[variable]} onChange={handleChange}></Form.Control>
                    <Form.Control.Feedback type="invalid">{name} is required.</Form.Control.Feedback>
                  </>
                }  
                
              </Fragment>
            )
          })}
          <button className='form-button' type='submit'>{title}</button>
        </Form>
        :
        'Form Error'
      }
    </Fragment>
  )
}