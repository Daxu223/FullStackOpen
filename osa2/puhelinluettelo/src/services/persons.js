import axios from 'axios'
const baseUrl = "/api/persons"

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = newObject => {
    const request = axios.post(baseUrl, newObject)
    // Response data is the POST requests body itself, 
    // like JSON object { name: example, number: 123 }
    return request.then(response => response.data)
}

const deletePerson = (id) => {
    const request = axios.delete(`${baseUrl}/${id}`)
    return request.then(response => response.data)
}

const update = (newObject, id) => {
    const request = axios.put(`${baseUrl}/${id}`, newObject)
    return request.then(response => response.data)
}

export default { getAll, create, update, deletePerson }