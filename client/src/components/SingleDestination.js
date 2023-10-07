// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import sliderImage from '../images/rocky-mountains-canada.jpg'

export default function SingleDestination() {
  return (
    <Container fluid className='slider-container'>
      <Row>
        <Col>
          <img src={sliderImage} className='slider-image' />
          <p>Single Destination</p>
        </Col>
      </Row>
    </Container>
  )
}