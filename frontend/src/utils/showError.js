import Vue from 'vue'

export default function showError(error) {
	if (error && error.response && error.response.data) {
		Vue.toasted.global.defaultError({ message: error.response.data })
	} else if (typeof error === 'string') {
		Vue.toasted.global.defaultError({ message: error })
	} else {
		Vue.toasted.global.defaultError()
	}
}
