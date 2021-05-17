<template>
	<div class="auth-content">
		<div class="auth-modal">
			<img src="../../assets/logo.png" width="200" alt="Logo">
			<hr>
			<div class="auth-title">
				{{ showSignup ? 'Cadastro' : 'Login' }}
			</div>
			<input name="name" type="text" v-if="showSignup" v-model="user.name" placeholder="Nome">
			<input name="email" type="email" v-model="user.email" placeholder="E-mail">
			<input name="password" type="password" v-model="user.password" placeholder="Senha">
			<input 
				type="password" 
				v-if="showSignup" 
				v-model="user.confirmPassword"
				placeholder="Confirme a senha"
			>

			<button v-if="showSignup" @click="signUp">Registrar</button>
			<button v-else @click="signIn">Entrar</button>

			<a href @click.prevent="showSignup = !showSignup">
				<span v-if="showSignup">Já tem cadastro? Faça o login!</span>
				<span v-else>Não tem cadastro? Clique aqui para se registrar!</span>
			</a>
		</div>
	</div>
</template>

<script>
import api from '../../services/api'
import showError from '../../utils/showError'
import userKey from '../../utils/userKey'

export default {
	name: 'Auth',
	data() {
		return {
			showSignup: false,
			user: {}
		}
	},
	methods: {
		signIn() {
			api.post('/signin', this.user)
				.then(res => {
					this.$store.commit('setUser', res.data)
					localStorage.setItem(userKey, JSON.stringify(res.data))

					this.$router.push({ path: '/' })
				})
				.catch(showError)
		},
		signUp() {
			api.post('/signup', this.user)
				.then(() => {
					this.$toasted.global.defaultSucess()
					this.user = {}
					this.showSignup = false
				})
				.catch(showError)
		}
	}
}
</script>

<style>
	.auth-content {
		height: 100%;

		display: flex;
		align-items: center;
		justify-content: center;
	}

	.auth-modal {
		background-color: #fff;
		box-shadow: 0 1px 5px rgba(0, 0, 0, .15);

		width: 350px;

		padding: 35px;

		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.auth-title {
		font-size: 1.2rem;
		font-weight: 100;
		margin-top: 10px;
		margin-bottom: 15px;
	}

	.auth-modal input {
		border: 1px solid #bbb;
		width: 100%;
		margin-bottom: 15px;
		padding: 3px 8px;
		outline: none;
	}

	.auth-modal button {
		align-self: center;

		background-color: #2460ae;
		color: #fff;

		padding: 8px 15px;

		border: none;

		margin-top: 10px;
		width: 100px;
	}

	.auth-modal a {
		margin-top: 35px;

		text-decoration: none;
	}

	.auth-modal a:hover {
		text-decoration: underline;
		text-underline-position: under;
	}

	.auth-modal hr {
		border: 0;
		width: 100%;
		height: 1px;
		background: linear-gradient(to right, rgba(120, 120, 120, 0), rgba(120, 120, 120, .75), rgba(120, 120, 120, 0));
	}
</style>