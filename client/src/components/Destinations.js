import { useEffect, useState } from 'react'
import axios from 'axios'

// BOOTSTRAP
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Accordion from 'react-bootstrap/Accordion'
import Form from 'react-bootstrap/Form'

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

  const [filter, setFilter] = useState({
    country: 'All',
    categories: 'All',
  })
  const [countryFilter, setCountryFilter] = useState([])
  const [filteredDestinations, setFilteredDestinations] = useState([])

  const allCountries = destinations.map(destination => {
    return destination.country
  })
  const countriesList = [...new Set(allCountries)]

  const allCategories = destinations.map(destination => {
    return destination.categories.map(category => {
      return category.name
    })
  })
  const categoriesList = [...new Set(allCategories.flat())]


  const handleChange = (e) => {
    if (e.target.name === 'country') {
      if (!e.target.checked) {
        setCountryFilter(countryFilter => {
          return countryFilter.filter(country => country !== e.target.id)
        })
      } else {
        setCountryFilter([ ...countryFilter, e.target.id])
      }
      
      setFilter({ ...filter, [e.target.name]: countryFilter })
    }
    console.log('countryfilter', countryFilter)
    if (filter[e.target.name] === e.target.id) {
      setFilter({ ...filter, [e.target.name]: 'All' })
    } else {
      setFilter({ ...filter, [e.target.name]: e.target.id })
    }
    // setFilter(newFilterState)
  }

  useEffect(() => {
    const filteredArray = destinations.filter(destination => {
      const categoriesArray = destination.categories.map(category => {
        return category.name
      })
      console.log('my array to check', categoriesArray)
      return (
        (destination.country === filter.country || filter.country === 'All') &&
        (categoriesArray.includes(filter.categories) || filter.categories === 'All')
      )
    })
    setFilteredDestinations(filteredArray)
    console.log('filtered destinations', filteredDestinations)
  }, [filter, destinations])

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
      <Container>
        <Row>
          <Col md='2'>
            <h4>Filter</h4>
            <Form>
              <Accordion defaultActiveKey={['0']} alwaysOpen>
                <Accordion.Item eventKey='0'>
                  <Accordion.Header>Country</Accordion.Header>
                  <Accordion.Body>
                    {countriesList.map((country, index) => {
                      return (
                        <Form.Check key={index} onChange={handleChange} type='checkbox' name='country' id={country} label={country} />
                      )
                    })}
                  </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                  <Accordion.Header>Categories</Accordion.Header>
                  <Accordion.Body>
                    {categoriesList.map((category, index) => {
                      return (
                        <Form.Check key={index} onChange={handleChange} type='checkbox' name='categories' id={category} label={category} />
                      )
                    })}
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Form>
          </Col>
          <Col md='10'>
            {destinations.length > 0 ?
              <Container>
                <Row>
                  {filteredDestinations.map(destination => {
                    return (
                      <DestinationCard destination={destination} key={destination.id} />
                    )
                  })}
                </Row>
              </Container>
              :
              <Spinner />
            }
          </Col>
        </Row>
      </Container>

    </>
  )
}