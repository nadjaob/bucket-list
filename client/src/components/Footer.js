// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// ICONS
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons'
import { Link } from 'react-router-dom'


export default function Footer() {
  return (
    <footer>
      <Container fluid>
        <Container>
          <Row>
            <Col className='footer-container'>
              <p>© Nadja Oblaender 2023</p>
              <div className='footer-icons'>
                <Link to='https://www.linkedin.com/in/nadja-oblaender-00b05b265/' target='_blank'><FontAwesomeIcon icon={faLinkedin} size='xl' style={{ color: '#fff' }} /></Link>
                <Link to='https://github.com/nadjaob' target='_blank'><FontAwesomeIcon icon={faGithub} size='xl' style={{ color: '#fff' }} /></Link>
              </div>
            </Col>
          </Row>
        </Container>
      </Container>
    </footer>
    
  )
}