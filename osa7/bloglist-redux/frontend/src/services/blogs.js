import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then((response) => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, newObject, config)
  return response.data
}

const update = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  }

  const url = `${baseUrl}/${newObject.id}`
  const response = await axios.put(url, newObject, config)
  return response.data
}

const deleteItem = async (blogId) => {
  const config = {
    headers: { Authorization: token },
  }

  const url = `${baseUrl}/${blogId}`
  const response = await axios.delete(url, config)
  return response.data
}

export default {
  getAll,
  create,
  update,
  deleteItem,
  setToken,
}
