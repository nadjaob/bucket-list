import { useEffect, useState } from 'react'
import axios from 'axios'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// IMAGES
import headerImage from '../images/rocky-mountains-canada.jpg'

// COMPONENTS
import Spinner from './Spinner'
import DestinationCard from './DestinationCard'

export default function Destinations() {

  const [destinations, setDestinations] = useState([])

  useEffect(() => {
    async function getDestinations(){
      try {
        const { data } = await axios.get('/api/destinations')
        setDestinations(data)
      } catch (error) {
        console.log(error.message)
      }
    }
    getDestinations()
  }, [])


  return (
    <>
      <Container fluid>
        <Row>
          <Col><img src={headerImage} className='header-image' /></Col>
        </Row>
      </Container>
      <Container>
        <Row>
          <Col>
            <h2>Where to next?</h2>
            <h1>Choose your bucket list destinations</h1>
          </Col>
        </Row>
      </Container>
      {destinations.length > 0 ?
        <Container>
          <Row>
            {destinations.map(destination => {
              return (
                <DestinationCard destination={destination} key={destination.id} />
              )
            })}
          </Row>
        </Container>
        :
        <Spinner />
      }

    </>
  )
}