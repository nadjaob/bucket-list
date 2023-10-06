// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export default function DestinationCard({ destination }) {
  return (
    <Col lg='4'>
      <div className='destinationcard-container'>
        <img src={destination.destination_image} alt={destination.name} />
        <div className='details-container'>
          <h3>{destination.name}</h3>
          <div className='country-container'>
            <img src={destination.flag_image} alt={destination.country} />
            <span>{destination.country}</span>
          </div>
        </div>
      </div>
    </Col>
  )
}