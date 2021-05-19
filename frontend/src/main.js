import Vue from 'vue'
import App from './App.vue'

import 'font-awesome/css/font-awesome.css'
import './config/bootstrap'
import './config/notifications'
import './config/axios'
import './config/mq'
import store from './config/store'
import router from './routes'

Vue.config.productionTip = false

new Vue({
	store,
	router,
	render: h => h(App),
}).$mount('#app')
