import { useEffect, useState } from 'react'
import axios from 'axios'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// COMPONENTS
import Slider from './Slider'
import DestinationCard from './DestinationCard'
import Spinner from './Spinner'
import { Link } from 'react-router-dom'

export default function Home() {

  const itemsPerPage = 8
  const [destinations, setDestinations] = useState([])
  const [pageNumber, setPageNumber] = useState(1)

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
  }, [pageNumber])

  const loadMore = () => {
    setPageNumber(pageNumber + 1)
  }


  return (
    <>
      {destinations.length > 0 ?
        <Slider />
        :
        <Spinner />
      }
      <Container>
        <Row>
          <Col className='headings-center'>
            <h2>Where to next?</h2>
            <h1>Choose your bucket list destinations</h1>
          </Col>
        </Row>
        {destinations.length > 0 ?
          <>
            <Row className='mb-4 container-destination-card'>
              {destinations.slice(0, itemsPerPage * pageNumber).map(destination => {
                return (
                  <DestinationCard destination={destination} key={destination.id} />
                )
              })}
            </Row>
            <Row>
              {destinations.length > (itemsPerPage * pageNumber) &&
              <Col className='text-center mt-5 mb-5'>
                <Link className='button' onClick={loadMore}>Load more</Link>
              </Col>
              }
            </Row>
          </>
          :
          <Spinner />
        }
      </Container>
    </>
  )
}