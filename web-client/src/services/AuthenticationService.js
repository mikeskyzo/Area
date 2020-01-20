import Api from '@/services/Api'

export default {
  register (credentials) {
    return Api().post('createUser', credentials)
  },
  login (credentials) {
    return Api().post('login', credentials)
  }
}
