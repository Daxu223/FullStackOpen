import axios from 'axios'
const baseUrl = '/api/login'

const login = async credentials => {
  // Returns a promise object, so await is needed to resolve the promise.
  const response = await axios.post(baseUrl, credentials)

  // TODO: If token expires, log user out.
  return response.data
}

export default { login }