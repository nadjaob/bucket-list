// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

// COMPONENTS
import Slider from './Slider'

export default function Home() {
  return (
    <>
      <Slider />
      <Container>
        <Row>
          <Col>HOME</Col>
        </Row>
      </Container>
    </>
  )
}