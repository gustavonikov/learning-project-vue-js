import api from '../services/api'

const success = res => res
const error = error => {
	if (error.response.status === 401) {
		window.location = '/'
	} else {
		return Promise.reject(error)
	}
}

api.interceptors.response.use(success, error)