import { Link, NavLink, useParams } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect, useContext } from 'react'
import { UserContext } from '../App'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tab from 'react-bootstrap/Tab'
import Tabs from 'react-bootstrap/Tabs'

// IMAGES
import headerImage from '../images/rocky-mountains-canada.jpg'
import DestinationCard from './DestinationCard'

export default function UserProfile() {

  const { username } = useParams()

  const { user, setUser } = useContext(UserContext)
  const [userData, setUserData] = useState()

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data } = await axios.get(`/api/auth/${username}`)
        setUserData(data)
      } catch (error) {
        console.log(error)
      }
    }
    getUserData()
  }, [])

  return (
    <>
      {userData ?
        <>
          <Container fluid>
            <img src={headerImage} className='header-image' />
          </Container>

          <Container>
            <Row>
              <Col className='profile-image' md='4'>
                <img src={userData.profile_image} />
              </Col>
              <Col className='profile-details' md='4'>
                <h1>{userData.username}</h1>
                <p>{userData.bio}</p>
                <p>Destinations on your bucket list: {userData.bucketlist.length}<br />
                Destinations visited: {userData.visited.length}</p>
                <button className='button'>Create a new destination</button>
              </Col>
            </Row>
          </Container>

          <Container>
            <Tabs
              defaultActiveKey="bucket-list"
              transition={false}
              id="noanim-tab-example"
              className="mb-3"
            >
              <Tab eventKey="bucket-list" title='BUCKET LIST'>
                <Row>
                  {userData.bucketlist.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Tab>
              <Tab eventKey="visited" title="VISITED">
                <Row>
                  {userData.visited.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Tab>
              <Tab eventKey="created" title="CREATED">
                <Row>
                  {userData.created.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Tab>
            </Tabs>
          </Container>



        </>
        :
        <p>Loading</p>
      
      }
      
    </>
  )
}