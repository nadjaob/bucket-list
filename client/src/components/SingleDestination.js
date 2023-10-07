import { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, Link } from 'react-router-dom'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// COMPONENTS
import Spinner from './Spinner'
import axiosAuth from '../lib/axios'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faCheck } from '@fortawesome/free-solid-svg-icons'


export default function SingleDestination({ userId }) {

  console.log(userId)

  const [destination, setDestination] = useState()

  const { id } = useParams()

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
  }, [])

  console.log(destination)

  async function handleBucketlist() {
    try {
      const { data } = await axiosAuth.patch(`/api/destinations/${id}/bucketlist/`)
      console.log('success')
    } catch (error) {
      console.log(error)
      console.log('failed')
    }
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
                        <span>{destination.country}</span>
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
                <div className='buttons-container'>
                  <Link onClick={handleBucketlist}><span className='space-before-icon'>{destination.bucketlist.includes(userId) ? 'Add' : 'Remove'} to my bucket list</span>
                    <FontAwesomeIcon icon={faHeart} style={{ color: '#ffffff' }} />
                  </Link>
                  <Link><span className='space-before-icon'>Cross off my bucket list</span>
                    <FontAwesomeIcon icon={faCheck} style={{ color: '#ffffff' }} />
                  </Link>
                </div>
                <div className='details-container-w-border'>
                  <p>Travel experience: {destination.travel_experience}<br />
                  Best season: {destination.best_season}</p>
                </div>
              </Col>
            </Row>
          </Container>

          <Container>

          </Container>
        </>
        :
        <Spinner />
      }
    </>
  )
}