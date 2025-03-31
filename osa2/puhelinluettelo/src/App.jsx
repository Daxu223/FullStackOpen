import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {

  // Set initial state for persons and store objects in array
  const [persons, setPersons] = useState([])

  // Not sure where to put this
  useEffect(() => {
    console.log("effect")
    axios
      .get("http://localhost:3001/persons")
      .then(response => {
          console.log("promise fulfilled")
          setPersons(response.data)
      })
  }, [])

  console.log("rendered", persons.length, 'persons')
  // Used to control the form input field
  const [newName, setNewName] = useState('')

  // Used to set number for person
  const [newNumber, setNewNumber] = useState('')

  // Used to filter persons in a form
  const [filter, setNewFilter] = useState('')

  // Updates hooks based on name when a form is changed
  const handleFormChange = (event) => {
    const { name, value } = event.target;
    if (name === "name") {
      setNewName(value);
    } else if (name === "number") {
      setNewNumber(value);
    } else if (name === "filter") {
      setNewFilter(value);
    }
  }

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === personObject.name)) {
      alert(`${personObject.name} has already been added to phonebook`)
    } else {
      setPersons(persons.concat({ ...personObject, id: persons.length + 1 }))
    }
  
    // Reset form input field state
    setNewName('')
    setNewNumber('')
  }

  const filteredPersons = (persons) => {


    return persons.filter(person => person.name.toLowerCase().startsWith(filter))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Input text="filter shown with " inputName="filter" handleFunction={handleFormChange} />
      
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <Input text="name: " inputName="name" handleFunction={handleFormChange} />
        <Input text="number: " inputName="number" handleFunction={handleFormChange} />
        <Button type="submit" text="add" />
      </form>
      
      <h2>Numbers</h2>
      <Persons personList={filteredPersons(persons)}/>

    </div>
  )
}

const Button = ({type, text}) => {
  return (
    <div><button type={type}>{text}</button></div>
  )
}

const Person = ({name, number}) => {
  return (
    <p>{name} {number}</p>
  )
}

const Input = ({text, inputName, handleFunction}) => {
  return (
    <div>{text}<input name={inputName} onChange={handleFunction} /></div>
  )
}

const Persons = ({personList}) => {
  return (
  <div>
    {personList.map(person => <Person key={person.id} name={person.name} number={person.number} />)}
  </div>
  )
}

export default App