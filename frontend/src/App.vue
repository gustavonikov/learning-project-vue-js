<template>
	<div id="app" :class="{ 'hide-menu': !isMenuVisible || !user }">
		<Header 
			title="Nikov - Learning Vue.Js" 
			:hideToggle="!user" 
			:hideUserDropdown="!user" 
		/>
		<Menu v-if="user" />
		<Loading v-if="validatingToken" />
		<Content v-else />
		<Footer />
	</div>
</template>

<script>
import { mapState } from 'vuex'
import Content from './components/template/Content'
import Header from './components/template/Header'
import Menu from './components/template/Menu'
import Footer from './components/template/Footer'
import Loading from './components/template/Loading'

import userKey from './utils/userKey'
import api from './services/api'

export default {
	name: 'App',
	components: {
		Content,
		Header,
		Menu,
		Footer,
		Loading
	},
	computed: mapState(['isMenuVisible', 'user']),
	data() {
		return {
			validatingToken: true,
		}
	},
	methods: {
		async validateToken() {
			this.validatingToken = true

			const json = localStorage.getItem(userKey)
			const userData = JSON.parse(json)
			this.$store.commit('setUser', null)

			if (!userData) {
				this.validatingToken = false

				this.$router.push({ name: 'auth' })

				return
			}

			const response = await api.post('/validateToken', userData)

			if (response.data) {
				this.$store.commit('setUser', userData)

				if (this.$mq === 'xs' || this.$mq === 'sm') {
					this.$store.commit('toggleMenu', false)
				}
			} else {
				localStorage.removeItem(userKey)
				this.$router.push({ name: 'auth' })
			}

			this.validatingToken = false
		}
	},
	created() {
		this.validateToken()
	}
};
</script>

<style>
	* {
		font-family: 'Lato', sans-serif;
	}

	body {
		margin: 0;
	}

	#app {
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		
		height: 100vh;

		display: grid;
		grid-template-rows: 60px 1fr 40px;
		grid-template-columns: 300px 1fr;
		grid-template-areas: 
			'header header'
			'menu content'
			'menu footer'
		;
	}

	#app.hide-menu {
		grid-template-areas: 
			'header header'
			'content content'
			'footer footer'
			;
	}
</style>
