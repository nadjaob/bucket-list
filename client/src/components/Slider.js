import { useEffect, useState } from 'react'
import axios from 'axios'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Carousel from 'react-bootstrap/Carousel'

import sliderImage from '../images/rocky-mountains-canada.jpg'
import { Link } from 'react-router-dom'




export default function Slider() {

  const [slides, setSlides] = useState()

  useEffect(() => {
    async function getDestinations(){
      try {
        const { data: destinations } = await axios.get('/api/destinations')
        setSlides(destinations.slice(0,4))
      } catch (error) {
        console.log(error.message)
      }
    }
    getDestinations()
  }, [])


  return (
    <Carousel fade>
      {slides && slides.map(slide => {
        return (
          <Carousel.Item key={slide.id}>
            {/* <img src={slide.destination_image} alt={slide.name} /> */}
            <img src={sliderImage} />
            <Carousel.Caption>
              <Container>
                <Row>
                  <Col md='6'>
                    <h1 className='mb-3'>{slide.name}</h1>
                    <Link to={`/destinations/${slide.id}`} className='button-slider'>View destination</Link>
                  </Col>
                </Row>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        )
      })}
      
    </Carousel>
  )
}