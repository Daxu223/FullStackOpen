import React, { useState, useEffect } from 'react'
import axios from 'axios'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  // Initial value is set to name on first render.
  const [country, setCountry] = useState(name)

  // Formulate a GET-request for the current country.
  const fetchCountry = async () => {
    const baseUrl = 'https://studies.cs.helsinki.fi/restcountries/api/name'
    
    try {
      const response = await axios.get(`${baseUrl}/${name}`)
      const responseData = response.data

      setCountry(
        { 
          found: true, 
          data: {
            name: responseData.name.common,
            capital: responseData.capital,
            population: responseData.population,
            flag: responseData.flags.png
          }
        }
      )
    } catch (error) {
      setCountry({ found: false })
    }
  }

  // useEffect because otherwise the hook would not update itself.
  useEffect(() => {
    fetchCountry()
  }, [name])

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return null
  }

  if (!country.found) {
    return (
      <div>
        not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name} </h3>
      <div>capital {country.data.capital} </div>
      <div>population {country.data.population}</div> 
      <img src={country.data.flag} height='100' alt={`flag of ${country.data.name}`}/>  
    </div>
  )
}

const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')

  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

export default App