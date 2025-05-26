import { useState, useEffect } from 'react'
import phonebookService from './services/persons'

const App = () => {

  // Set initial state for persons and store objects in array
  const [persons, setPersons] = useState([])

  useEffect(() => {
    phonebookService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
    }, [])

  // Used to control the form input field
  const [newName, setNewName] = useState('')

  // Used to set number for person
  const [newNumber, setNewNumber] = useState('')

  // Used to filter persons in a form
  const [filter, setNewFilter] = useState('')

  const [message, setMessage] = useState(null)

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

    // Set personObject based on the current state in the hooks
    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.some(person => person.name === personObject.name)) {
      // If some person was found, we need to find the object of that found name
      const updatablePerson = persons.find(person => person.name === personObject.name)

      if (window.confirm(`${updatablePerson.name} is already added in the phonebook. Replace the old number with a new one?`))
        phonebookService
        .update(personObject, updatablePerson.id)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== updatablePerson.id ? person : returnedPerson))
        })
    } else {
      phonebookService
      .create(personObject)
      .then(returnedPerson => {
        // Then the original list is concatanated with the response, creating a new list.
        setPersons(persons.concat(returnedPerson))
        console.log("Rendered", persons.length, 'persons')

        // Generate inline css for adding contact
        setMessage(`Added ${personObject.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 4000)

        // Reset form input field state
        setNewName('')
        setNewNumber('')
      })
    }
  }

  const filteredPersons = (persons) => {
    return persons.filter(person => person.name.toLowerCase().startsWith(filter))
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Input text="filter shown with " inputName="filter" handleFunction={handleFormChange} />
      
      <h2>add a new</h2>
      <form onSubmit={addName}>
        <Input text="name: " inputName="name" value={newName} handleFunction={handleFormChange} />
        <Input text="number: " inputName="number" value={newNumber} handleFunction={handleFormChange} />
        <Button type="submit" text="add" onClickEvent={null} />
      </form>
      
      <h2>Numbers</h2>
      <Persons personList={filteredPersons(persons)} setPersons={setPersons} />

    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="success">
      {message}
    </div>
  )
}

const Button = ({ type, text }) => {
  return (
    <div><button type={type}>{text}</button></div>
  )
}

const Person = ({ name, number }) => {
  return (
    <span>
      {name} {number}
    </span>
  )
}

const Input = ({ text, inputName, value, handleFunction}) => {
  return (
    <div>{text}<input name={inputName} value={value} onChange={handleFunction} /></div>
  )
}

const Persons = ({ personList, setPersons }) => {
  return (
    <div>
      {personList.map(person => {
        return (
          <div key={person.id}>
            <Person name={person.name} number={person.number} />
            <DeleteButton id={person.id} name={person.name} setPersons={setPersons} />
          </div>
          )
        })
      }
    </div>
  )
}

const DeleteButton = ({ id, name, setPersons }) => {
  const handleDelete = id => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      phonebookService
      .deletePerson(id)
      .then(() => {
          setPersons(prevPersons => prevPersons.filter(person => person.id !== id))
        })
      }
    }
  return (
    <button type="button" onClick={() => handleDelete(id)}>delete</button>
  )
}

export default App