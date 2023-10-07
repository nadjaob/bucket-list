// BOOTSTRAP
import Col from 'react-bootstrap/Col'
import { Link } from 'react-router-dom'

export default function DestinationCard({ destination }) {
  return (
    <Col md='4'>
      <Link to='/'>
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
      </Link>
    </Col>
  )
}