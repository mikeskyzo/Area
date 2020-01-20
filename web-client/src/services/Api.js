import axios from 'axios'

// eslint-disable-next-line no-unused-vars
const server = `http://server:8080/`;
// eslint-disable-next-line no-unused-vars
const local = `http://localhost:8080/`;

export default () => {
  return axios.create({
    baseURL: local
  })
}
